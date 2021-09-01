const fs = require('fs');
const { User } = require('./User');

class _UserController {
  // Inizializza tutte gli user presenti del file indicato da path
  init(path) {
    this.path = path || this.path;

    const rawdata = fs.readFileSync(this.path);
    this.data = JSON.parse(rawdata);

    this.users = this.data.map((d) => new User(d.id, d.name, d.surname, d.questions));
  }

  load() {
    this.init();
  }

  // Vengono salvati gli aggiornamenti degli utenti su file
  save() {
    const json = this.users.map((user) => user.toJSON());
    const data = JSON.stringify(json, null, 2);

    fs.writeFileSync(this.path, data);
    this.load();
  }

  // Aggiunge le risposte all'utente
  addQuestion(_id, _question, _answer, _score) {
    const user = this.users.find((_user) => _user.id === _id);
    user.addQuestion(_question, _answer, _score);
    this.save();
  }

  // Crea un utente
  addUser(_id, _name, _surname) {
    this.users.push(new User(_id, _name, _surname));
  }
}

const UserController = new _UserController();

module.exports = UserController;
