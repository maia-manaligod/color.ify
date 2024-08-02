import React from 'react'
import styled, {keyframes} from 'styled-components'





export const ModalWrapper = styled.div`
    z-index: 2;
    max-width: 100%;
    height; auto;

    
   
`
//animation: ${zoom} 0.2s;

//display : ${(p) => (p.show ? 'block' : 'none')};

const Modal = ({modal, children}) => {
    return (
        <>
          
            <ModalWrapper ref = {modal}>
                {children}
            </ModalWrapper>
        
        </>
    )
}
export default Modal