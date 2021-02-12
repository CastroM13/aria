from vosk import Model, KaldiRecognizer
import json
import pyttsx3
import pyaudio
import os

# Verificando modelo pre-treinado
if not os.path.exists("model-br"):
    print ("Favor verificar existencia do modelo treinado em model-br.")
    exit (1)

# Ativando microfone
p = pyaudio.PyAudio()
stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000)
stream.start_stream()

# Atribuindo modelo de reconhecimento
model = Model("model-br")
rec = KaldiRecognizer(model, 16000)

# Inicializando biblioteca
speaker=pyttsx3.init()

# Definindo atributos:
#    Lingua: portugues do Brasil
#    Velocidade: padrao (200) -45
speaker.setProperty('voice', 'brazil')
rate = speaker.getProperty('rate')
speaker.setProperty('rate', rate-45)

# Loop continuo
while True:
    # Lendo audio do microfone
    data = stream.read(4000)

    # Convertendo em texto    
    if rec.AcceptWaveform(data):
        # Fazendo a leitura do JSON para extrair apenas o texto capturado
        print(rec.Result())
        finalResult = json.loads(rec.Result())
        texto = finalResult.get("text")
        
        # Verifica se ha texto a ser dito antes de enviar para o TTS
        if len(texto) > 0 :
            speaker.say(texto)
            speaker.runAndWait()
    else:
        print(rec.PartialResult())