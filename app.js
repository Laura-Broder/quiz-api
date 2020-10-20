const express = require("express");
const bodyParser = require("body-parser");
const quizControl = require("./quizControl");
// const cors = require("cors");
const port = process.env.PORT || 3005;
const app = express();
app.use(bodyParser.json());
// app.use(cors());

// TODO fix error handling - every function should handle the errors of it's own responsibility.

// ----------------------------------------
// create a quiz (from file quiz.js)
// ----------------------------------------
app.post("/quiz/create", quizControl.createQuiz);
// ----------------------------------------
// get the quiz
// ----------------------------------------
app.get("/quiz", quizControl.getQuiz);
// ----------------------------------------
// receive new username and create new json file
// ----------------------------------------
// app.post("/quiz/:username/create", quizControl.createNewUser);
// TODO rewrite the functions so the app will handle the req and res and send what is relevant to the quizControl functions
app.post("/quiz/:username/create", (req, res) => {
  if (!req.params.username) {
    throw new Error("no user name was given");
  }
  const userName = req.params.username;
  const newUserProfile = quizControl.createNewUser(userName);
  res.send(newUserProfile);
});
// ----------------------------------------
// receive answers and update user file
// ----------------------------------------
app.put("/quiz/:username/update", quizControl.updateUserAnswers);
// ----------------------------------------
// get a profile (name and quiz answers)
// ----------------------------------------
app.get("/quiz/:username", quizControl.getUserProfile);
// ----------------------------------------
// receive new answerUsername and add to the results file
// ----------------------------------------
app.post(
  "/quiz/:username/answer/:answerUsername/create",
  quizControl.createNewAnswerUser,
);

// ----------------------------------------
// receive answers and update user file
// ----------------------------------------
app.put(
  "/quiz/:username/answer/:answerUsername/update",
  quizControl.updateAnswerUser,
);

// ----------------------------------------
// calculate the number of right answers
// update the answerUsername file by adding the score
// ----------------------------------------
app.put(
  "/quiz/:username/answer/:answerUsername/get-score",
  quizControl.getScore,
);

// ----------------------------------------
// collect the correct answers of all friends.
// ----------------------------------------
app.get("/quiz/results/:username", quizControl.getResults);

// ----------------------------------------
// ----------------------------------------
app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
