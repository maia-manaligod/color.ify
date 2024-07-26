"use client"
import { useState } from "react";
import { Song } from "./song";


export function SongSelect({Song, addSong, removeSong }) {

    const [selected, setSelected] = useState(false);


    function onClick() {

            if (selected){
                setSelected(false);
                if (removeSong != null) {removeSong({Song});}
            } else {
                setSelected(true);
                addSong({Song, unselect});
                
            }
        
        
    }

    function unselect(){
        setSelected(false)
    }
    
    return (

            <button 
                onClick = {onClick}
                style = {{
                    border: (selected) ? "2px solid green" : "2px solid grey",
                    backgroundColor: (selected) ? "#d5f0f0" : "white"
                }}
            >{Song}</button>  
    )
}

export function ChosenSong({Song, removeSong, unselect, show}){
    function onClick(){
        console.log("tyring to remove" , Song)
        removeSong({Song});
        if (unselect != null) {unselect();}
    }

    return (
        <div className = "rowPage">
            {Song}
            {show &&
            <button 
                 onClick = {onClick}
                 style = {{
                     width: "20px",
                     height: "20px"
                 }}
            
            ><a>X </a></button>
            }
        </div>
    )
}

