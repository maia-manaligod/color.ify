import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useSaturation } from './usePaintSquare'

import Svg from '../style/Svg'
import config from '../style/config'
import { HSLToHex } from './utils'

const { squareSize, barSize } = config

export const SatWrapper = styled.div`
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

const Sat = ({satX, offsetLeft, setSatX, setSquare, setHex, hue, light}) => {
    const bar = useRef(null)
    const canvas = useRef(null)

    useSaturation(canvas, hue)
    
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

        function computeSat(x) {
            return Math.round((x + barSize / 2) /2 )
        }

        const onMouseMove = (e) => {
            const x = computePosition(e)
            const sat = computeSat(x)
            setHex(HSLToHex(hue, sat, light))

            setSatX(x)

            setSquare([sat, light])
        }

        function onMouseUp(e){
            const x = computePosition(e)
            const sat = computeSat(x)
            setSatX(x)
            console.log("light: ", light)
            console.log("hue:", hue)
            setSquare([sat, light])
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

    }, [offsetLeft, setSquare, setSatX])



    return (
        <>
          <SatWrapper ref = {bar}>
                    <Handle left = {satX}>
                     <Svg name = 'handle' /> 
                    </Handle>
                    
                    <Canvas ref = {canvas}/>
            </SatWrapper>   
        </>
    )
}

export default Sat