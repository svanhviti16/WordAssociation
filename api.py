import requests
import responder
from urllib.parse import unquote
from reynir.bincompress import BIN_Compressed

#database
from peewee import *
db = SqliteDatabase('wordsfromusers.db')

class Frumfletta(Model):
    frumfletta = CharField(unique=True)
    class Meta:
        database = db

class UserInput(Model):
    word = CharField()
    frumfletta = ForeignKeyField(Frumfletta)
    count = IntegerField(default=0)
    class Meta:
        database = db 

db.connect()
db.create_tables([UserInput, Frumfletta])

#beygingarlýsing
bin = BIN_Compressed()
# setting the header parameters in the constructor
api = responder.API(cors=True, cors_params={'allow_origins':['*']})

API_URL = 'http://nidhoggur.rhi.hi.is/ordanet-api/api'
RANDOM_ENDPOINT = 'skyldheiti/handahof/'
RELATED_ENDPOINT = 'skyldheiti/'

@api.route('/skyldflettur')
def get_word(req, resp):
    while True:
        word = requests.get(f'{API_URL}/{RANDOM_ENDPOINT}').json()['results'][0]['frumfletta']
        if ' ' not in word:
            break
    payload = {'frumfletta': word}
    result_list = requests.get(f'{API_URL}/{RELATED_ENDPOINT}', params=payload).json()['results']
    related_words = [result['skyldfletta'] for result in result_list]
    
    user_words = {}
    for entry in UserInput.select(UserInput, Frumfletta).join(Frumfletta).where(Frumfletta.frumfletta == word):
        user_words[entry.word] = entry.count
    print(user_words)

    resp.media = { 'frumfletta': word,
                  'skyldflettur': related_words,
                  'notendaord': user_words }

# validates whether the word appears in BÍN
@api.route('/userword/{userword}+{frumfletta}')
def is_valid_word(req, resp, *, userword, frumfletta):
    user_word = unquote(userword)
    frumfletta = unquote(frumfletta)
    print(user_word)
    print(bool(bin.lookup(user_word)))
    resp.media = {'is_valid': bool(bin.lookup(user_word))}

    # checks if word exists, returns two values
    frfletta, _ = Frumfletta.get_or_create(frumfletta=frumfletta)
    userinp, _ = UserInput.get_or_create(word=user_word, frumfletta=frfletta)
    userinp.count += 1

    frfletta.save()
    userinp.save()

for entry in UserInput.select():
    print(f'{entry.word} - {entry.frumfletta.frumfletta} – {entry.count}')

if __name__ == '__main__':
    api.run()

