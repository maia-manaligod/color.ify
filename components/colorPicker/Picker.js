import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import Modal from './style/Modal'
import Hue from './function/Hue'
//import Sat from './function/Saturation'
import config from './style/config'
import Square from './function/Square'
//import Input from './function/Input'
import HexInput from './function/HexInput'
import { HSLToHex, HextToHSL} from './function/utils'

const {squareSize, barSize, crossSize} = config


export const PickerWrapper = styled.div`
    align-items: left;
    user-select: none;
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 10px;
    .swatch{
        width: ${squareSize}px;
        height: ${squareSize}px;
        background: ${(p) => p.color};
    }
`
//is (p) => the page? 

export const PickerOuter = styled.div`
    width: ${squareSize + 20} px; 
    display: grid;
    border-radius: 2px; 
`

export const PickerInner = styled.div`
    align-items: left;
    justify-items: start;
    display: flex;
    flex-direction: column;
    grid-template-rows: ${squareSize + 20}px 20px 1fr;
    border: 2px solid red;
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
/*
export const Inputs = styled.div`
    width: 100%;
    display: flex;
    padding: 10px;
    align-items: left;
    justify-items: start;
`
*/
function computeHueX(h){
    return Math.round((squareSize / 360 * h - barSize / 2 ))
}

function computeSquareXY(s, l){
    const t = (s * (l < 50 ? l : 100 - l)) / 100
    const s1 = Math.round((200 * t) / (l + t)) | 0
    const b1 = Math.round(t + l)
    const x = (squareSize / 100) * s1 - crossSize / 2
    const y = squareSize - (squareSize / 100) * b1 - crossSize / 2

    return [x, y]
   
}

const Picker = ({setFinalHex}) => {
    const[show, setShow] = useState(true)

    const [color, setColor] = useState(`hsla(180, 100%, 50%, 1)`)
    const [hex, setHex] = useState("#00ffff")

    const [hue, setHue] = useState(180)
    const [hueX, setHueX] = useState(() => squareSize/2 - barSize/2)

    const [finalHex, setFinalizedHex] = useState(false)



    const[square, setSquare] = useState([100, 50]);
    const [squareXY, setSquareXY] = useState(() => [
        squareSize - crossSize / 2, 
        crossSize / -2
    ])

    const [offsetTop, setOffsetTop] = useState(0)
    const [offsetLeft, setOffsetLeft] = useState(0)

   
    const modal = useRef(null)

    useEffect(() => {
        function setOffsets(){
            setOffsetTop(modal.current.offsetTop + 20)
            setOffsetLeft(modal.current.offsetLeft)

        }

        if (show){
            setOffsets();
            window.addEventListener('resize', setOffsets)
        } else {
            window.removeEventListener('resize', setOffsets)
        }

        return () => {
            window.removeEventListener('resize', setOffsets)
        }

    }, [show])

    useEffect(() => {
        setColor(`hsla(${hue}, ${square[0]}%, ${square[1]}%, 1)`)
    }, [hue, square])

/*
    function onHueChange(n){
        //setAnimate(true)
        setHue(n)
        setHueX(computeHueX(n))
        setHex(HSLToHex(n, square[0], square[1]))
    }

    function onSaturationChange(n){
        //setAnimate(true) 
        setSquare([n, square[1]])
        setSquareXY(computeSquareXY(n, square[1]))
        setHex(HSLToHex(hue, n, square[1]))
    }

    function onLightnessChange(n){
        //setAnimate(true)
        setSquare([square[0], n])
        setSquareXY(computeSquareXY(square[0], n))
        setHex(HSLToHex(hue, square[0], n))
    }
    */

    function onHexChange([n, h]){
        setHex(h);

        setHue(n[0]);
        setHueX(computeHueX(n[0]))

        setSquare([n[1], n[2]])
        setSquareXY(computeSquareXY(n[1], n[2]))

    }

    function onFinalizeHex(){
        if (!finalHex){
            setFinalizedHex(true)
            setFinalHex(hex)
        } else {
            setFinalizedHex(false)
            setFinalHex('')
        }
        
    }



    return (
        
        <div className = "debug">
            <PickerWrapper color = {color}>
                <div className = {finalHex ? "unclickable" : ""}>
                <Modal modal = {modal}>
                    <PickerOuter>
                                <Square
                                    hue = {hue}
                                    squareXY = {squareXY}
                                    offsetTop = {offsetTop}
                                    offsetLeft = {offsetLeft}
                                    setSquare = {setSquare}
                                    setSquareXY = {setSquareXY}
                                    setHex = {setHex}
                                />
                                <Hue
                                    hueX = {hueX}
                                    offsetLeft = {offsetLeft}
                                    setHueX = {setHueX}
                                    setHue = {setHue}
                                    setHex = {setHex}
                                    sat = {square[0]}
                                    light = {square[1]}
                                />

                                <HexInput
                                    label = ""
                                    value = {hex}
                                    min = {[[0, 0, 0], "#000000"]}
                                    max = {[[360, 100, 100], "#FFFFFF"]}
                                    defaultValue = {[[hue, square[0], square[1]], hex]}
                                    setHex = {onHexChange}
                                />                 
                             
                               
                    </PickerOuter>
                </Modal>
                </div>

                <PickerInner>
                    <a></a>
                    <div className='swatch' />
                  
                    <button onClick = {onFinalizeHex}>{finalHex ? "Back" : "Next"} </button>
                </PickerInner>
                
                
            </PickerWrapper>
          
            </div>
        
    )
}

export default Picker


/*
   <Sat
                                    satX = {satX}
                                    offsetLeft = {offsetLeft}
                                    setSatX = {setSatX}
                                    setSquare = {setSquare}
                                    setHex = {setHex}
                                    hue = {hue}
                                    light = {square[1]}
                                />
                                
                                <a>hue {hue} sat {square[0]} lightness {square[1]}</a>
                                <a>{hex}</a>
                                <Inputs>
                                    
                                    <Input
                                        label = 'H'
                                        value = {hue}
                                        min = {0}
                                        max = {360}
                                        defaultValue = {180}
                                        setValue = {onHueChange}
                                    />
                                    <Input
                                        label = 'S'
                                        value = {square[0]}
                                        min = {0}
                                        max = {100}
                                        defaultValue = {100}
                                        setValue = {onSaturationChange}
                                    />
                                    <Input
                                        label = 'L'
                                        value = {square[1]}
                                        min = {0}
                                        max = {100}
                                        defaultValue = {100}
                                        setValue = {onLightnessChange}
                                    />
                                </Inputs>
                               
*/