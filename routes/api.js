const express = require('express');
const router = express.Router();
const questionsRouter = require('./questions');

router.use('/question', questionsRouter);

module.exports = router;