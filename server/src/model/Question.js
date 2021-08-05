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
  }

  async train() {
    this.initNLP();
    this.createDataset();
    await this.nlp.train();
  }

  createDataset() {
    this.addEntities();
    this.addDocuments();
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
      // this.nlp.addDocument('it', `non ${docProcessed.join(' ')}`, 'sbagliato');

      if (docProcessed.length > 1) {
        docProcessed.forEach((token) => {
          this.nlp.addDocument('it', `${token}`, 'sbagliato');
        });
      }
    });
  }

  async evaluate(_answer) {
    let entityFactor = 1;

    const result = await this.nlp.process('it', this.documentProcessor.process(_answer).join(' '));
    // const result = await this.nlp.process("it", answer);

    this.entities?.forEach((ent) => {
      const entity = result.entities.filter((resultEnt) => ent.name === resultEnt.entity);
      if (entity.length === 0) {
        entityFactor *= (1 - (ent?.weight || 0));
      }
    });

    console.log(result);

    if (result.intent === 'corretto') {
      const score = result.classifications[0]?.score;
      const num = score > 0.7 ? score * entityFactor : score;
      return floorDecimal(num, 3);
    }
    const score = result.classifications[1]?.score;
    const num = score > 0.7 ? score * entityFactor : score;
    return floorDecimal(num, 3) || 0;
  }
}

module.exports = { Question };
