"use server"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation"

export async function pushColor(color, name, description){
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser();
    console.log(user)
    if (!user){
        redirect("/error")
    }

    const colorObj = {
        colorName : name, 
        hex: color, 
        description: description, 
        user: user.id
    }

    try {
        const {error} = await supabase.from("colors").insert(colorObj)
        if (error){
            console.log(error)
        } else {
            console.log("color push successful")
        }
    }

    catch (err){
        console.log("ERROR: ", err)
    }
}


export async function pushSong(color, name, id, artists, album_id, albumName, image, uri){
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser();
    console.log(user)

    let artArray = []
    let artIDArray = []
    artists.forEach(item => {
        artArray.push(item.name)
        artIDArray.push(item.id)
    }
    )
       
    
    console.log("artist array: ", artArray)
    console.log("artistID", artIDArray)

    console.log("in supabase: ", color, name, id, album_id, albumName)


    const songObj = {
        song_id: id, 
        name: name,
        color: color, 
        user : user.id, 
        artist: artArray, 
        artist_id: artIDArray, 
        album: albumName, 
        album_id: album_id, 
        image_url : image, 
        spotify_uri: uri
    }

    const songs_colorsObj = {
        song_uri: uri, 
        song_color: color,
        user_id: user.id
    }

    try {
        const {error} = await supabase.from("songs").upsert(songObj, {onConflict: 'spotify_uri'})
        if (error){
            console.log(error)
        } else {
            console.log("song push successful")
            const {error2} = await supabase.from("songs_colors").insert(songs_colorsObj)

            if (error2){
                console.log(error2)
            } else {
                return {success: true}
            } 
        }
    }

    catch (err){
        console.log("ERROR: ", err)
    }  

}

export async function getColors(limit){
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser();
    console.log(user)
    if (!user){
        redirect("/error")
    }

    if (limit){
        const {data: colorData, error: colorError} = await supabase
        .from('colors')
        .select('colorName, hex')
        .eq('user', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

        if (colorError){
            console.log("error fetching colors: ", colorError)
            return {success: false}
        }

        return {colorData}
    }

    else {
        const {data: colorData, error: colorError} = await supabase
        .from('colors')
        .select('colorName, hex')
        .eq('user', user.id)
        .order('created_at', { ascending: false });

        if (colorError){
            console.log("error fetching colors: ", colorError)
            return {success: false}
        }
        return {colorData}
    }
    
    //console.log("at supabase:", colorData)
    //console.log("trimmed hex: ", trimmed)
}



export async function getColorInfo(hex){
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser();
    if (!user){
        redirect("/error")
    }

    let color = "#" + hex; 

    const {data: colorData, error: error}  = await supabase
    .from('colors')
    .select('colorName, description, linked_playlist, playlist_id')
    .match({user: user.id, hex: color})
    .order('created_at', { ascending: true });

    if (error){
        console.log(error)
    } 
    else {
        return {success: true, data: colorData[0]}
    }
    
}

export async function getSongs(hex){
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser();
    if (!user){
        redirect("/error")
    }

    let hexColor = "#" + hex; 
    console.log("color: ", hexColor)

    /*
    const {data: songData, error: error} = await supabase
    .from('songs')
    .select('name, artist, album, image_url, spotify_uri')
    .match({user: user.id, color: hexColor})
    */
   const {data: songData, error: error} = await supabase
   .rpc('get_songs_by_color', {user_color: hexColor, user_id: user.id })


    if (error){
        console.log(error)
    } 
    else {
        console.log(songData)
        return {success: true, data: songData}
    }

}

export async function removeSongs(song, color){
    const supabase = createClient()
    let list = []

    const {data: {user}} = await supabase.auth.getUser();
    if (!user){
        console.log("ERROR: NO USER")
    }

   // console.log("at supabase remove song: ", songsArray)
/*
    songsArray.forEach((item) => {
        list.push(item.spotify_uri)
    })
    */

    const {data: data, error: error} = await supabase
        .from('songs_colors')
        .delete()
        .match({user_id: user.id, song_color: color, song_uri : song.spotify_uri})

     //   .in('song_uri', list)

    if (error){
        console.log("ERROR DELETING SONG IN SUPABSE", error)
    } else {
        console.log("supabase deletion successful")
        const {data: data2,  error: error2} = await supabase
        .from('songs_colors')
        .select('song_uri')
        .eq('song_uri', song.spotify_uri)
        if (error2){
            console.log("error finding if song still exists in songs_colors", error2)
        }

        console.log("data remaining: ", data2)
        if (data2.length == 0){
            console.log("deleting", song.spotify_uri)
            const {data: data3, error: error3} = await supabase
            .from('songs')
            .delete()
            .match({user: user.id, spotify_uri : song.spotify_uri})

            if (error3){
                console.log("ERROR DELETING LAST SONG", error3)
            }
        }
    }
}



export async function deletePlaylistSupabase(playlist_id){
    const supabase = createClient();


    const {error} = await supabase
        .from('colors')
        .update({ 'linked_playlist' : null, "playlist_id" : null})
        .eq('playlist_id', playlist_id)
    
    if (error){
        console.log("ERROR REMOVING PLAYLIST FROM SUPABASE: ", error)
    }


}


export async function deleteColor(hex, redirectBool){
    const supabase = createClient();

    const {data: data, error: error} = await supabase
        .from('colors')
        .delete()
        .eq('hex', hex)

    if (error){
        console.log("ERROR DELETING color IN SUPABSE", error)
    } else {
        console.log("supabase color deletion successful")
        if (redirectBool) {redirect('/colors')}
    }
}


export async function getRecentSongs(offset, limit){
    const supabase = createClient();

    const {
        data: {user},
    }  = await supabase.auth.getUser()

    if (!user){console.log("error retreiving user when fetching revent songs")}
/*
    const {data: data, error: error} = await supabase
        .from('songs')
        .select("*")
        .eq('user', user.id)
        .range(start, end)
        .order('created_at', { ascending: false });
*/

    const {data: data, error: error} = await supabase
    .rpc('get_recently_added_songs', {offset_int: offset, number: limit})
    //console.log("retreving songs: ", data, error)
    console.log("results:", data, error)
    if(error){ console.log(error)}
    if (!error){return data}

}




export async function getSongsSearched(query, offset_int, number){
    const supabase = createClient()

    const {
        data: {user}
    } = await supabase.auth.getUser()

    if (!user) { console.log("error retrieving user when fetching searched songs")}

    else {
        try {
            const {data, error} = await supabase
            .rpc('search_songs', {search_text: query, user_id: user.id, offset_int : offset_int, number: number})

            if (error) { console.log(error); throw error}

            console.log(data)
            console.log("result from search: ", data)
            return data

        } catch (error){
            console.log("ERROR IN SONG SEARCHING SUPABASE")
            
        }
        

        


        
    }
}