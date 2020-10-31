const mongoose = require("mongoose");
// const validator = require("validator");
const { Schema } = mongoose;

const friendSchema = new Schema({
  friendName: {
    type: String,
    required: true,
  },
  userName: String,
  userId: String,
  quizAnswers: [Number],
  correctAnswers: Number,
});

const FriendModel = mongoose.model("Friends", friendSchema);

module.exports = FriendModel;
