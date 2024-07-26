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
    try {
        const {error} = await supabase.from("songs").insert(songObj)
        if (error){
            console.log(error)
        } else {
            console.log("song push successful")
            return {success: true}
            
        }
    }

    catch (err){
        console.log("ERROR: ", err)
    }  

}

export async function getColors(){
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser();
    console.log(user)
    if (!user){
        redirect("/error")
    }

    const {data: colorData, error: colorError} = await supabase
    .from('colors')
    .select('colorName, hex')
    .eq('user', user.id)
    .order('created_at', { ascending: false });

    if (colorError){
        console.log("error fetching colors: ", colorError)
        return {success: false}
    }

    console.log("at supabase:", colorData)



    //console.log("trimmed hex: ", trimmed)

    return {colorData}


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

    const {data: songData, error: error} = await supabase
    .from('songs')
    .select('name, artist, album, image_url, spotify_uri')
    .match({user: user.id, color: hexColor})


    if (error){
        console.log(error)
    } 
    else {
        return {success: true, data: songData}
    }

}

export async function removeSongs(songsArray){
    const supabase = createClient()
    let list = []

    console.log("at supabase remove song: ", songsArray)

    songsArray.forEach((item) => {
        list.push(item.spotify_uri)
    })

    const {data: data, error: error} = await supabase
        .from('songs')
        .delete()
        .in('spotify_uri', list)

    if (error){
        console.log("ERROR DELETING SONG IN SUPABSE", error)
    } else {
        console.log("supabase deletion successful")
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


export async function getRecentSongs(start, end){
    const supabase = createClient();

    const {
        data: {user},
    }  = await supabase.auth.getUser()

    if (!user){console.log("error retreiving user when fetching revent songs")}

    const {data: data, error: error} = await supabase
        .from('songs')
        .select("*")
        .eq('user', user.id)
        .range(start, end)
        .order('created_at', { ascending: false });

    //console.log("retreving songs: ", data, error)
    if (!error){return data}

}




export async function getSongsSearched(query){
    const supabase = createClient()

    const {
        data: {user}
    } = await supabase.auth.getUser()

    if (!user) { console.log("error retrieving user when fetching searched songs")}

    else {
        try {
            const {data, error} = await supabase
            .rpc('search_songs', {search_text: query, user_id: user.id})

            if (error) { console.log(error); throw error}

            console.log(data)
            console.log("result from search: ", data)
            return data

        } catch (error){
            console.log("ERROR IN SONG SEARCHING SUPABASE")
            
        }
        

        


        
    }
}