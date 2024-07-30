import { getColors, getRecentSongs } from "@/components/supabase"
import { getProfile } from "./spotify"

export async function getHomePageInfo(){
    const recentSongsData = await getRecentSongs(0, 7)
    const recentColorsData = await getColors(6)
    const spotifyProfileData = await getProfile()

    return {recentSongs: recentSongsData, recentColors: recentColorsData, spotifyProfile : spotifyProfileData}
}