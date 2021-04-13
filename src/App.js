import React, { useCallback, useEffect, useReducer, useState } from "react";
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
  const [config, setConfig] = useState(defaultConfig);
  const [state, setState] = useState("off");
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessage] = useState([]);
  const [msgCount, setCount] = useState(0);

  const apiDialog = async (message) => {
    await fetch(`http://localhost:5000/mensagem/${message}`)
      .then(function(response) {
        return response.text();
      }).then((e) => {
        var size = message.match(/\d+/) && message.match(/\d+/)[0]
        console.log('size', size)
        var filteredOutput = JSON.parse(e.replaceAll("\'", "\"").replaceAll("\\xa0", ""))
        if (size !== null) {
          filteredOutput = filteredOutput.slice(0, size)
        }
        filteredOutput.map((e) => {
          ariaMessage(
            <>
              <span className="bold">{e.title || e.description}</span><br/>
              {e.link ? <a href={e.link}>{e.link}</a> : null}<br/>
              <span>{e.date || e.nota || e.text}</span>
            </>
          )
        })
      })
  }

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

  function addMessage(e, user) {
    setLoaded(true);
    var newMessages = messages;
    newMessages.push({id: messages.index + 1, sender: user, message: e})
    setMessage(newMessages);
  }
  
  function speak(e) {
    voice && voice.speak({
      text: e,
    })
  }

  function userMessage(e) {
    if (e !== "") {
        addMessage(e, "User")
        apiDialog(e);
        setCount(msgCount + 1);
      if (state === "on") {
        sprecog.stop()
        setState("off")
      }
      document.getElementById("input").placeholder = "Diga algo!";
    } else {
      document.getElementById("input").placeholder = "Você precisa digitar algo!";
    }
  }

  function ariaMessage(e) {
    if (e !== "") {
      addMessage(e, "Aria")
      setLoaded(false);
      setCount(msgCount + 1);
      document.getElementById("messagebox").scrollTop = document.getElementById("messagebox").scrollHeight;
      if (state === "on") {
        sprecog.stop()
        setState("off")
      }
    }
  }

  sprecog.onresult = function(event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const content = event.results[i][0].transcript.trim();
        config.immediateVoiceSend
        ? userMessage(content)
        : document.getElementById("input").value = document.getElementById("input").value + " " + content; cycleAi();
      }
    }
  };

  // deprecated voice recognition reload method
  function cycleAi() {
    if (state === "off") {
      sprecog.abort();
      sprecog.start();
      setState("on");
    } else {
      sprecog.stop()
      setState("off");
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
            <img src="https://i.imgur.com/XWnne0i_d.webp?maxwidth=760&fidelity=grand" alt="Imagem da Aria"/>
            <p>Aria</p>
          <FaEllipsisV id="configicon" onClick={openConfig} />
          </div>
          {loaded ? <div>Carregando</div> : null}
          {renderMessages(messages)}
          <form autoComplete="off" onSubmit={(e) => {e.preventDefault(); userMessage(e.target.input.value); e.target.input.value = ""; setLoaded(true)}}>
            <input id="input" placeholder="Diga algo!"/>
            {state === "off" ? <MicrophoneSlashFade id="microphone" onClick={cycleAi}/> : <MicrophoneFade id="microphoneOn" onClick={cycleAi}/>}
            <input id="send" type="submit"/>
            <FaPaperPlane id="sendicon" type="submit" />
          </form>
        </div>
    </div>
  );
}
