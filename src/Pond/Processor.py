# #Import the libraries
# from newspaper3k import Article
# import random
# import string
# import nltk
# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# import numpy as np
# import warnings
# warnings.filterwarnings('ignore')
# #Download the punkt package
# nltk.download('punkt', quiet=True)
# #Get the article
# article = Article('https://www.mayoclinic.org/diseases-conditions/chronic-kidney-disease/symptoms-causes/syc-20354521')
# article.download()
# article.parse()
# article.nlp()
# corpus = article.text
# #Print the article  text
# print(corpus)
# #Tokenization
# text = corpus
# sentence_list = nltk.sent_tokenize(text) #A list of sentences
# #Print the list of sentences
# print(sentence_list)
# #Function to return a random greeting response to a users greeting
# def greeting_response(text):
#   text = text.lower()

#   #Bots greeting response
#   bot_greetings = ['howdy', 'hi', 'hey', 'hello', 'hola']
#   #Users greeting
#   user_greetings = ['hi', 'hey', 'hello', 'hola', 'greetings', 'wassup']


#   for word in text.split():
#     if word in user_greetings:
#       return random.choice(bot_greetings)
def response(message):
    print("Message: " + message)
    result = ""
    if message == "Olá":
        result = "Saudações usuário!"
    else:
        result = "Erro"
    return result