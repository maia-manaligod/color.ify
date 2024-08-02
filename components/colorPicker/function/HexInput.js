import React, { useRef } from 'react'
import styled from 'styled-components'
import { HexToHSL } from './utils'

export const HexInputWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
   
    label {
        margin-top: 5px;
        font-size: 15px;
        
    }
    input {
        width: 100px; 
        height: 30px;
        text-align: center;
        border: 1px solid #ddd
        outline: 0;
        font-family: monospace;
        font-size: 13px;
        padding: 4px 4px;
        margin: 10px;
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

        

        
        
    } 

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