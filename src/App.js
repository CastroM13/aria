import React, { useEffect, useState } from "react";
import Speech from 'speak-tts' 
import "./styles.css";
import { renderMessages } from "./Components/Messages.js"
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaEllipsisV, FaChevronRight } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
import { zoomIn, zoomOut } from 'react-animations';
import Modal from "./Components/Modal";

if ('webkitSpeechRecognition' in window) {
  // eslint-disable-next-line no-undef
  var sprecog = new webkitSpeechRecognition();
} else {
  alert("Erro: Infelizmente este aplicativo está atualmente funcionando apenas em navegadores Google Chrome ou derivados. :(")
}
const MicrophoneSlashFade = styled(FaMicrophoneSlash)`
  animation: 0.2s ${keyframes`${zoomIn}`};
`
const MicrophoneFade = styled(FaMicrophone)`
  animation: 0.2s ${keyframes`${zoomOut}`};
`

const defaultConfig = {
  lang: "pt-BR",
  continuous: false,
  immediateVoiceSend: true,
  tts: true,
  visible: true,
}

export default function App() {
  const [config, setConfig] = useState(defaultConfig)
  const [state, setState] = useState("off")
  const [messages, setMessage] = useState([])
  const [msgCount, setCount] = useState(0);

  useEffect(() => {
    respond("Olá!");
  }, []);

  const voice = config.tts ? new Speech() : null;
  sprecog.interimResults = true;
  sprecog.lang = config.lang;
  sprecog.continuous = config.continuous;

  voice && voice.init({
    'volume': 1,
      'lang': 'pt-BR',
      'rate': 1,
      'pitch': 0.9,
      'voice':'Google português do Brasil',
  }).catch(e => {
    alert("Ocorreu um erro ao inicializar o TTS : ", e)
  })

  // function updateScroll(){
  //   try {
  //     var element = document.getElementsByClassName("messagebox")[0];
  //     console.log("scrollTop", element.scrollTop);
  //     console.log("scrollHeight", element.scrollHeight);
  //     element.scrollTop = 99999;
  //   } catch(e){
  //     console.log(e);
  //   }
  // }

  function addMessage(e) {
    setCount(msgCount + 1);
    if (e !== "") {
      var newMessages = messages;
      newMessages.push({id: messages.index + 1, sender: "User", message: e})
      setMessage(newMessages);
      if (state === "on") {
        sprecog.stop()
        setState("off")
      }
      document.getElementById("input").placeholder = "Diga algo!";
    } else {
      document.getElementById("input").placeholder = "Você precisa digitar algo!";
    }
  }

  function respond(e) {
    voice && voice.speak({
      text: e,
    })
    setCount(msgCount + 1);
    if (e !== "") {
      var newMessages = messages;
      newMessages.push({id: messages.index + 1, sender: "Aria", message: e})
      setMessage(newMessages);
      if (state === "on") {
        sprecog.stop()
        setState("off")
      }
    } else {
      alert("Erro na resposta!");
    }
  }
  sprecog.onresult = function(event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const content = event.results[i][0].transcript.trim();
        config.immediateVoiceSend
        ? addMessage(content)
        : document.getElementById("input").value = document.getElementById("input").value + " " + content; cycleAi()
      }
    }
  };
  
  function cycleAi() {
    if (state === "off") {
      sprecog.abort()
      sprecog.start()
      setState("on")
    } else {
      sprecog.stop()
      setState("off")
    }
  }

  function openConfig() {
    setConfig(prevState => {
      return {...prevState, visible: !config.visible};
    });
  }

  function saveChanges(e) {
    e.preventDefault();
    console.log("Config: ", e.target);
    openConfig();
  }

  // lang: "pt-BR",
  // continuous: false,
  // immediateVoiceSend: true,
  // tts: false,
  const configBody = 
    <form onSubmit={(e) => saveChanges(e)}>
      <p>
        Voz da Aria: 
        <input className="configOption" type="checkbox" defaultChecked={config.tts}/>
      </p>

      <p style={{color: !config.tts ? "grey" : null}}>
        Idioma da Voz da Aria: <br/>
        <select disabled={!config.tts} className="langInput" name="lang" defaultValue={config.lang}>
          <option value="pt-BR">Português Brasileiro</option>
          <option value="en-US">Inglês</option>
          <option value="pt-BR">Português Brasileiro</option>
        </select>
      </p>
      <p>
        Mensagem de voz rápida: 
        <input className="configOption" type="checkbox" defaultValue={config.immediateVoiceSend} />
      </p>
      
      <p>
        Linguagem: 
        <input className="configOption" type="checkbox" />
      </p>
      
      <input className="configOption" type="submit" value="Salvar alterações"/>
    </form>

  return (
    <div className="App">
        <div className="chatbox">
          <Modal
            header="Configurações"
            body={configBody}
            footer={<FaChevronRight id="configicon" onClick={openConfig} />}
            visible={config.visible}
          />
          <div id="chatHeader">
            <img src="https://i.imgur.com/XWnne0i_d.webp?maxwidth=760&fidelity=grand" alt="Imagem da Arai"/>
            <p>Aria</p>
          <FaEllipsisV id="configicon" onClick={openConfig} />
          </div>
          {renderMessages(messages)}
          <form autoComplete="off" onSubmit={(e) => {e.preventDefault(); addMessage(e.target.input.value); e.target.input.value = ""}}>
            <input id="input" placeholder="Diga algo!"/>
            {state === "off" ? <MicrophoneSlashFade id="microphone" onClick={cycleAi}/> : <MicrophoneFade id="microphoneOn" onClick={cycleAi}/>}
            <input id="send" type="submit"/>
            <FaPaperPlane id="sendicon" type="submit" />
          </form>
        </div>
        <br/>
    </div>
  );
}
