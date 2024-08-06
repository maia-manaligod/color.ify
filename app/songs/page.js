"use client" 
import { Navigation } from "@/components/Navigation"
import { useState, useEffect } from "react"
import { SongWithColor } from "@/components/song"
import { getRecentSongs, getSongsSearched } from "@/components/supabase"

export default function SongPage(){

    const [songs, setSongs] = useState([])
    const [recentSongs, setRecentSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [range, setRange] = useState([0,100])

    const [query, setQuery] = useState('')

    useEffect(() => {
        getSongsSearched('', range[0], range[1]).then((result) => {
            setSongs(result)
            setLoading(false)
        })
    }, [])

    //search filter
    function search(e){
        e.preventDefault(); 
        const formData = new FormData(e.target);
        console.log(formData.get('query'))
        getSongsSearched(formData.get('query'), range[0], range[1]).then((result) => {
                setRecentSongs(songs)
                console.log(result);
                setSongs(result) 
            })
    }

    const handleSubmit = (e) => {
        setRecentSongs(songs)
        getSongsSearched(e.target.value).then((result) => {
            console.log("searched?")

        })

        
    }

    const handleChange = (e) =>{ 
        
        if (e.target.value == '' && recentSongs != []){
            console.log(recentSongs)
            console.log("reset")
            setSongs(recentSongs)
            setRecentSongs([])
        }
    
    }

    return (
        <div>
            <Navigation/>
            <div className = "stpage">
                <a>songs</a>
                {!loading && 
                    <div>
                        <form onSubmit = {search}>
                            <input type = "text" name = "query" id = "query" onChange = {handleChange}></input>
                        </form>
                        
                        {songs.map((item) => 
                        <div> 
                           <SongWithColor key = {item.id} object = {item}/>
                        </div>
                        )}
                    </div>
                    
                }
            </div>
            
            
        </div>
    )
}