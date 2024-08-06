import { search } from "@/lib/spotify";
import { useEffect, useState } from "react";
import { Song } from "../song";
import { SongSelect } from "../songClient";
import { SongSupabase } from "../song";
import { pushSongs } from "../supabase";
import { addTracks } from "@/lib/spotify";

export default function SongSearch({selected, setSelected}){

    const [result, setResult] = useState({});
    const[loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false)

    function onClick (formData) {
        setLoading(true);
        setSearched(false)
        search(formData.get('text'), 20)
        .then((results) => {
                setResult(results.items)
                console.log("RESULTS FROM SEARCH: ", results.items)
                setLoading(false);
                setSearched(true)
            
        }); 
    };

    function addSong({Song, unselect}){
        let temp = [...selected]    
        console.log("before push: ", temp)
        console.log("song, unselect", {Song, unselect})
        
        temp.push({Song, unselect})
       
        console.log("pushing", Song)
        setSelected(temp);
        console.log("after push," , temp);
    }

    function removeSong({Song}){
        console.log("previous, " , selected)
        let arr = [...selected]
        console.log("looking at song: ", Song)
        console.log(Song.props)
        const index = arr.findIndex(song => song.Song.props.object == Song.props.object
        )
        console.log("index: ", index)
  
        if (index > -1){
            arr.splice(index, 1)
            console.log("after splice", arr)
            setSelected(arr)
        }
    }



    return (
        <div >
            <div style = {{ position: "absolute"}}>
                <a>search for a song </a>
                        <form>
                            <input name = "text"></input>
                            <button formAction = {onClick}>search</button>
                        </form>

            </div>

            
            <div style = {{paddingTop: "50px"}}>
            {loading && <a>loading</a>}

            {searched && result &&
                <div>
                        {result != {} && result.map(item => (
                            <SongSelect 
                                Song = {<Song object = {item} />} 
                                addSong = {addSong}
                                removeSong = {removeSong}
                            />
                        ))}
                </div>
            }
            </div>
           
        </div>
    )
    
}

export function SongSearchSmall({hex, songArray, addToArray, playlist}){
    const [result, setResult] = useState({});
    const[loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false)

    function onClick (formData) {
        setLoading(true);
        setSearched(false)
        console.log(songArray)

        let uris = songArray.map((track) => track.spotify_uri)
        console.log("uris: ", uris)
        search(formData.get('text'), 7)
        .then((results) => {
                //let filtered = results.items.filter(track => !uris.includes(track.uri))
                //console.log("filtered: ", filtered)
                //setResult(filtered)
                setResult(results.items)
                console.log("RESULTS FROM SEARCH: ", results.items)
                setLoading(false);
                setSearched(true)
            
        });
        
    };

    function addSong({Song}){
        console.log("add", Song.props.object)
        let artistArray = Song.props.object.artists.map((item) => item.name)
        console.log("when adding song: ", artistArray)
        let item = {album: Song.props.object.album.name, artist: artistArray, image_url: Song.props.object.album.images[0].url, name: Song.props.object.name, spotify_uri: Song.props.object.uri}
        console.log("item: ", item)
        addToArray(item)

        let arr = [...result]
        console.log("arr: ", arr, "Song", Song.props.object)

        const index = arr.findIndex(item => item === Song.props.object)
        console.log("index: ", index)

        if (index > -1){
            arr.splice(index, 1)
            console.log("search result after click", arr)
            setResult(arr)

            //add to supabase
            pushSongs(hex, [Song.props.object])

            //add to spotify, if playlist exists
            if (playlist != null){
                console.log("SONG BEFORE SPOT PUSH:", playlist, Song.props.object.uri)
                addTracks(playlist, [Song.props.object.uri])
            }

        }

       




    }


    return (
        <div>
        <a>search for a song </a>
                <form>
                    <input name = "text"></input>
                    <button formAction = {onClick}>search</button>
                </form>
       
        {loading && <a>loading</a>}

        {searched && result &&
            <div>
          
                    {result.map(item => (
                        <SongSelect key = {item.uri} Song = {<Song object = {item} />} addSong = {addSong} removeSong = {null}/>
                    ))}
      
            </div>
        }
       
    </div>

    )

}