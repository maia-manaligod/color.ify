import React, {useState, useRef, useEffect} from 'react'
import styled, {keyframes} from 'styled-components'
import Modal from './style/Modal'
import Hue from './function/Hue'
//import Sat from './function/Saturation'
import config from './style/config'
import Square from './function/Square'
//import Input from './function/Input'
import HexInput from './function/HexInput'
import { HSLToHex, HexToHSL, HextToHSL} from './function/utils'
import Picker from './Picker'
import { getColors } from '../supabase'


const {squareSize, barSize, crossSize} = config


const shrink = keyframes`
    from {
        transform: scale(1);
    } to {
        transform: scale(.1);
    }
`

const grow = keyframes`
    from {
        transform: scale(.1);
    } to {
        transform: scale(1);
    }
`


export const PickerWrapper = styled.div`
    align-items: left;
    user-select: none;
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 10px;
    .swatch{
        width: ${squareSize}px;
        height: ${squareSize * 11/16}px;
        background: ${(p) => p.color};
        border-radius: 5px;
        animation-name: grow;
        animation-duration: .5s;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    .swatchSmall{
        width: ${squareSize}px;
        height: ${squareSize * .25}px;
        background: ${(p) => p.color};
        border-radius: 5px;
        animation-name: shrink;
        animation-duration: .5s;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    @keyframes shrink{
        from {
            height: ${squareSize * 11/16}px;
        } to {
            height: ${squareSize * .25}px;
        }
    }
    @keyframes grow {
        from {
            height: ${squareSize * .25}px;
        } to {
            height: ${squareSize * 11/16}px;
        }

    }
`
//is (p) => the page? 

export const PickerOuter = styled.div`
    width: ${squareSize + 20} px; 
    display: grid;
    border-radius: 5px; 
    padding: 20px;
    background-color: #edf2f2;
    border: 2px solid #d6dbdb;
`

export const PickerInner = styled.div`
    align-items: left;
    justify-items: start;
    display: flex;
    flex-direction: column;
    grid-template-rows: ${squareSize + 20}px 20px 1fr;
    margin-botton: 10px;
    .button{
        width: 20px;
        height: 40px;
        border: 2px solid red;
        background-color: white;
    }
    .button:hover {
        background-color: #04AA6D; /* Green */
        color: white;
    }

`






const OuterPicker = ({setFinalHex, setShow, setSearched, existingColors}) => {

    const [similarColors, setSimilarColors] = useState(
        [{hex: '#dee3e7', name: null },
        {hex: '#dee3e7', name: null },
        {hex: '#dee3e7', name: null },
        {hex: '#dee3e7', name: null },
        {hex: '#dee3e7', name: null }
        ])

        const [finalHex, setFinalizedHex] = useState(false)
        const [color, setColor] = useState([180, 100, 50])
        const [hex, setHex] = useState('')
        //const [existingColors, setExistingColors] = useState(existingColors)


        const ref = useRef()

/*
        useEffect(() => {
            getColors().then((result) => {
                let hues = result.map((item) => {return {name: item.colorName, hsl: HexToHSL(item.hex)[0], hex: item.hex}})
                console.log(hues)
                setExistingColors(hues)
            })


        }, [])
        */

        function getColorDiff(array){
           //console.log(array.name, (Math.abs(array.color[0] - color[0]) + Math.abs(array.color[1] - color[1]) + Math.abs(array.color[2] - color[2])))
            return (Math.abs(array.hsl[0] - color[0]) + Math.abs(array.hsl[1] - color[1]) + Math.abs(array.hsl[2] - color[2]))
        }

        useEffect(() => {
            if (existingColors){
                let matches = []
            console.log("existing colors:", existingColors)
            existingColors.map((item) => {
                console.log(item)
                if (Math.abs(color[0] - item.hsl[0]) < 50 && Math.abs(color[1] - item.hsl[1]) < 50 && Math.abs(color[2] - item.hsl[2]) < 50){
                    matches.push(item)
                }
            })

            console.log("matches:" , matches)
            
            matches.sort((a, b)=> 
            getColorDiff(a) - getColorDiff(b)
            )

            console.log("after sort: ", matches)
            
            

            if (matches.length > 5){
                setSimilarColors(matches.slice(5))
            } else if (matches.length < 5){
                let c = 5 - matches.length
                while (c > 0){
                    matches.push({hex: '#dee3e7', name: null })
                    c--
                }
            }
            console.log("final:", matches)
            setSimilarColors(matches)

        }


        }, [color])


        function setC(h, s , l){
            setHue(h)
            setSquare([s,l])
        }

        function onFinalizeHex(){
            if (!finalHex){
                document.getElementById('swatch').classList.remove('swatch')
                document.getElementById('swatch').classList.add('swatchSmall')
                
                setFinalizedHex(true)

                setFinalHex(hex)
                console.log(hex, color)
                setSearched(true)
            } else {
                console.log(hex, color)
                document.getElementById('swatch').classList.remove('swatchSmall')
                document.getElementById('swatch').classList.add('swatch')
                setFinalizedHex(false)
                setSearched(false)

            }
            
        }


    return (

        <div>
            <PickerWrapper color = {hex}>
            <div className = {finalHex ? "clear" : ""}>
                <Picker setFinalHex = {setFinalHex} setCurrentColor={setColor} setHex = {setHex} hex = {hex} currentColor = {color} ref = {ref}/> 
            </div>
            
            <div className = "colPage" style = {{display: "flex", gap: "30px", alignItems: "end"}}>
                    <PickerInner>
                        <a></a>
                        <div id = "swatch" className='swatch' />
                        </PickerInner>

                    
                        {!finalHex && 
                        <div className = "colPage" style = {{display: "flex", gap: "10px"}}>
                            <a>add to an existing playlist</a>
                            <div className = "rowPage" style = {{ backgroundColor: "#edf2f2", borderRadius: "5px", border: "2px solid #d6dbdb", padding: "10px", display: "flex", gap: "18px"}}>
                                {similarColors.map((item) => (
                                         <div style = {{borderRadius: "5px", width: "60px", height: "60px", backgroundColor: item.hex}}>
                                            <div className = "similarColor">
                                             <button onClick={() => {
                                                // setHex(item.hex)
                                                // setColor(item.hsl)
                                                ref.current?.onHexChange([item.hsl, item.hex]);
                                                console.log("clicked", item.hsl, item.hex)
                                                // ref.current?.onHexChange([item.hsl, item.hex]);
                                             }}></button>
                                             </div>
                                        </div>
                                ))}

                            </div>

                        </div>
                        }
                        
                       <div className = "rowPage" style = {{width: squareSize, justifyContent: "space-between"}}>
                        
                            <button className = {hex == ''? "disabled" : ""} style = {{width: "100px" , height: "40px"}}onClick = {onFinalizeHex}>{finalHex ? "Back" : "Next"} </button>
                            {finalHex &&
                                <>
                                    <a>hex: {hex}</a>
                                    <button style = {{width: "100px" , height: "40px"}} onClick={() => setShow(true)}>save</button>
                                </> }
                       </div>
                      
                </div>
            </PickerWrapper>
        </div>
    )
}

export default OuterPicker

