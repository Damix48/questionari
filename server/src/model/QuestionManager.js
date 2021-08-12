const fs = require('fs');
const { Question } = require('./Question');

class _QuestionManager {
  init(path) {
    this.path = path || this.path;

    const rawdata = fs.readFileSync(this.path);
    this.data = JSON.parse(rawdata);

    this.questions = this.data.map((data) => new Question(data));

    this.questions.forEach((question) => { question.train(); });
  }

  load() {
    this.init();
  }

  getAllQuestions() {
    return this.questions.map((question) => question.question);
  }

  async evaluateAnswer(_question, _answer) {
    const question = this.questions.find((q) => q.question === _question);

    const result = await question.evaluate(_answer);

    if (result >= 0.3 && result < 0.5) {
      return {
        help: question.getHelp()?.replace('$', _answer) || 'Prova a dirmi di più',
        score: result,
      };
    }

    return { score: result };
  }
}

const QuestionManager = new _QuestionManager();

module.exports = QuestionManager;
