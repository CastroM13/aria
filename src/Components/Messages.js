import styled, { keyframes } from 'styled-components';
import { fadeInRight, fadeInLeft } from 'react-animations';

const fadeRight = keyframes`${fadeInRight}`;
const fadeLeft = keyframes`${fadeInLeft}`;

const AnimationUser = styled.div`
  animation: 1s ${fadeRight};
  max-width: 50%;
  text-align: right;
`;
const AnimationBot = styled.div`
  animation: 1s ${fadeLeft};
  max-width: 50%;
  text-align: left;
`;

export function renderMessages(messages) {
  return <div id="messagebox" className="messagebox">
  {messages && messages.map((e)=> {
    return <div className={e.sender === "Aria" ? "messageLineBot" : "messageLineUser"}>
      {e.sender === "Aria" ? <AnimationBot className="messageBot">{e.message}</AnimationBot> : <AnimationUser className="messageUser">{e.message}</AnimationUser>}
    </div>
  })}
</div>
}