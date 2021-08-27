const { Router } = require('express');
const UserController = require('../core/UserController');

const router = Router();

router.post('/add', async (req, res) => {
  const { id, name, surname } = req.body;
  UserController.addUser(id, name, surname);
  res.json({ created: true });
});

module.exports = router;
