import React, { useRef } from 'react'
import styled from 'styled-components'
import { HexToHSL } from './utils'

export const HexInputWrapper = styled.div`
    display: flex;
    align-items: right;
    user-select: none;
    label {
        margin-top: 5px;
        font-size: 15px;
        
    }
    input {
        width: 80px; 
        height: 20px;
        text-align: center;
        border: 1px solid #ddd
        outline: 0;
        font-family: monospace;
        font-size: 13px;
        padding: 4px 4px;
        margin: 5px;
        user-select: none;
        &:focus{
            background: #fafafa;
        }
        &::selection{
            background: #dddb;
        }
    }
`

const HexInput = ({ label, value, max, min, defaultValue, setHex}) => {
    const input = useRef(null)

    function onBlur(e){
        if (e.target.value == ''){
            setHex(defaultValue)
        } else if (e.target.value < min){
            setHex(defaultValue)
        }
    }

    function onChange(e){
    
        var newValue = HexToHSL(e.target.value);


         if (newValue != null){
            if (newValue[0][0] > max[0] || newValue[0][1] > max[1] || newValue[0][2] > max[2]){
                newValue = max; 
            }

            setHex(newValue);
        }

        
        /*
        console.log(e.target.value)
        console.log("ass tess? ", /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e.target.value))
        if (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e.target.value)){
            console.log("value in input: ", e.target.value)
            if(Number(e.target.value) > max){
                newValue = max;
            } else {
                newValue = HexToHSL(e.target.value);
            }
        } else {
            console.log("failed, passing ", defaultValue)
            newValue = defaultValue
        }
        setHex(newValue)
        */

        
        
    } 
//1c717d
//187 63 30
    return (
        <HexInputWrapper>
            <label>{label}</label>
            <input
                ref = {input}
                value = {value}
                onChange = {onChange}
                onBlur = {onBlur}
                autoFocus = {false}
            />
        </HexInputWrapper>
    )
}

export default HexInput