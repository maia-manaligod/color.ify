
import styled from "styled-components";

/*
export const SongOuter = styled.div`
    width: 700px;
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 10px;
    padding: 10px;

    .img {
        margin-top: 10px;
    }
`
export const SongInner = styled.div`
    white-space: normal; 
    word-wrap: break-word; 
    overflow-wrap: break-word;
    word-break: break-word;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 1px;
    line-height: 0px;
    align-text: left;

    
`
*/

export function Song({object}) {
    let artists = "";

    for (let i = 0 ; i < object.artists.length - 1; i++){
        artists += object.artists[i].name + ", ";
    }
    artists += object.artists[object.artists.length - 1].name
    

    return (
        <div className = "songOuter">
           
            <img src = {object.album.images[0].url} height = {50} width = {50}/>

            <div className = "songInner">
                <h4>{object.name}</h4>
                <p>{object.album.name}</p>
                <p>{artists} </p>
            </div>
           

        </div>

    );
}

export function SongSupabase({object}) { 
    let artists = "";

    for (let i = 0 ; i < object.artist.length - 1; i++){
        artists += object.artist[i] + ", ";
    }
    artists += object.artist[object.artist.length - 1]


    return (
        <div className = "songOuter">
           
            <img src = {object.image_url} height = {50} width = {50}/>

            <div className = "songInner">
                <h4>{object.name}</h4>
                <p>{object.album}</p>
                <p>{artists} </p>
            </div>
           

        </div>

    );
}


export function SongWithColor({object}){

    return (
        <div className = "rowPage"> 
            <SongSupabase object = {object}/>
            {object.songs_colors == null && <a href = {'/colors/' + object.song_color.substring(1)}> 
                <div style = {{width: "60px", height: "60px", backgroundColor: object.song_color}}></div>
            </a>
            }

           
           {object.songs_colors != null && 
                ((object.songs_colors.length > 4 ) ? object.songs_colors.slice(0,4) : object.songs_colors).map((item) => 
                <a href = {'/colors/' + item.substring(1)}>
                    <div style = {{width: "60px", height: "60px", backgroundColor: item, margin: "10px"}}></div>
                </a>
            )
           } 
            
            
        </div>
    )

}




