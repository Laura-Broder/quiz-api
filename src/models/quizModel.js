const mongoose = require("mongoose");
// const validator = require("validator");
const { Schema } = mongoose;

const quizSchema = new Schema({
  quiz: [{ qNum: Number, q: String, a: [String] }],
  id: String,
});
const quizModel = mongoose.model("Quiz", quizSchema);

module.exports = quizModel;
