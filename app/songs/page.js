"use client" 
import { Navigation } from "@/components/Navigation"
import { useState, useEffect } from "react"
import { SongWithColor } from "@/components/song"
import { getRecentSongs, getSongsSearched } from "@/components/supabase"

export default function SongPage(){

    const [songs, setSongs] = useState([])
    const [recentSongs, setRecentSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [range, setRange] = useState([0,30])

    const [query, setQuery] = useState('')

    useEffect(() => {
        getRecentSongs(range[0], range[1]).then((result) => {
            setSongs(result)
            setLoading(false)
        })
    }, [])

    


//search filter (client side)
/*
    const searchFilter = (array) => {
        const regEx = new RegExp(`\\b${query}`, 'i')
        return array.filter(
            (el) => regEx.test(el.name) || regEx.test(el.album) || 
                el.artist.some((item) => regEx.test(item))
        )  
    }

    const filtered = searchFilter(songs)

    const handleChange = (e) => {
        setQuery(e.target.value)
    }

    <input onChange = {handleChange} type = 'text'/>
*/

    function search(e){
        e.preventDefault(); 
        const formData = new FormData(e.target);
        console.log(formData.get('query'))
        getSongsSearched(formData.get('query')).then((result) => {
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