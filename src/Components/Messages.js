import styled, { keyframes } from 'styled-components';
import { fadeInRight, fadeInLeft } from 'react-animations';
import { useEffect } from 'react';

const fadeRight = keyframes`${fadeInRight}`;
const fadeLeft = keyframes`${fadeInLeft}`;

const AnimationUser = styled.div`
  animation: 1s ${fadeRight};
  max-width: 50%;
  text-align: right;
`;
const AnimationBot = styled.div`
  animation-iteration-count: 1;
  animation: 1s ${fadeLeft};
  max-width: 50%;
  text-align: left;
`;

export function renderMessages(messages, loading) {
  return <div id="messagebox" className="messagebox">
  {
     messages.map((e)=> {
      return <>
        <div className={e.sender === "Aria" ? "messageLineBot" : "messageLineUser"}>
          {e.sender === "Aria" ? <AnimationBot className="messageBot">{e.message}</AnimationBot> : <AnimationUser className="messageUser">{e.message}</AnimationUser>}
        </div>
      </>
    }) 
  }
  {
  loading
  ? <div className="messageLineBot">
      <AnimationBot className="loading messageBot"><img src="https://cdn.dribbble.com/users/8424/screenshots/1036999/dots_2.gif" alt="Carregando"/></AnimationBot> 
  </div>
  : null
  }
</div>
}