import speech_recognition as sr
import pyttsx3
import json
from datetime import datetime

speaker=pyttsx3.init()

speaker.setProperty('voice', 'brazil')
rate = speaker.getProperty('rate')
speaker.setProperty('rate', rate)
speaker.setProperty('gender', 'neutral')

def dictionary(text):
    if "que dia é hoje" in text:
        speaker.say(datetime.now().strftime("%d/%m/%y"))
        speaker.runAndWait()
    if "que horas são" in text:
        speaker.say(datetime.now().strftime("%H:%M:%S"))
        speaker.runAndWait()
    if "obrigado" in text:
        speaker.say("De nada")
        speaker.runAndWait()
    if "altere a velocidade de fala para 300" in text:
        speaker.setProperty('rate', 300)
        speaker.say("Ok, velocidade de fala alterada")
        speaker.runAndWait()

r = sr.Recognizer()

with sr.Microphone() as s:
    inicializado = False
    speaker.say("Microfone Inicializado")
    r.adjust_for_ambient_noise(s)
    speaker.say("Filtro de Som Ambiente Inicializado")

    speaker.say("Olá, do que precisa hoje?")
    speaker.runAndWait()
    while True:
        try:
            audio = r.listen(s)
            speech = r.recognize_google(audio, language='pt-BR')
            print(speech)
            speaker.runAndWait()
            if speech.lower() == "encerrar":
                speaker.say("Encerrando")
                speaker.runAndWait()
                break
            if inicializado == True:
                dictionary(speech.lower())
            if "inicializar" in speech.lower():
                speaker.say("Inicializando")
                inicializado = True

        except Exception as e:
            print ("Erro: ", e)