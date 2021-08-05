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

    return question.evaluate(_answer);
  }
}

const QuestionManager = new _QuestionManager();

module.exports = QuestionManager;
