import { getColors, getRecentSongs } from "@/components/supabase"
import { getProfile } from "./spotify"
import { createClient } from "@/utils/supabase/server"

export async function getHomePageInfo(){
    const [recentSongsData, recentColorsData, spotifyProfileData] = await Promise.all([
        getRecentSongs(0, 7),
        getColors(6),
        getProfile()
    ])
    //const recentSongsData = await getRecentSongs(0, 7)
    //const recentColorsData = await getColors(6)
    //const spotifyProfileData = await getProfile()

    return {recentSongs: recentSongsData, recentColors: recentColorsData, spotifyProfile : spotifyProfileData}
}