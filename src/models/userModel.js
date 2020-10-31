const mongoose = require("mongoose");
// const validator = require("validator");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quizAnswers: [Number],
  friendsScore: [
    {
      friendName: String,
      friendId: String,
      score: Number,
      total: Number,
    },
  ],
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
