# Questionari

## Server
Nella cartella `server` è presente un server **nodejs** necessario per l'utilizzo della libreria **nlp.js**.
Il server legge i dati dal file presente in `data/quesitons.json`. Il file è composto da un array di oggetti che hanno la seguente struttura:
```json
{
  "question": "Domanda da porre all'utente",
  "documents": ["array di frasi considerate @corretto", "che servono per il riconoscimento delle nuove"],
  "entities": [{
    "name": "corretto", // nome dell'entità che verrà sostituita con @name all'interno delle frasi salvate
    "data": ["corrette", "giuste"], // array di parole riconosciute come entità
    "weight": 0.25 // peso tra 0 e 1 che l'entità assume nella valutazione della risposta (più alto più è più basso sarà il punteggio se manca nella risposta)
  }], // array di entità che verranno ricercate all'interno della risposta per ottenere un riconoscimento più preciso
  "levels": {
    "L1": ["array di frasi che", "hanno ottenuto un punteggio", "tra 0.9 e 0.75"],
    "L2": ["array di frasi che", "hanno ottenuto un punteggio", "tra 0.75 e 0.5"],
    "L3": ["array di frasi che", "hanno ottenuto un punteggio", "tra 0.5 e 0.3"],
  }, // insieme delle frasi salvate divise per livelli di correttezza
  "stats": {
    "total": 17, // numero di risposte date
    "correct": 6, // numero di risposte corrette date
    "incorrect": 11, // numero di risposte sbagliate date
    "quality": 0.35294117647058826 // % di risposte corrette
  },
  "help": ["array di frasi", "che verranno pescate casualmente", "per aiutare nella risposta", "se il punteggio si trova nel range", "tra 0.5 e 0.3"]
}
```