
import React from 'react'


import styled from 'styled-components'


export const Backdrop = styled.div`
    position: fixed;
    z-index: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: ${(p) => (p.show ? 'block' : 'none')};
    background: rgba(0, 0, 0, 0.3);
`

export const ModalWrapper = styled.div`
objectFit: fill
position: fixed;
top: 50%;
left: 50%;
    z-index: 5;
    transform: translate(10%,0%);
    transform-origin: left top;
    max-width: 100%;
    height: auto;
    display: ${(p) => (p.show ? 'block' : 'none')};

`

const PopModal = ({ modal, show, onClose, children}) => {
    return (
        <>
            <Backdrop show = {show} onClick = {onClose} />
            <ModalWrapper ref = {modal} show = {show}>
                {children}
            </ModalWrapper>
        
        </>

    )
}

export default PopModal