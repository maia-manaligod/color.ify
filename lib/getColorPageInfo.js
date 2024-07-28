"use server"

import { deletePlaylistSupabase, getColorInfo, getSongs } from "@/components/supabase";
import { checkFollowing } from "./spotify";

export async function getColorPageInfo(hex){
    const colorInfo = await getColorInfo(hex)
    const songInfo = await getSongs(hex)
    

    const playlistLink = colorInfo.data.linked_playlist
    const playlistID = colorInfo.data.playlist_id
    console.log("playsistID at validation", playlistID)

    if (playlistID != null){
        const playlistValid = await checkFollowing(playlistID)
        console.log("following? ", playlistValid)

        if (playlistValid){
            return {colorInfo: colorInfo.data, songInfo: songInfo.data, playlist: {playlistId: playlistID, playlistLink: playlistLink}}
        }

        else {
            await deletePlaylistSupabase(playlistID)
        }
    } 

    return {colorInfo: colorInfo.data, songInfo: songInfo.data, playlist: {playlistId: null, playlistLink: null}}

    
        
    

    

    
}