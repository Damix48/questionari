const fs = require('fs');
const { Question } = require('./Question');

class _QuestionManager {
  init(path) {
    this.path = path || this.path;
    const rawdata = fs.readFileSync(this.path);
    this.data = JSON.parse(rawdata);

    this.questions = this.data.map((data) => new Question(data));

    console.log(this.getAllQuestions());
  }

  load() {
    this.init();
  }

  getAllQuestions() {
    return this.questions.map((question) => question.question);
  }
}

const QuestionManager = new _QuestionManager();

module.exports = QuestionManager;
