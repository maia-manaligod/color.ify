import { Navigation } from "@/components/Navigation"

import { getColors } from "@/components/supabase"



export default async function colorPage(){
    const colors = await getColors();


    return (
        
        <div>
              <Navigation/>
              <div className = "stpage">    
              {

                    <div className = "rowPage" style = {{gap: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"}}>
                        {colors.colorData.map((item) => (
                        <a key = {item} href = {'/colors/' + item.hex.substring(1)}>
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