const express = require("express");
const router = new express.Router();
const quizControl = require("../quizControl");

// ----------------------------------------
// receive new answerUsername and add to the results file
// ----------------------------------------
router.post(
  "/quiz/:username/answer/:answerUsername/create",
  quizControl.createNewAnswerUser,
);

// ----------------------------------------
// receive answers and update user file
// ----------------------------------------
router.put(
  "/quiz/:username/answer/:answerUsername/update",
  quizControl.updateAnswerUser,
);

// ----------------------------------------
// calculate the number of right answers
// update the answerUsername file by adding the score
// ----------------------------------------
router.put(
  "/quiz/:username/answer/:answerUsername/get-score",
  quizControl.getScore,
);

module.exports = router;
