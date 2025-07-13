const express = require('express');
const router = express.Router();
const { getQuestionByLevel, submitCodeAnswer } = require('../controllers/questionController');

router.get('/:level', getQuestionByLevel);
router.post('/submit', submitCodeAnswer);

module.exports = router;
