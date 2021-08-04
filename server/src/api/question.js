const { Router } = require('express');

const router = Router();

router.get('/all', async (req, res) => {
  res.json([{ question: 'ciaooo', document: 'prova' }, { question: 'test', document: 'testtest' }]);
});

module.exports = router;
