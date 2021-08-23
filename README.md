# Questionari

## Server
Nella cartella `server` è presente un server **nodejs** necessario per l'utilizzo della libreria **nlp.js**.
Il server legge i dati dal file presente in `data/quesitons.json`. Il file è composto da un array di oggetti che hanno la seguente struttura:
```json
{
  "question": "Domanda da porre all'utente",
  "documents": ["array di frasi considerate @corretto", "che servono per il riconoscimento delle nuove"],
  "entities": [{
    "name": "corretto",
    "data": ["corrette", "tutte giuste"],
    "weight": 0.25
  }],
  "levels": {
    "L1": ["array di frasi che", "hanno ottenuto un punteggio", "tra 0.9 e 0.75"],
    "L2": ["array di frasi che", "hanno ottenuto un punteggio", "tra 0.75 e 0.5"],
    "L3": ["array di frasi che", "hanno ottenuto un punteggio", "tra 0.5 e 0.3"],
  },
  "stats": {
    "total": 17,
    "correct": 6,
    "incorrect": 11,
    "quality": 0.35294117647058826
  },
  "help": ["array di frasi", "che verranno pescate casualmente", "per aiutare nella risposta", "se il punteggio si trova nel range", "tra 0.5 e 0.3"]
}
```
* `question`: domanda da porre all'utente
* `documents`: array che contiente le frasi considerate corrette. Queste frasi verranno utilizzate per il riconoscimento delle nuove risposte
* `entities`: array che contiene le entità che verranno ricercate all'interno delle risposte per ottenere un riconoscimento più preciso. Le entità sono composte con la seguente struttura:
  * `name`: nome dell'entità che verrà sostituita con `@name` all'interno delle frasi salvate
  * `data`: array che contiene le parole riconosciute come entità
  * `weight`: peso tra 0 e 1 che l'entità assume nella valutazione della risposta (più alto più è più basso sarà il punteggio se manca nella risposta)
* `levels`: insieme delle frasi salvate e divise per livelli di correttezza. `L1` è il livello con un punteggio più alto, `L2` punteggio medio (sempre sopra a 0.5 e quindi considerate corrette), `L3` punteggio tra 0.5 e 0.3, sono considerate errate ma vengono salvate ugualemente
* `stats`: statistiche della domanda
  * `total`: numero di risposte date
  * `correct`: numero di risposte corrette date
  * `incorrect`: numero di risposte sbagliate date
  * `quality`: percentuale di risposte corrette
* `help`: array di frasi che verranno pescate casualmente per aiutare nella risposta se il punteggio si trova nel range tra 0.5 e 0.3