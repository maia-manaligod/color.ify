import React, {useRef, useEffect} from 'react'
import styled from 'styled-components'
import {HSLToHex, convertRGBtoHSL} from './utils'
import Svg from '../style/Svg'
import usePaintSquare from './usePaintSquare'
import config from '../style/config'

const {squareSize, crossSize, delay} = config

export const SquareWrapper = styled.div`
    position: relative;
    width: ${squareSize + 'px'};
    height: ${squareSize + 'px'};
    cursor: crosshair;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`

export const Canvas = styled.canvas.attrs((p) => ({
    width: squareSize, 
    height: squareSize
}))``

export const Cross = styled.div.attrs((p) => ({
    style: {
        top: p.top + 'px',
        left: p.left + 'px',
        width: crossSize + 'px',
        height: crossSize + 'px',
        transition: p.animate ? 'top .25s ease-out, left .25s ease-out' : '0s'
    }
}))`
    position: absolute;
    display: grid;
    justify-items: center;
    align-items: center;
    svg{
        width: 100%;
        height: 100%
    }
`

const Square = ({
    hue, 
    squareXY, 
    setSquare, 
    offsetTop, 
    offsetLeft, 
    animate, 
    setSquareXY,
    setHex
}) => {
    const square = useRef(null)
    const canvas = useRef(null)

    usePaintSquare(canvas, hue)

    useEffect(() => {
        const canvasRef = canvas.current
        const ctx = canvasRef.getContext('2d')

        function computePosition(e){
            const x = Math.max(
                crossSize/-2, 
                Math.min(
                    e.clientX - offsetLeft - (2 * crossSize / 3)  , 
                    squareSize - crossSize / 2
                )
            )
            const y = Math.max(
                crossSize/-2, 
                Math.min(
                    e.clientY - offsetTop - (2 * crossSize/3) ,
                    squareSize - crossSize - 2
                )
            )

            return [x, y]
        }

        function changeColor(e){
            const[x,y] = computePosition(e)

            const x1 = Math.min(x + crossSize, squareSize - 1)
            const y1 = Math.min(y + crossSize, squareSize - 1)

            const [r,g,b] = ctx.getImageData(x1, y1, 1, 1).data
        
            const [h,s,l] = convertRGBtoHSL([r, g, b])
            
            setSquare([s,l])
            setSquareXY([x,y])
        
            console.log("hue:", hue)
            setHex(HSLToHex(hue, s, l))
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
        
        const squareRef = square.current
        squareRef.addEventListener('mousedown', onMouseDown)

        return () => {
            squareRef.removeEventListener('mousedown', onMouseDown)
        }
    }, [offsetTop, offsetLeft, setSquare, setSquareXY, hue])

    return (
        
        <SquareWrapper ref = {square}>
            <Cross top = {squareXY[1]} left = {squareXY[0]}>
                <Svg name = 'cross' />
            </Cross>
            <Canvas ref = {canvas} />
        </SquareWrapper>
    )

}

export default Square