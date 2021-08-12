class Question {
  constructor(_question) {
    this.question = _question;
    this.text = [this.question];
    this.next = 2;
  }

  addHelp(help) {
    this.text.push(help);
  }

  updateScore(score) {
    this.score = score;
  }

  end() {
    this.next = 0;
  }
}

export default Question;
