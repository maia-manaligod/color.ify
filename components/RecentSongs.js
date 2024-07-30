import { useEffect, useState } from "react"
import { getRecentSongs } from "./supabase"
import { SongSupabase, SongWithColor } from "./song"

export default function RecentSongs(){
    const [songs, setSongs] = useState([])
    const[loading, setLoading] = useState(true)

    useEffect ( () => {
        getRecentSongs(0, 7).then((result) => {
            if (result != null){
                console.log("RECENT SONGS:" , result)
                setSongs(result)
                setLoading(false)

            }
            
        })

    }, [])
    

    return (
        <div className = "stpage">
            {loading && <div><a>loading...</a></div>}
            {!loading && 
                <div>
                    <h3>Recently Added</h3>
                    {songs.map((item) => 
                        <div> 
                           <SongWithColor key = {item.id} object = {item}/>
                        </div>
                    )}
                <a href = "/songs">see songs &gt;&gt;</a>
                </div> 
                
            }
        </div>
        
    )

    
}