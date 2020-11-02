const express = require("express");
const router = new express.Router();
const UserModel = require("../models/userModel");
// ----------------------------------------
// receive new username and create new json file
// ----------------------------------------

router.post("/quiz-api/:username/create", async (req, res) => {
  const userName = req.params.username.toLowerCase();
  const newUser = new UserModel({ name: userName });
  try {
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (error) {
    return res.status(400).send(error);
  }
});
// ----------------------------------------
// receive answers and update user file
// ----------------------------------------
// TODO move ID to body?
router.patch("/quiz-api/:username/update/:id", async (req, res) => {
  const userName = req.params.username;
  const userId = req.params.id;
  const quizAnswers = req.body;
  const answersArray = [];

  if (!(userName && userId)) {
    throw new Error("no user name/ID was given");
  }
  if (!quizAnswers) {
    throw new Error("no user answers");
  }
  try {
    quizAnswers.forEach((a) => {
      answersArray[a.qNum] = a.aNum;
    });
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { quizAnswers: answersArray },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      return res.status(404).send(`No user was found with ID "${userId}".`);
    }
    return res.status(201).send(updatedUser);
  } catch (error) {
    return res.status(500).send(error);
  }
});
// ----------------------------------------
// get a profile (name and quiz answers)
// ----------------------------------------
router.get("/quiz-api/:username/:id", async (req, res) => {
  const userName = req.params.username;
  const userId = req.params.id;
  if (!(userName && userId)) {
    throw new Error("no user name/ID was given");
  }
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("no user was found");
    }
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
// ----------------------------------------
// collect the correct answers of all friends.
// ----------------------------------------
router.get("/quiz-api/:username/results/:id", async (req, res) => {
  const userName = req.params.username;
  const userId = req.params.id;
  if (!(userName && userId)) {
    throw new Error("no user name/ID was given");
  }
  try {
    const user = await UserModel.findById(userId);
    const total = Object.keys(user.quizAnswers).length;

    return res.send({ friendsScore: user.friendsScore, total: total });
  } catch (error) {
    throw error;
  }
});

module.exports = router;
