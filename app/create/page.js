"use client"

import OuterPicker from '@/components/colorPicker/OuterPicker'
import { Navigation } from '@/components/Navigation' 
import { useState, useRef, useEffect } from 'react'
import SongSearch from '@/components/spotifyAPI/search'
import { ChosenSong } from '@/components/songClient'
import { pushSong, pushColor, pushSongs, getColors } from '@/components/supabase'
import PopModal from '@/components/style/popModal'
import { useRouter } from 'next/navigation'
import { HexToHSL } from '@/components/colorPicker/function/utils'





export default function(){

    const [hex, setHex] = useState();
    const [selected, setSelected] = useState([]);


    const [show, setShow] = useState(false)
    const[search, setSearched] = useState(false)
    const modal = useRef(null)
    const [loading, setLoading] = useState(false)
    const [existingColors, setExistingColors] = useState([])
    
    const router = useRouter()


    useEffect(() => {
        getColors().then((results) => {
            let hues = results.map((item) => {return {name: item.colorName, hsl: HexToHSL(item.hex)[0], hex: item.hex}})
            //console.log(hues)
            setExistingColors(hues)
            setLoading(true)
        })
    }, [])

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
        pushSongs(hex, songs).then(
            () => {
                router.push('/colors')
            }
        )
    }


    return(
        <>
        {loading && 
        <>
        <Navigation />
        <div className = "stpage" style = {{display: "flex", justifyContent: "center"}}>

            <div className = "rowPage" style = {{display: "flex"}}>
            {hex && <div style = {{width: "150px", border: "2px solid orange"}}></div>}
            
            <div style = {{position: "absolute"}}>
            {setSearched && 
                      <div style = {{width: "500px"}}>
                            <div className = "rowPage">
                                <div style = {{zIndex: 5}}>
                                <PopModal modal={modal} show={show} onClose={() => setShow(false)}>
                                    <div className = "colPage forward" style = {{backgroundColor: "white", padding: "20px"}}>
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
                                </div>



                            <div>
                                <div className = {search ? "" : "clear"} style = {{ width : "700px", position: "relative", zIndex: 3, border: "2px solid red"}}>
                                    <a>spotify</a>
                                
                                        <SongSearch selected = {selected} setSelected = {setSelected}/>
                                
                                
                                </div>
                            
                            
                            </div>
                            </div>
                            
                        </div>
                }
                </div>


             

                <div className = "colPage" style = {{  justifyContent: "center" , border: "2px solid blue", zIndex: 0}}>
                    {!hex && <a>select a color to get started</a>}
                    
                    <div style = {{border: "2px solid green"}}>
                        <OuterPicker setFinalHex = {setFinalHex} setShow = {setShow} setSearched = {setSearched} existingColors = {existingColors}/>
                    </div>
                    
                    <div style = {{display: "flex", justifyContent: "end"}}>
                        {selected != [] && 
                            <div style = {{zIndex: "-1"}}>
                            <ul>
                            {selected.map(item => (
                                <div style = {{width: "400px"}} >
                                    <ChosenSong Song = {item.Song} removeSong={removeSong} unselect = {item.unselect} show = {true}/>
                                </div>
                            ))}
                            </ul>
                            </div>
                            }

                    </div>
                   
                </div>
                
        

                



            </div>
        </div>
        </>
        }
        
        </>
    )
}