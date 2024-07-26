
"use server"
import {cookies} from 'next/headers'


const cookieStore = cookies();

export async function getProfile(){
    const access = cookieStore.get('access');

    const response = await fetch ("https://api.spotify.com/v1/me" ,{
        headers: {
            Authorization : `Bearer ${access.value}`
        },
    });

    if (response.status == 204 || response.status > 400){
        return false; 
    }
    const data = await response.json();
    //console.log("data: ", data);
    
    const name = data.display_name;
    const pic = data.images[1].url;

    return ({
         name,
         pic 
    });
}

export async function getSpotifyID(){
    const access = cookieStore.get('access');

    const response = await fetch ("https://api.spotify.com/v1/me" ,{
        headers: {
            Authorization : `Bearer ${access.value}`
        },
    });

    if (response.status == 204 || response.status > 400){
        console.log("error retrieving id from spotify")
        return false; 
    }
    const data = await response.json();
    
    const id = data.id; 
    return id; 

}

export async function search(query, limit){
    const type = "album,track,artist"
    const access = cookieStore.get("access")
 
    console.log("AT SEARCH")
    const result = await fetch("https://api.spotify.com/v1/search?q=" + query + "&type=" + type + "&limit=" + limit ,{
        headers: {
            Authorization : `Bearer ${access.value}`
        },
    });

    if (result.status != 200){
        console.log("error in searching: ", result)
        return null;
    }

    else {
        const data = await result.json();

        //console.log("retrievies items: ", data)
        //console.log("attemp to retrieve albums: ", data.tracks)
        return data.tracks;
    }

}


export async function createPlaylist(userID, name, description){
    console.log("at spotify create playlist", userID)
    console.log(description)

    const access = cookieStore.get('access')
    const result = await fetch ("https://api.spotify.com/v1/users/" + userID + "/playlists", {
        method: "POST", 
        headers: {
            Authorization : `Bearer ${access.value}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": name,
            "description": description,
            "public": false
        })
         
    })

    if (result.status != 201) {
        console.log("ERROR MAKING PLAYLIST", result)
    } else {
        const data = await result.json();
        console.log("result from playlist: ", result)
        return {url: data.external_urls.spotify, id: data.id}
    }

}

export async function addTracks(playlist_id, uris){
    const access = cookieStore.get('access')
    const result = await fetch('https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks', {
        method: "POST", 
        headers: {
            Authorization : `Bearer ${access.value}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "uris": uris
        }) 
    })

    if (result.status != 201){
        console.log("ERROR ADDING TRACKS", result)
    }
    else {
        console.log("adding songs success")
    }
}

export async function removeTracks(playlist_id, uris){
    const access = cookieStore.get('access')
    //console.log("uris", uris)

    let uriArray = uris.map((item) => ({uri : item}))
    //console.log("URI array:", uriArray)
    
    const result = await fetch('https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks', {
        method: "DELETE", 
        headers: {
            Authorization : `Bearer ${access.value}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "tracks": uriArray
        }) 
    })

    if (result.status != 200){
        console.log("ERROR DELETING TRACKS", result)
    }
    else {
        console.log("deleting songs success")
    }
    


}


export async function checkFollowing(playlist_id){
    const access = cookieStore.get('access')

    const result = await fetch ("https://api.spotify.com/v1/playlists/" + playlist_id + "/followers/contains", {
        headers: {
            Authorization : `Bearer ${access.value}`
        }
    })

    if (result.status != 200){
        console.log("ERROR CHECKIG IF FOLLOWING", result)
    } else {
        const data = await result.json();
        console.log(data)
        return data[0]
    }
}

export async function unfollowPlaylist(playlist_id){
    const access = cookieStore.get("access")

    const result = await fetch ("https://api.spotify.com/v1/playlists/" + playlist_id + "/followers/", {
        method : "DELETE",
        headers: {
            Authorization : `Bearer ${access.value}`
        }
    })

    if (result.status != 200){
        console.log("ERROR UNFOLLOWING PLAYLIST: ", result)
    } else {
        console.log("playlist unfollowed")
    }


}

export async function changePlaylistCover(playlist_id, image){
    const access = cookieStore.get("access")
    console.log("image:", image)
    console.log("buffer", Buffer.from(image, 'base64'))

    const result = await fetch("https://api.spotify.com/v1/playlists/"+ playlist_id + "/images", {
        method: 'PUT',
        headers: {
            Authorization : `Bearer ${access.value}`,
            'Content-Type': 'image/jpeg'
        },
        body: 
            image
        
        
    });

    if (result.status != 202){
        console.log("ERROR UPDATING PLAYLIST PHOTO", result)
    }
    
}
