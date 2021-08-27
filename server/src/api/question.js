const { Router } = require('express');
const QuestionController = require('../core/QuestionController');
const UserController = require('../core/UserController');

const router = Router();

router.get('/all', async (req, res) => {
  res.json(QuestionController.getAllQuestions());
});

router.post('/answer', async (req, res) => {
  const { id, question, answer } = req.body;
  const response = await QuestionController.evaluateAnswer(question, answer);
  UserController.addQuestion(id, question, answer, response);
  res.json(response);
});

module.exports = router;
