import React, { useRef } from 'react'
import styled from 'styled-components'

export const InputWrapper = styled.div`
    display: flex;
    align-items: left;
    user-select: none;
    label {
        margin-top: 5px;
        font-size: 15px;
        
    }
    input {
        width: 40px; 
        text-align: center;
        border: 1px solid #ddd
        outline: 0;
        font-family: monospace;
        font-size: 12px;
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

const Input = ({ label, value, max, min, defaultValue, setValue}) => {
    const input = useRef(null)

    function onBlur(e){
        if (e.target.value == ''){
            setValue(defaultValue)
        } else if (e.target.value < min){
            setValue(min)
        }
    }

    function onChange(e){
        var newValue


        if (!isNaN(e.target.value)){
            console.log("value in input: ", e.target.value)
            if(Number(e.target.value) > max){
                newValue = max
            } else {
                newValue = Number(e.target.value)
            }
        } else {
            newValue = defaultValue
        }

        setValue(newValue)
    }

    return (
        <InputWrapper>
            <label>{label}</label>
            <input
                ref = {input}
                value = {value}
                onChange = {onChange}
                onBlur = {onBlur}
                autoFocus = {false}
            />
        </InputWrapper>
    )
}

export default Input