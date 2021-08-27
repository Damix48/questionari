const fs = require('fs');
const { User } = require('./User');

class _UserController {
  init(path) {
    this.path = path || this.path;

    const rawdata = fs.readFileSync(this.path);
    this.data = JSON.parse(rawdata);

    this.users = this.data.map((d) => new User(d.id, d.name, d.surname, d.questions));
  }

  save() {
    const json = this.users.map((user) => user.toJSON());
    const data = JSON.stringify(json, null, 2);

    fs.writeFileSync(this.path, data);
    this.load();
  }

  load() {
    this.init();
  }

  addQuestion(_id, _question, _answer, _score) {
    const user = this.users.find((_user) => _user.id === _id);
    user.addQuestion(_question, _answer, _score);
    this.save();
  }

  addUser(_id, _name, _surname) {
    this.users.push(new User(_id, _name, _surname));
  }
}

const UserController = new _UserController();

module.exports = UserController;
