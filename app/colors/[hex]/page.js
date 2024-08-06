"use client"
//"use server"
import { useState, useEffect, useRef} from "react";
import { Navigation } from "@/components/Navigation";
import { deleteColor, deletePlaylistSupabase, getColorInfo, getSongs } from "@/components/supabase";
import { SongSupabase } from "@/components/song";
import PopModal from "@/components/style/popModal";
import { getColorPageInfo } from "@/lib/getColorPageInfo";
import { createNewPlaylist } from "@/lib/makePlaylist";
import { ChosenSong } from "@/components/songClient";
import { removeSongs } from "@/components/supabase";
import { SongSearchSmall } from "@/components/spotifyAPI/search";
import { addTracks, removeTracks, unfollowPlaylist } from "@/lib/spotify";
import { useRouter } from "next/router";
import UpdatePlaylistInfoForm from "@/components/updatePlaylistInfo";



export default function color(hex){
    const [query, setQuery] = useState('')
    const [edit, setEdit] = useState(false)
    const [search, setSearch] = useState(true)
    const modal = useRef(null)
    const [show, setShow] = useState(false)
    const [deletionStage, setDeletionStage] = useState(0)


    const [colorInfo, setColorInfo] = useState([])
    const [songs, setSongs] = useState([])
    const [playlist, setPlaylist] = useState("")
    const [colorHex, setColorHex] = useState("")
    //const [songsLoading, setSongsLoading] = useState(true)
    //const [colorLoading, setColorLoading] = useState(true)


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

    function newPlaylist(){
        console.log("new playlist clicked")
        createNewPlaylist(colorInfo.colorName, colorInfo.description, songs, colorHex).then(
            (results) => {
                console.log("playlist results @ page", results)
                setPlaylist(results)
            }
        )
        
    }
    

    useEffect (() => {
        console.log("HEX: ", hex)
        getColorPageInfo(hex.params.hex).then((results) => {
            setSongs(results.songInfo)
            setColorInfo(results.colorInfo)
            console.log("playlist: ", results.playlist)
            setPlaylist(results.playlist)
            setColorHex("#" + hex.params.hex)
            
        })
    }
    , [])

    function removeSong({Song}){
        console.log("previous, " , songs)
        let arr = [...songs]
        console.log("Song: ", Song)
        console.log("arr: ", arr[0]);
        const index = arr.findIndex(song => song == Song.props.object)
        console.log("index: ", index)
        
  
        if (index > -1){
            arr.splice(index, 1)
            console.log("after splice", arr)
            setSongs(arr)
        }
        console.log(Song.props.object, colorHex)
        removeSongs(Song.props.object, colorHex)

        console.log("playlist null? ", playlist.playlistId == null)
        if (playlist.playlistId != null) { removeTracks(playlist.playlistId, [Song.props.object.spotify_uri])  }
    }
   
    function deleteColorValue(val){
        console.log("del spotify? ", val)
        if (val){
            console.log("playlist: ", playlist, "playlist ID: ", playlist.playlistId)
            unfollowPlaylist(playlist.playlistId)

        }
        console.log(colorHex)
        deleteColor(colorHex, true)
    }

    function unlinkPlaylist(remove){
        
        if (remove){
            console.log("unfollow")
            unfollowPlaylist(playlist.playlistId)
        }
        console.log("delete link")
        deletePlaylistSupabase(playlist.playlistId)
        setPlaylist({playlistId: null, playlistLink: null})
        setShow(false)
    }
    
    function editPlaylist(){
        setEdit(!edit)
    }

    function setSearchPage(){
        setSearch(!search)
    }

    function addSong(Song){
        let arr = [...songs]
        console.log(Song)
        arr.push(Song)
        console.log("array", arr)
        setSongs(arr)

        if (playlist.id != null) {addTracks([Song.spotify_uri, playlist.id])}
    }



    return (
        
        <div>
            <Navigation/>

                {colorInfo != [] && 

                <div className = "stpage">
                    <div className = "rowPage">
                        <div style = {{width: "150px", height: "150px", backgroundColor: colorHex}}/>
                        <div className = "colPage stpage"> 
                            {!edit && 
                            <div>
                                <h3>{colorInfo.colorName}</h3>
                                <p>{colorInfo.description}</p>
                            </div>
                            }
                            {edit && 
                               <UpdatePlaylistInfoForm initialTitle = {colorInfo.colorName} initialDescription = {colorInfo.description} color = {colorHex} updateColorInfo = {setColorInfo}  changeEdit = {setEdit}/>
                            }
                        </div>
                        <div>   
                            <button onClick= {() => {setShow(true); setDeletionStage(1)}}>delete color</button>
                            {!edit && <button onClick = {editPlaylist}><a>edit</a></button>}
                            {edit && <button onClick = {editPlaylist}><a>done</a></button>}
                            {(playlist.playlistLink == null) && 
                                <div className = "colPage">
                                    <button style = {{alignItems : "right"}}> link to existing playlist </button> 
                                    <button style = {{alignItems : "right"}} onClick = {newPlaylist}> create new playlist </button>
                                </div>
                            }
                            {(playlist.playlistLink != null) && 
                                <div className = "colPage">
                                    <a href = {playlist.playlistLink}>playlist</a>
                                    <button onClick = {() => {setShow(true); setDeletionStage(3)}}> unlink playlist</button>
                                </div>
                            }
                        </div>
                       
                    </div>
                    <a>search: </a>
                    <input onChange = {handleChange} type = 'text'/>

                    {filtered.map((item => 
                        <ChosenSong key = {item.spotify_uri} Song = {<SongSupabase key = {item.spotify_uri} object = {item}/>} removeSong = {removeSong} unselect = {null} show = {edit}></ChosenSong> 
                    ))}

                    {!search && <button onClick = {setSearchPage} ><a>find more</a></button>}
                    
                    
                    {search &&
                        <div>
                            <SongSearchSmall hex = {colorHex} songArray = {songs} addToArray = {addSong} playlist = {playlist.playlistId}/>
                            
                        </div>
                    }


                    <PopModal modal = {modal} show = {show} onClose ={() => {setShow(false); setDeletionStage(0)}}>
                        <div className = "stpage popModal"> 
                            {deletionStage == 0 && <div></div>}
                            {deletionStage == 1 &&  
                                <div>
                                    <a>are you sure? deleting will erase this color forever.</a>
                                    <button onClick = {() => 
                                        {if (playlist.playlistId != null) { setDeletionStage(2)}
                                        else { deleteColorValue(true) }
                                        }
                                    }>Confirm</button>
                                </div>
                                }
                            {deletionStage == 2 && 
                                <div>
                                    <a>do you want to delete the spotify playlist as well?</a>
                                    <button onClick = {() => deleteColorValue(true)}>delete all</button>
                                    <button onClick = {() => deleteColorValue(false)}>keep spotify playlist</button>
                                </div>
                            }

                            {deletionStage == 3 &&
                                <div>
                                    <a>do you want to delete the linked spotify playlist?</a>
                                    <button onClick = {() => unlinkPlaylist(false)}>no, just unlink it</button>
                                    <button onClick = {() => unlinkPlaylist(true)}>yes, delete it</button>
                                </div>
                            }
                            
                        </div>
                        
                        
                    </PopModal>
                </div>

                

                }
                
            
            
            
        </div>
        
    )

}


/*
export default async function color(hex){
    const colorData = getColorInfo(hex.params.hex)
    const songsData = getSongs(hex.params.hex)

    const [colorInfo1, songs1] = await Promise.all([colorData, songsData])
    let colorInfo = colorInfo1.data
    let songs = songs1.data
    let playlist = colorInfo.linked_playlist
    console.log("AT PAGE: ", colorInfo, songs)



    const colorHex = "#" + hex.params.hex

    return (
    
        
        <div>
            <Navigation/>

                <div className = "stpage">
                    <div className = "rowPage">
                        <div style = {{width: "150px", height: "150px", backgroundColor: colorHex}}/>
                        <div className = "colPage"> 
                            <h3>{colorInfo.colorName}</h3>
                            <p>{colorInfo.description}</p>
                        </div>
                        <div>   
                            {(playlist == null) && 
                                <div className = "colPage">
                                    <button style = {{alignItems : "right"}}> link to existing playlist </button> 
                                    <button style = {{alignItems : "right"}}> create new playlist </button>
                                </div>
                            }
                            {(playlist != null) && <button> unlink playlist</button>}
                        </div>
                       
                    </div>

                    {songs.map((item => 
                        <SongSupabase key = {item} object = {item}/>
                        
                    ))}
                </div>
                
            
            
            
        </div>
        
    )

}
*/