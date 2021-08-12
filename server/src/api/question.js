const { Router } = require('express');
const QuestionManager = require('../model/QuestionManager');

const router = Router();

router.get('/all', async (req, res) => {
  res.json(QuestionManager.getAllQuestions());
});

router.post('/answer', async (req, res) => {
  const { question, answer } = req.body;
  res.json(await QuestionManager.evaluateAnswer(question, answer));
});

module.exports = router;
