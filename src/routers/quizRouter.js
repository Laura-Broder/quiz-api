const express = require("express");
const router = new express.Router();
const quizControl = require("../quizControl");

// ----------------------------------------
// create a quiz (from file quiz.js)
// ----------------------------------------
router.post("/quiz/create", quizControl.createQuiz);
// ----------------------------------------
// get the quiz
// ----------------------------------------
router.get("/quiz", quizControl.getQuiz);

module.exports = router;
