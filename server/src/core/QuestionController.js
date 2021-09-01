const fs = require('fs');
const chalk = require('chalk');
const { Question } = require('./Question');

class _QuestionController {
  // Inizializza tutte le domande presenti del file indicato da path
  init(path) {
    this.path = path || this.path;

    const rawdata = fs.readFileSync(this.path);
    this.data = JSON.parse(rawdata);

    // Vengono create tutte le domande
    this.questions = this.data.map((data) => new Question(data));

    // Vengono allenate le domande per riconoscere le risposte
    this.questions.forEach((question) => { question.train(); });

    // Vengono controllate le risposte e potenzialmente aggiornati i livelli e i documents
    this.questions.forEach((question) => {
      const response = question.check();
      console.log(chalk.blue(`Domanda: '${question.question}'`));
      if (response.quality) {
        console.log(chalk.red(`\tLa percentuale di risposte corrette è bassa (${(response.quality * 100).toFixed(2)}%).`));
      }
      if (response.update1) {
        console.log(chalk.red(`\tLa frase ${response.update1} è stata spostata nei documenti (dal livello 1).`));
      }
      if (response.update2) {
        console.log(chalk.red(`\tLa frase ${response.update2} è stata spostata nel livello 1 (dal livello 2).`));
      }
      if (response.update3) {
        console.log(chalk.red(`\tLa frase ${response.update3} è stata spostata nei livello 2 (dal livello 3).`));
      }
      console.log(chalk.blueBright('  Controllo completato\n'));
    });
  }

  load() {
    this.init();
  }

  // Vengono salvati gli aggiornamenti delle domande su file
  save() {
    const json = this.questions.map((question) => question.toJSON());
    const data = JSON.stringify(json, null, 2);

    fs.writeFileSync(this.path, data);
    this.load();
  }

  getAllQuestions() {
    return this.questions.map((question) => question.question);
  }

  // Viene valutata la risposta _answer per la domanda _question
  async evaluateAnswer(_question, _answer) {
    const question = this.questions.find((q) => q.question === _question);

    const result = await question.evaluate(_answer);

    if (result >= 0.9) {
      await question.addDocument(_answer, 0);
      question.addStat(true);
    } else if (result >= 0.75) {
      await question.addDocument(_answer, 1);
      question.addStat(true);
    } else if (result >= 0.5) {
      await question.addDocument(_answer, 2);
      question.addStat(true);
    } else if (result >= 0.3) {
      await question.addDocument(_answer, 3);
      question.addStat(false);
    } else {
      question.addStat(false);
    }

    this.save();

    // Se il punteggio della domanda è tra 0.3 e 0.5 (livello L3) viene dato un suggerimento
    if (result >= 0.3 && result < 0.5) {
      return {
        help: (await question.getHelp(_answer))?.replace('$', _answer) || 'Prova a dirmi di più',
        score: result,
      };
    }

    return { score: result };
  }
}

const QuestionController = new _QuestionController();

module.exports = QuestionController;
