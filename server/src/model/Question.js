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
    this.helpOriginal = _question.help;
    this.help = _question.help || null;
  }
}

module.exports = { Question };
