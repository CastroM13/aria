import React from "react";
import styled from 'styled-components';

const AnimatedModal = styled.div`
    transform: translateX(${props => props.visible ? "500%" : "0"});
    transition: transform 0.5s ease;
`
function Modal({header, body, footer, visible = false}) {
    return (
        <div className="modalBody">
            <AnimatedModal className="modal" visible={visible}>
                <br/>
                {header && <h1>{header}</h1>}
                {body && <div>{body}</div>}
                {footer && <div>{footer}</div>}
            </AnimatedModal>
        </div>
    )
} 

export default Modal;