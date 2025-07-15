const express = require('express');
const router = express.Router();
const { getQuestionByLevel, submitCodeAnswer } = require('../controllers/questionController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { submitHandler } = require('../controllers/questionController');


router.get('/:level', getQuestionByLevel);
router.post('/submit', authenticateUser, submitHandler);


module.exports = router;
