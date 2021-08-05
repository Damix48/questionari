const { Router } = require('express');
const QuestionManager = require('../model/QuestionManager');

const router = Router();

router.get('/all', async (req, res) => {
  res.json(QuestionManager.getAllQuestions());
});

router.get('/answer', async (req, res) => {
  const { question, answer } = req.body;
  res.json({ score: await QuestionManager.evaluateAnswer(question, answer) });
});

module.exports = router;
