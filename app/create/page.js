"use client"

import Picker from '@/components/colorPicker/Picker'
import { Navigation } from '@/components/Navigation' 
import { useState, useRef } from 'react'
import SongSearch from '@/components/spotifyAPI/search'
import { ChosenSong } from '@/components/songClient'
import { pushSong, pushColor, pushSongs } from '@/components/supabase'
import PopModal from '@/components/style/popModal'
import { useRouter } from 'next/navigation'




export default function(){

    const [hex, setHex] = useState();
    const [selected, setSelected] = useState([]);

    const [show, setShow] = useState(false)
    const modal = useRef(null)
    
    const router = useRouter()

    function setFinalHex(hex){
        setHex(hex)
        console.log(selected)
        
    }

    function removeSong({Song}){
        console.log("previous, " , selected)
        let arr = [...selected]
        console.log("Song: ", Song)
        console.log("arr: ", arr[0]);
        const index = arr.findIndex(song => song.Song.props.object == Song.props.object
        )
        console.log("index: ", index)
  
        if (index > -1){
            arr.splice(index, 1)
            console.log("after splice", arr)
            setSelected(arr)
        }
    }

    function commitPlaylist(formData){
        const title = formData.get('title')
        const description = formData.get('description')
        console.log("pushing at page, ", hex, title, description)
        pushColor(hex, title, description)

        const songs = selected.map((item) => {
            return item.Song.props.object
        })
        console.log(songs)
        /*
        console.log("songs:", songs)

        const songsArray = selected.map((item) => {
            return {hex: hex, name: item.Song.props.object.name, song_id: item.Song.props.object.id, 
            artists: item.Song.props.object.artists, 
            album_id: item.Song.props.object.album.id, album: item.Song.props.object.album.name, 
            image_url: item.Song.props.object.album.images[0].url, 
            spotify_uri: item.Song.props.object.uri}
        });
        console.log("selected: ", selected)

        console.log("songs array;" , songsArray)
*/
        pushSongs(hex, songs).then(
            () => {
                router.push('/colors')
            }
        )
/*
        const pushSongPromises = selected.map(item => {
            pushSong(hex, item.Song.props.object.name, item.Song.props.object.id, 
                item.Song.props.object.artists, 
                item.Song.props.object.album.id, item.Song.props.object.album.name, 
                item.Song.props.object.album.images[0].url, 
                item.Song.props.object.uri
            );
        })
        //console.log("pushing at page: ", selected, hex)
        Promise.allSettled(pushSongPromises).then((results) => {
            console.log("songs pushed", results)
            //router.push('/colors')
            console.log("router?")
        })
        */
      
    }


    return(
        <>
        <Navigation />
        <div className = "stpage">

            <div className = "rowPage">

                <div className = "colPage">
                    <>select a color to get started</>
                    <Picker setFinalHex = {setFinalHex}/>
                    {selected != [] && 

                        <ul>
                        {selected.map(item => (
                            <div style = {{width: "400px"}} >
                                <ChosenSong Song = {item.Song} removeSong={removeSong} unselect = {item.unselect} show = {true}/>
                            </div>
                        ))}
                        </ul> 
                        }
                </div>
                


                {hex && 
                      <div>
                            <div className = "rowPage">
                                <PopModal modal={modal} show={show} onClose={() => setShow(false)}>
                                    <div className = "colPage" style = {{backgroundColor: "white", padding: "20px"}}>
                                        <div className = "rowPage">
                                            <div style = {{width: "200px", height: "200px", backgroundColor: hex}}></div>
                                           
                                                
                                                <div className = "colForm">
                                                    <a>{hex}</a>
                                                    <form>
                                                                
                                                        <input id = "title" type = "text" name = "title" placeHolder = {hex}></input>
                                                        <textarea id = "description" type = "text" name = "description" placeHolder = "description"></textarea>
                                                        <button formAction = {commitPlaylist}>Save</button>
            
                                                    </form>
                                                </div>
                                        </div>
                                        
                                        <a>{hex}</a>
                                        {selected.map(item => (
                                            <div>
                                                
                                                
                                               {item.Song}
                                            </div>
                                        ))}
                                    
                                    </div>
                                </PopModal>
                                <a>spotify</a>
                                {(selected.length != 0) && <button onClick={() => setShow(true)} style = {{height: "20px"}}>save</button>}
                            </div>
                            
                            <SongSearch selected = {selected} setSelected = {setSelected}/>
                        </div>
                }



            </div>
        </div>
        </>
    )
}