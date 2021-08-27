class User {
  constructor(_id, _name, _surname, _question) {
    this.id = _id;
    this.name = _name;
    this.surname = _surname;
    this.questions = _question || [];
  }

  addQuestion(_question, _answer, _score) {
    this.questions.push({ question: _question, answer: _answer, result: _score });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      questions: this.questions,
    };
  }
}

module.exports = { User };
