# -*- coding: utf-8 -*-
from flask import Flask, request
from requests import get
from bs4 import BeautifulSoup
from flask_cors import CORS, cross_origin
from Processor import response
import json

app = Flask("pond")
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

@app.route("/solicitacao", methods=["POST"])
@cross_origin()
def solicitacao():
  return response(json.loads(request.data.decode('utf-8')))

@app.route("/treinar", methods=["POST"])
@cross_origin()
def treinar():
  return response(json.loads(request.data.decode('utf-8')))

@app.route("/noticias/<fonte>", methods=["GET"])
@cross_origin()
def Noticias(fonte):
  if fonte == "canalrural":
    noticias = get('https://www.canalrural.com.br/noticias-da-agropecuaria/')
    retorno = []
    if noticias:
      page = BeautifulSoup(noticias.content, 'html.parser')
      noticiasFormatadas = page.find_all("div", "info")
      for noticia in noticiasFormatadas:
        retorno.append({"title": noticia.find('a') and noticia.find('a')['title'], "date": noticia.find(attrs={'data-hora'}), "link": noticia.find('a') and noticia.find('a')['href']})
    return str(retorno)
  elif fonte == "globo":
    noticias = get('http://g1.globo.com/dynamo/natureza/rss2.xml')
    retorno = []
    if noticias:
      noticiasFormatadas = BeautifulSoup(noticias.content, 'html.parser')
      todasNoticiasNomes = noticiasFormatadas.find_all("item")
      for noticia in todasNoticiasNomes:
        titulo = BeautifulSoup(str(noticia.find("title")), "html.parser").text
        link = BeautifulSoup(str(noticia.find("guid")), "html.parser").text
        try:
            data = BeautifulSoup(str(noticia.find("guid")), "html.parser").text.split("noticia/")[1][0:10]
        except IndexError:
            data = 'Sem data'
        # retorno.append(f"Título: {titulo}%0aData: {data}%0aLink: {link}")
        retorno.append({"title": titulo, "date": data, "link": link})
    return str(retorno)

@app.route("/cotas/cepea/<tipo>", methods=["GET"])
@cross_origin()
def CotacaoCepea1(tipo):
  retorno = []
  noticias = get(f'https://www.cepea.esalq.usp.br/br/indicador/{tipo}.aspx')
  page = BeautifulSoup(noticias.content, 'html.parser')
  cotacoes = page.find_all("table")[0]
  nota = page.find_all(attrs={"imagenet-fonte-tabela"})[1].text
  cotacaoIndividual = cotacoes.find_all("tr")
  for cotacao in cotacaoIndividual:
    if cotacao.find_all("td"):
      retorno.append({"description": f"No dia {cotacao.find_all('td')[0].text} a cotação de {tipo} fechou em R$ {cotacao.find_all('td')[1].text} e US$ {cotacao.find_all('td')[4].text} com uma variação diária de {cotacao.find_all('td')[2].text} e mensal de {cotacao.find_all('td')[3].text}.",
                      "nota": nota})
  return str(retorno)

app.run()