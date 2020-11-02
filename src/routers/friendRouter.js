const express = require("express");
const router = new express.Router();
const UserModel = require("../models/userModel");
const FriendModel = require("../models/friendModel");

// ----------------------------------------
// receive new answerUsername and add to the results file
// ----------------------------------------
router.post(
  "/quiz-api/:username/answer/:answerUsername/create/:userId",
  async (req, res) => {
    const userName = req.params.username;
    const answerUsername = req.params.answerUsername.toLowerCase();
    const userId = req.params.userId;

    if (!(userName && userId)) {
      throw new Error("no user name/ID was given");
    }
    if (!answerUsername) {
      throw new Error("no friends name was given");
    }
    const newFriend = await FriendModel({
      friendName: answerUsername,
      userName: userName,
      userId: userId,
    });
    try {
      await newFriend.save();
      return res.status(201).send(newFriend);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
);

// ----------------------------------------
// receive answers and update user file
// ----------------------------------------
router.patch(
  "/quiz-api/:username/answer/:answerUsername/update/:userId/:friendId",
  async (req, res) => {
    const userName = req.params.username;
    const answerUsername = req.params.answerUsername;
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const newAnswer = req.body;

    if (!(userName && userId)) {
      throw new Error("no user name/ID was given");
    }
    if (!(answerUsername && friendId)) {
      throw new Error("no friend name/ID was given");
    }
    if (!newAnswer) {
      throw new Error("no answer was given");
    }

    try {
      const updatedFriend = await FriendModel.findById(friendId);

      if (!updatedFriend) {
        return res
          .status(404)
          .send(`No friend was found with ID "${friendId}".`);
      }

      updatedFriend.quizAnswers.set(newAnswer.qNum, newAnswer.aNum);

      await updatedFriend.save();
      return res.status(201).send(updatedFriend);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
);

// ----------------------------------------
// calculate the number of right answers
// update the answerUsername file by adding the score
// ----------------------------------------

router.patch(
  "/quiz-api/:username/answer/:answerUsername/get-score/:userId/:friendId",
  async (req, res) => {
    const userName = req.params.username;
    const answerUsername = req.params.answerUsername;
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    if (!(userName && userId)) {
      throw new Error("no user name/ID was given");
    }
    if (!(answerUsername && friendId)) {
      throw new Error("no friend name/ID was given");
    }

    try {
      const user = await UserModel.findById(userId);
      const userAnswers = user.quizAnswers;

      const friend = await FriendModel.findById(friendId);
      const friendAnswers = friend.quizAnswers;

      if (friendAnswers.length !== userAnswers.length) {
        throw new Error("the number of answers is not equal");
      }

      const total = userAnswers.length;
      const score = userAnswers.reduce((sum, next, index) => {
        return friendAnswers[index] === next ? sum++ : sum;
      });

      friend.correctAnswers = score;
      friend.save();

      const newFriend = {
        friendName: answerUsername,
        friendId,
        score,
        total,
      };

      user.friendsScore.push(newFriend);
      user.save();

      return res.send({ score, total });
    } catch (error) {
      throw error;
    }
  },
);

module.exports = router;
