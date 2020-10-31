const express = require("express");
const router = new express.Router();
// TODO split the functions in to a separate file
// const quizControl = require("../controllers/quizControl");
const QuizModel = require("../models/quizModel");
const testQuiz = require("../quiz");

// ----------------------------------------
// create a quiz (from file quiz.js)
// ----------------------------------------
router.post("/quiz-api/create-quiz", async (req, res) => {
  const newQuiz = new QuizModel(testQuiz);
  try {
    await newQuiz.save();
    return res.status(201).send(newQuiz);
  } catch (error) {
    return res.status(400).send(error);
  }
});
// ----------------------------------------
// get the quiz
// ----------------------------------------
// TODO update route in the axios request on client side
router.get("/quiz-api/:id", async (req, res) => {
  const quizId = req.params.id;
  try {
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).send("no quiz was found");
    }
    return res.status(200).send(quiz);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
