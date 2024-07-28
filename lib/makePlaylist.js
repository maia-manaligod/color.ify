"use server"

import { createClient } from "@/utils/supabase/server";
import { addTracks, changePlaylistCover, getSpotifyID } from "./spotify";
import { createPlaylist } from "./spotify";
import { generateColorImage } from "./generateImage";


export async function createNewPlaylist(name, description, songArray, hex){
    //GET USER ID
    const supabase = createClient();

    //get user from supabase
    const {data: user, error: userError} = await supabase.auth.getUser();

    if (userError){ console.log("ERROR GETTING SUPABASE USER: ", userError)}

    // look for associated spotify id in supabase

    const {data: tableData, error: tableError} = await supabase
    .from('users')
    .select("spotify_id")
    .eq('id', user.user.id)

    let spot_id = tableData[0].spotify_id

    if (spot_id == null){ //get from spotify
        console.log("data empty: ", tableData)
        
        spot_id= await getSpotifyID()

        const {error} = await supabase
        .from('users')
        .update({ 'spotify_id' : spot_id})
        .eq('id', user.user.id)

        if (error){
            console.log(error)
        }
        
    }


    //CREATE PLAYLIST 

    let playlist = await createPlaylist(spot_id, name, description)

    //ADD SONGS

    //make array of all urls 
    let songs = []

    songArray.forEach((item) => {
        songs.push(item.spotify_uri)
    })
    console.log(songs)

    //add tracks
    await addTracks(playlist.id, songs)

    //PUSH PLAYLIST INFO TO SUPABSE
    const {error} = await supabase
        .from('colors')
        .update({ 'linked_playlist' : playlist.url, "playlist_id" : playlist.id })
        .eq('hex', hex)

    if (error){
        console.log(error)
    }

     //ADD COLOR

     const image = await generateColorImage(hex, 200, 200)
     changePlaylistCover(playlist.id, image)

    return {playlistLink: playlist.url, playlistId: playlist.id}



}
