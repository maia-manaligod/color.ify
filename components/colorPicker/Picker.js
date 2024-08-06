import React, {useState, useRef, useEffect, useImperativeHandle, forwardRef} from 'react'
import styled, {keyframes} from 'styled-components'
import Modal from './style/Modal'
import Hue from './function/Hue'
//import Sat from './function/Saturation'
import config from './style/config'
import Square from './function/Square'
//import Input from './function/Input'
import HexInput from './function/HexInput'
import { HSLToHex, HextToHSL} from './function/utils'


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
        width: ${squareSize * .5}px;
        height: ${squareSize * 11/16}px;
        background: ${(p) => p.color};
        border-radius: 5px;
        animation-name: grow;
        animation-duration: .5s;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    .swatchSmall{
        width: ${squareSize * 2}px;
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
            width: ${squareSize};
        } to {
            height: ${squareSize * .25}px;
            width: ${squareSize * 2};
        }
    }
    @keyframes grow {
        from {
            height: ${squareSize * .25}px;
            width: ${squareSize * 2};
        } to {
            height: ${squareSize * 11/16}px;
            width: ${squareSize };
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
        background-color: #04AA6D;
        color: white;
    }

`

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
   
};

const Picker = forwardRef(({setFinalHex, setCurrentColor, setHex, hex, currentColor}, ref) => {
    const[show, setShow] = useState(true)

    const [color, setColor] = useState(currentColor)
    //const [hex, setHex] = useState("#00ffff")

    const [hue, setHue] = useState(180)
    const [hueX, setHueX] = useState(() => squareSize/2 - barSize/2)

    const [finalHex, setFinalizedHex] = useState(false)

    const[square, setSquare] = useState([100, 50]);
    const [squareXY, setSquareXY] = useState(() => [
        squareSize - crossSize / 2, 
        crossSize / -2
    ]);

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
        setCurrentColor([hue, square[0], square[1]])
    }, [hue, square])

    useImperativeHandle(ref, () => {
        return {
            onHexChange,
        };
    }, []);

    function onHexChange([n, h]){
        console.log("onHexChange")
        setHex(h);

        setHue(n[0]);
        setHueX(computeHueX(n[0]))

        setSquare([n[1], n[2]])
        setSquareXY(computeSquareXY(n[1], n[2]))

    }

    function onFinalizeHex(){
        if (!finalHex){
            document.getElementById('swatch').classList.remove('swatch')
            document.getElementById('swatch').classList.add('swatchSmall')
            
            setFinalizedHex(true)
            setFinalHex(hex)
        } else {
            document.getElementById('swatch').classList.remove('swatchSmall')
            document.getElementById('swatch').classList.add('swatch')
            setFinalizedHex(false)
            setFinalHex('')
        }
        
    };



    return (
        
        <div>
            <PickerWrapper color = {color}>
                {!finalHex && <div className = {finalHex ? "unclickable" : ""}>
                <div>
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
                                <br></br>
                                <Hue
                                    hueX = {hueX}
                                    offsetLeft = {offsetLeft}
                                    setHueX = {setHueX}
                                    setHue = {setHue}
                                    setHex = {setHex}
                                    sat = {square[0]}
                                    light = {square[1]}
                                />
                                <div>
                                    <HexInput
                                        label = ""
                                        value = {hex}
                                        min = {[[0, 0, 0], "#000000"]}
                                        max = {[[360, 100, 100], "#FFFFFF"]}
                                        defaultValue = {[[hue, square[0], square[1]], hex]}
                                        setHex = {onHexChange}
                                    />  

                                </div>
                                              
                             
                               
                    </PickerOuter>
                </Modal>
                </div>

                <div style = {{width: "20px"}}></div>
                </div>
                }
                
            </PickerWrapper>
          
            </div>
        
    )
});

export default Picker
