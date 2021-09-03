# Questionari

## Installazione
1. Scaricare la repository.
2. Spostarsi nella cartella `client`
3. Generare i file per il client tramite il comando `yarn build`
4. Spostarsi nella cartella `server`
5. Avviare tramite il comando `yarn start`

Il client può essere raggiunto all'indirizzo http://localhost:1337

## Server
Nella cartella `server` è presente un server **nodejs** necessario per l'utilizzo della libreria **nlp.js**.
Il server legge i dati dal file `quesitons.json` presente nella cartella `server/data`. Il file è composto da un array di oggetti che hanno la seguente struttura:
```json
{
  "question": "Domanda da porre all'utente",
  "documents": 
  [{
    "intent": "nome_corretto",
    "sentences":[
      "array di frasi",
      "corrispondenti alla categoria nome",
      "se aggiunto _corretto si indica che la",
      "categoria è da considerare corretta"
    ]
  }],
  "entities": [{
    "name": "corretto",
    "data": ["corrette", "tutte giuste"],
    "weight": 0.25
  }],
  "levels": {
    "nome": {
      "L1": ["array di frasi che", "hanno ottenuto un punteggio", "tra 0.9 e 0.75"],
      "L2": ["array di frasi che", "hanno ottenuto un punteggio", "tra 0.75 e 0.5"],
      "L3": ["array di frasi che", "hanno ottenuto un punteggio", "tra 0.5 e 0.3"],
    }
  },
  "stats": {
    "total": 17,
    "correct": 6,
    "incorrect": 11,
    "quality": 0.35294117647058826
  },
  "help": [{
    "trigger": ["array di frasi", "o parole"],
    "sentences": ["array di risposte triggerate", "da trigger"]
  }]
}
```
- `question`: domanda da porre all'utente [Obbligatorio]
- `documents`: array che contiente oggetti document con la seguente struttura: [Obbligatorio]
  - `intent`: nome della categoria del documento (aggiuntere `_corretto` dopo in nome se la categoria è da considerare corretta)
  - `sentences`: array che contiene le frasi da utilizzare per allenare al rete
- `entities`: array che contiene le entità che verranno ricercate all'interno delle risposte per ottenere un riconoscimento più preciso. Le entità sono composte con la seguente struttura:
  - `name`: nome dell'entità che verrà sostituita con `@name` all'interno delle frasi salvate
  - `data`: array che contiene le parole riconosciute come entità
  - `weight`: peso tra 0 e 1 che l'entità assume nella valutazione della risposta (più alto più è più basso sarà il punteggio se manca nella risposta)
- `levels`: insieme delle frasi salvate e divise per livelli di correttezza
  - `L1`: livello con un punteggio più alto, compreso tra 0.9 e 0.75 (considerata corretta)
  - `L2`: punteggio medio, compreso tra 0.75 e 0.5 (considerata corretta)
  - `L3`: punteggio basso, compreso tra 0.5 e 0.3 (considerata sbagliata ma viene salvata)
- `stats`: statistiche della domanda
  - `total`: numero di risposte date
  - `correct`: numero di risposte corrette date
  - `incorrect`: numero di risposte sbagliate date
  - `quality`: percentuale di risposte corrette
- `help`: array che contiene le frasi di aiuto che verranno utilizzate se la domanda ottiene un punteggio tra 0.5 e 0.3
  - `trigger`: array di frasi o parole che vengono utilizzate per innescare un help
  - `sentences`: array di aiuti che verranno pescati casualmente

Per aggiungere una nuova domanda da utilizzare sono obbligatorie le proprietà `question` e `documents`.

### API

Il server espone 3 endpoint:
- GET `/api/question/all`
- POST `/api/question/answer`
- POST `/api/user/add`

#### GET `/api/question/all`
Serve per ricevere un array di tutte le domande presenti nel file `server/data/questions.json`.

#### POST `/api/question/answer`
Serve per inviare la risposta di un utente al server.
Richiede un `body` con questa struttura:
```json
{
  "id": "_ELpfMWVSmqgj4DP5xn17",
  "question": "domanda",
  "answer": "risposta"
}
```
- `id`: id dell'utente che risponde alla domanda
- `question`: testo della domanda
- `answer`: risposta data dall'utente

Il server analizza la risposta, la salva sul file `server/data/users.json` e ritorna un risposta con questa struttura: 
```json
{
  "score": 0.4,
  "help": "Prova a dirmi di più",
  "intent": "lavoro_corretto"
}
```
- `score`: punteggio che la risposta ottiene
- `help`: aiuto (opzionale) che il server invia per aiutare nella risposta se il punteggio è tra 0.3 e 0.5
- `intent`: categoria della risposta

#### POST `/api/user/add`
Serve per aggiungere un utente alla lista degli utenti che rispondono alle domande.
Richiede un `body` con questa struttura:
```json
{
  "id": "_ELpfMWVSmqgj4DP5xn17",
  "name": "Marco",
  "surname": "Rossi"
}
```
- `id`: id dell'utente
- `name`: nome dell'utente
- `surname`: cognome dell'utente

## Funzionamento
### Allenamento
Tramite l'utilizzo della libreria [`nlp.js`](https://github.com/axa-group/nlp.js) viene allena una piccola rete neurale in grado di riconoscere tra risposte con *intent* `corretto` e *intent* `sbagliato`.

- Per creare gli intent `corretto` vengono utilizzati le frasi presenti in `documents`:  viene inserita la frase completa e la frase **normalizzata** e a cui sono state rimosse le **stopword**.
- Per creare gli intent `sbagliato` vengono presi i vari *token* delle varie frasi presenti in `documents`.
### Riconoscimento
Il riconoscimento delle risposte avviene tramite l'utilizzo della libreria [`nlp.js`](https://github.com/axa-group/nlp.js).

La risposta viene **normalizzata** e vengono rimosse le **stopword** tramite `DocumentProcessor` presente in `server/src/core/utils.js`.
Viene poi effettuta la vera analisi della risposta tramite la funzione `nlp.process()`. Il risultato della funzione viene poi pesato in base alla presenza/assenza delle entità presenti e del loro preso (si veda la struttura JSON della domanda).

### Estensione `documents` di una domanda
Se una risposta data dall'utente viene valutata molto positivamente viene inserita direttamente come nuova frase in `documents`, altrimenti viene salvata in vari livelli su `levels`. Una frase può salire di livello o passare nei documents solo se nel livello ci sono 3 volte più frasi che nel livello successivo.

`documents` può essere aggioranta anche manualmente.
