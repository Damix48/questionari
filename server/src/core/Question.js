const { Nlp } = require('@nlpjs/basic');
const { DocumentProcessor, floorDecimal } = require('./utils');

class Question {
  constructor(_question) {
    this.init(_question);
  }

  init(_question) {
    this.question = _question.question;
    this.documents = _question.documents;
    this.entities = _question.entities || [];
    this.levels = _question.levels || {};
    this.stats = _question.stats || { total: 0, correct: 0, incorrect: 0 };
    this.help = _question.help || null;

    this.documentProcessor = new DocumentProcessor();
  }

  initNLP() {
    this.nlp = new Nlp({
      languages: [
        'it',
      ],
      nlu: {
        log: false,
      },
      autoLoad: false,
      autoSave: false,
    });

    this.helpNlp = new Nlp({
      languages: [
        'it',
      ],
      nlu: {
        log: false,
      },
      autoLoad: false,
      autoSave: false,
    });
  }

  toJSON() {
    return {
      question: this.question,
      documents: this.documents,
      entities: this.entities,
      levels: this.levels,
      stats: this.stats,
      help: this.help,
    };
  }

  async train() {
    this.check();
    this.initNLP();
    this.createDataset();
    await this.nlp.train();
    await this.helpNlp.train();
  }

  check() {
    const response = {};
    if (this.stats.quality < 0.5) {
      response.quality = this.stats.quality;
    }

    response.update1 = this.update(this.levels.L1, this.documents);
    response.update2 = this.update(this.levels.L2, this.levels.L1);
    response.update3 = this.update(this.levels.L3, this.levels.L2);

    return response;
  }

  // eslint-disable-next-line class-methods-use-this
  update(from, to) {
    if (from?.length > 3 * to?.length && to?.length > 2) {
      const update = from.splice(Math.floor(Math.random() * from.length), 1);
      to.push(update);
      return `${update}`;
    }
    return null;
  }

  createDataset() {
    this.addEntities();
    this.addDocuments();
    this.addHelp();
  }

  addEntities() {
    this.entities?.forEach((ent) => {
      this.nlp.addNerRuleOptionTexts('it', ent.name, ent.data);
    });
  }

  addDocuments() {
    this.documents?.forEach((doc) => {
      const docProcessed = this.documentProcessor.process(doc);

      this.nlp.addDocument('it', doc, 'corretto');
      this.nlp.addDocument('it', docProcessed.join(' '), 'corretto');

      if (docProcessed.length > 1) {
        docProcessed.forEach((token) => {
          this.nlp.addDocument('it', `${token}`, 'sbagliato');
        });
      }
    });
  }

  addHelp() {
    this.help?.forEach((help, index) => {
      help.trigger.forEach((trigger) => {
        this.helpNlp.addDocument('it', trigger, `help-${index}`);
      });
      help.sentence.forEach((sentence) => {
        this.helpNlp.addAnswer('it', `help-${index}`, sentence);
      });
    });
  }

  async evaluate(_answer) {
    let entityFactor = 1;

    const result = await this.nlp.process('it', this.documentProcessor.process(_answer).join(' '));
    // console.log(result);

    this.entities?.forEach((ent) => {
      const entity = result.entities.filter((resultEnt) => ent.name === resultEnt.entity);
      if (entity.length === 0) {
        entityFactor *= (1 - (ent?.weight || 0));
      }
    });

    if (result.intent === 'corretto') {
      const score = result.classifications[0]?.score;
      const num = score > 0.7 ? score * entityFactor : score;
      return floorDecimal(num, 3);
    }
    const score = result.classifications[1]?.score;
    const num = score > 0.7 ? score * entityFactor : score;
    return floorDecimal(num, 3) || 0;
  }

  async getHelp(_answer) {
    const result = await this.helpNlp.process('it', this.documentProcessor.process(_answer).join(' '));
    console.log(result);
    return result.answer ? result.answer : 'Dimmi di più';
    // ret this.help ? this.help[(Math.floor(Math.random() * this.help?.length))] : 'Dimmi di più';
  }

  async addDocument(_document, level) {
    let document = _document.trim();

    const _result = await this.nlp.process(document);

    _result.entities.forEach((ent) => {
      document = document.replaceAll(ent.sourceText, `@${ent.entity}`);
      document = document.replaceAll('@@', '@');
    });

    if (level === 0) {
      this.documents.push(document);
    } else {
      if (!this.levels[`L${level}`]) this.levels[`L${level}`] = [];
      this.levels[`L${level}`].push(document);
    }
  }

  addStat(isCorrect) {
    this.stats.total += 1;

    if (isCorrect) {
      this.stats.correct += 1;
    } else {
      this.stats.incorrect += 1;
    }

    if (this.stats.total > 10) {
      this.stats.quality = this.stats.correct / this.stats.total;
    } else {
      this.stats.quality = 'Too little data';
    }
  }
}

module.exports = { Question };
