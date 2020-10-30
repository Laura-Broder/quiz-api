const express = require("express");
const router = new express.Router();
const quizControl = require("../quizControl");

// ----------------------------------------
// receive new username and create new json file
// ----------------------------------------
// app.post("/quiz/:username/create", quizControl.createNewUser);
// TODO rewrite the functions so the app will handle the req and res and send what is relevant to the quizControl functions
router.post("/quiz/:username/create", (req, res) => {
  if (!req.params.username) {
    throw new Error("no user name was given");
  }
  const userName = req.params.username.toLowerCase();
  const newUserProfile = quizControl.createNewUser(userName);
  res.send(newUserProfile);
});
// ----------------------------------------
// receive answers and update user file
// ----------------------------------------
router.put("/quiz/:username/update", quizControl.updateUserAnswers);
// ----------------------------------------
// get a profile (name and quiz answers)
// ----------------------------------------
router.get("/quiz/:username", quizControl.getUserProfile);
// ----------------------------------------
// collect the correct answers of all friends.
// ----------------------------------------
router.get("/quiz/:username/results", quizControl.getResults);

module.exports = router;
