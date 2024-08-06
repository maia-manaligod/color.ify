"use client"
import { Navigation } from "@/components/Navigation"
import { useEffect, useState } from "react";
import { getColors } from "@/components/supabase"
import { HexToHSL } from "@/components/colorPicker/function/utils";



export default function colorPage(){

    const [colors, setColors] = useState([])
    const [loading, setLoading] = useState(true)
    const [sorted, setSorted] = useState(false)
    const[otherColors, setOtherColors] = useState([])
    
    useEffect(() => {
        getColors().then((results) => {
            console.log(results)
            setColors(results)
            setLoading(false)
            
        })
    }, [])

    function change(){
        const temp = [...colors];
        if (otherColors.length == 0){
            let temp2 = [...colors]
            setColors(temp2.sort((a, b) => {
                return ( (HexToHSL(a.hex)[0][0] > HexToHSL(b.hex)[0][0]) ? 1 : -1)
            }))
              
            setColors(temp2)
            console.log(colors)
            setSorted(true)
          
          
        } 
        else {
            setSorted(!sorted)
            let temp2 = [...otherColors]
            setColors(temp2)
        
        }
        
        
        setOtherColors(temp)
    }


    return (
        
        <div>
              <Navigation/>
              <div className = "stpage">    
              {
                    !loading &&  
                    <div>
                        <div className = "rowPage">
                            <a className = "headerText"> my colors.</a>
                            <div className = "filter" style = {{marginLeft: "auto"}}>
                                <button className = {!sorted ? "disabled": ""} onClick={change}>recently added</button>
                                <button className = {sorted ? "disabled": ""}onClick={change}>color</button>
                            </div>
                       </div>
                    <div className = "rowPage" style = {{border: "2px solid red" , gap: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"}}>
                        {colors.map((item) => (
                        <div className = "newColor">
                        <a key = {item.hex} href = {'/colors/' + item.hex.substring(1)}>
                             <div className = "colPage" >
                                <div style = {{width: "150px", height: "150px", borderRadius: "5px", backgroundColor: item.hex}}>
                                </div>
                                <p>{item.colorName}</p>
                          
                            </div>

                        </a>
                        </div>
                         
                        ))}
                        <div className = "newColor">
                            <a href = "/create">
                            <button 
                                style = {{backgroundColor: "#dee3e7", width: "150px", height: "150px" , borderRadius: "5px", border: "1px solid gray"}}
            
                            >
                                +
                            </button>
                            </a>
                           
                           
                        </div>
                        
                        
                           
                    </div>
                    </div>
                }

              </div>
              
        </div>
        
    
    );

}
