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
            setColors(results.colorData)
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
                /*
            )
            const sort = 
            temp.sort((a, b) => {
                return ( (HexToHSL(a.hex)[0][0] > HexToHSL(b.hex)[0][0]) ? 1 : -1)
            })
            console.log(sort)
            console.log(temp)
            */
            setColors(temp2)
            console.log(colors)
            setSorted(true)
          
            /*setColors(
                colors.colorData.sort((a, b) => {
                    return ( (HexToHSL(a.hex)[0][0] > HexToHSL(b.hex)[0][0]) ? 1 : -1)
                }
            ))*/
        } 
        else {
            setSorted(!sorted)
            let temp2 = [...otherColors]
            setColors(temp2)
        
        }
        
        
        setOtherColors(temp)
    }


/*
    const colorSort = colors.colorData.sort((a, b) => 
        (HexToHSL(a.hex)[0][0] > HexToHSL(b.hex)[0][0]) ? 1 : -1);
    console.log(colors, colorSort)
*/

    return (
        
        <div>
              <Navigation/>
              <div className = "stpage">    
              {
                    !loading &&  
                    <div>
                        <div>
                        <button className = {!sorted ? "disabled": ""} onClick={change}>recently added</button>
                        <button className = {sorted ? "disabled": ""}onClick={change}>color</button>
                        </div>
                    <div className = "rowPage" style = {{gap: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"}}>
                        {colors.map((item) => (
                        <a key = {item.hex} href = {'/colors/' + item.hex.substring(1)}>
                             <div className = "colPage" >
                                <div style = {{width: "150px", height: "150px", backgroundColor: item.hex}}>
                                </div>
                                <p>{item.colorName}</p>
                          
                            </div>

                        </a>
                         
                        ))}
                        <div>
                            <a href = "/create">
                            <button
                                style = {{backgroundColor: "gray", width: "150px", height: "150px"}}
            
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


/*
"use client"

import { Navigation } from "@/components/navigation"

import { useState, useEffect } from "react"
import { getColors } from "@/components/supabase"

export default function colorPage(){

    const [colors, setColors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect ( () => {
        getColors()
        .then((results) => {
            console.log("before: ", colors)
            setColors(results.colorData)
            console.log(results.colorData)
            
            
            setLoading(false)
            console.log("colors:", colors)
            

        });
    }, [])

 

    return (
        <div>
              <Navigation/>
              <div className = "stpage">    
              {loading ? ( <div>loading...</div> ) : (

                    <div className = "rowPage" style = {{gap: "40px"}}>
                        {colors.map((item) => (
                        <a href = {'/colors/' + item.hex.substring(1)}>
                             <div className = "colPage" style = {{border: "2px solid green"}}>
                                <div style = {{width: "150px", height: "150px", backgroundColor: item.hex}}>
                                </div>
                                <a>{item.colorName}</a>
                          
                            </div>

                        </a>
                         
                        ))}
                    </div>
                )}

              </div>
        </div>
    );

}
*/

/*
  <div className = "rowPage">
                         <a>{item}</a>
                        <div style = {{width: "200px", height: "200px", backgroundColor: item.hex}}></div>
                        <a>{item.colorName}</a>
                    </div>

                    */