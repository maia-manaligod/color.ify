import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'

import usePaintHue from './usePaintHue'
import Svg from '../style/Svg'
import config from '../style/config'
import { HSLToHex } from './utils'

const { squareSize, barSize } = config

export const HueWrapper = styled.div`
    position: relative;
    width: ${squareSize + 'px'}
    height: ${barSize + 'px'}
    cursor: ew-resize
`

export const Canvas = styled.canvas.attrs((p) => ({
    width: squareSize, 
    height: barSize
}))``

export const Handle = styled.div.attrs((p) => ({
    style : {
        left: p.left + 'px',
        transition: p.animate ? 'left .25s ease-out' : '0s'
    }
}))`
    position: absolute;
    top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: ${barSize}px;
    height: ${barSize}px;
    pointer-events: none;
    Svg {
        width: 100%;
        height: 100%;
    }
`

const Hue = ({hueX, offsetLeft, setHueX, setHue , setHex, sat, light}) => {
    const bar = useRef(null)
    const canvas = useRef(null)

    usePaintHue(canvas)
 
    
    useEffect(() => {
        function computePosition(e) {
            return Math.max(
                barSize / -2, 
                Math.min(
                    e.clientX - offsetLeft - barSize/2, 
                    squareSize - barSize / 2
                )
            )
        }

        function computeHue(x) {
            return Math.round((x + barSize / 2) * (360/squareSize))
        }

        function changeColor(e){
            const x = computePosition(e)
            const hue = computeHue(x)
            setHueX(x)
            setHue(hue)
            console.log("hsl: ", hue, sat, light)
            setHex(HSLToHex(hue, sat, light))
        }

        const onMouseMove = (e) => {
            changeColor(e)
        }

        function onMouseUp(e){
            changeColor(e)
            document.body.removeEventListener('mousemove', onMouseMove)
            document.body.removeEventListener('mouseup', onMouseUp)
        }

        function onMouseDown(e){
            document.body.addEventListener('mousemove', onMouseMove)
            document.body.addEventListener('mouseup', onMouseUp)
        }

        const barRef = bar.current
        barRef.addEventListener('mousedown', onMouseDown)

        return () => {
            barRef.removeEventListener('mousedown', onMouseDown)
            document.body.removeEventListener('mousemove', onMouseMove)
            document.body.removeEventListener('mouseup', onMouseUp)
        }

    }, [offsetLeft, setHue, setHueX, sat, light])



    return (
        <>
          <HueWrapper ref = {bar}>
                    <Handle left = {hueX}>
                     <Svg name = 'handle' /> 
                    </Handle>
                    
                    <Canvas ref = {canvas}/>
                </HueWrapper>   
        </>
    )
}

export default Hue