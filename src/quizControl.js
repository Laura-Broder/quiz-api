const fs = require("fs");
const quiz = require("./quiz");
const baseFilePath = "./users/";

// helper functions:

// ----------------------------------------
// write and read files
// ----------------------------------------
const writeFile = (fileName, content) => {
  if (!fileName) throw new Error("no file name was given.");
  if (!content) throw new Error("no content was given.");
  if (!fs.existsSync(baseFilePath)) {
    fs.mkdir(baseFilePath, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  const dataJSON = JSON.stringify(content);
  fs.writeFileSync(`${baseFilePath}${fileName}.json`, dataJSON, (error) => {
    if (error) {
      throw error;
    }
  });
  return dataJSON;
};
const readFile = (fileName) => {
  if (!fileName) throw new Error("no file name was given.");

  const dataBuffer = fs.readFileSync(
    `${baseFilePath}${fileName}.json`,
    (error) => {
      if (error) {
        throw error;
      }
    },
  );

  const dataJSON = dataBuffer.toString();
  return dataJSON;
};
// ----------------------------------------
// generate ID
// ----------------------------------------
const generateId = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

// ----------------------------------------
// calculate the number of right answers
// ----------------------------------------
const calcScore = (object1, object2) => {
  try {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      throw new Error("the number of answers is not equal");
    }
    let counter = 0;
    for (let key of keys1) {
      if (object1[key] === object2[key]) {
        counter = counter + 1;
      }
    }
    return counter;
  } catch (error) {
    throw error;
  }
};

// ----------------------------------------
// create a quiz (from quiz.js)
// ----------------------------------------
exports.createQuiz = (req, res) => {
  try {
    const quizJSON = writeFile("quiz", quiz);
    return res.send(quizJSON);
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------
// get the quiz
// ----------------------------------------
exports.getQuiz = (req, res) => {
  try {
    return res.send(readFile("quiz"));
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------
// create a new user file
// ----------------------------------------
exports.createNewUser = (userName) => {
  const userId = generateId();
  try {
    const newProfile = { name: userName, id: userId };
    return writeFile(userName, newProfile);
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------
// update user file with answers
// ----------------------------------------
exports.updateUserAnswers = (req, res) => {
  if (!req.params.username) {
    throw new Error("no user name was given");
  }
  if (!req.body) {
    throw new Error("no user answers");
  }
  const userName = req.params.username;
  const quizAnswers = req.body;
  try {
    const user = JSON.parse(readFile(userName));
    user.quizAnswers = quizAnswers;
    return res.send(writeFile(userName, user));
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------
// get a profile (name and quiz answers)
// ----------------------------------------
exports.getUserProfile = (req, res) => {
  if (!req.params.username) {
    throw new Error("no user name was given");
  }
  const userName = req.params.username;
  try {
    return res.send(readFile(userName));
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------
// create friend file
// ----------------------------------------
exports.createNewAnswerUser = (req, res) => {
  if (!req.params.username) {
    throw new Error("no user name was given");
  }
  if (!req.params.answerUsername) {
    throw new Error("no friends name was given");
  }
  const userName = req.params.username;
  const answerUsername = req.params.answerUsername;
  const fileName = `${userName}-${answerUsername}-results`;

  const userId = generateId();

  const newAnswerUser = { name: answerUsername, id: userId };
  try {
    return res.send(writeFile(fileName, newAnswerUser));
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------
// update answers in friend's file
// ----------------------------------------
exports.updateAnswerUser = (req, res) => {
  if (!req.params.username) {
    throw new Error("no user name was given");
  }
  if (!req.params.answerUsername) {
    throw new Error("no friends name was given");
  }
  if (!req.body) {
    throw new Error("no answer was given");
  }

  const userName = req.params.username;
  const answerUsername = req.params.answerUsername;
  const fileName = `${userName}-${answerUsername}-results`;
  const newAnswer = req.body;
  try {
    const answerUser = JSON.parse(readFile(fileName));
    answerUser.quizAnswers = { ...answerUser.quizAnswers, ...newAnswer };
    return res.send(writeFile(fileName, answerUser));
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------
// calculate the number of right answers
// update the answerUsername file by adding the score
// ----------------------------------------
exports.getScore = (req, res) => {
  if (!req.params.username) {
    throw new Error("no user name was given");
  }
  if (!req.params.answerUsername) {
    throw new Error("no friends name was given");
  }
  const userName = req.params.username;
  const answerUsername = req.params.answerUsername;
  const resultsFileName = `${userName}-${answerUsername}-results`;
  try {
    const answerUser = JSON.parse(readFile(resultsFileName));
    const user = JSON.parse(readFile(userName));
    friendQuizAnswers = answerUser.quizAnswers;
    userQuizAnswers = user.quizAnswers;

    const score = calcScore(userQuizAnswers, friendQuizAnswers);
    const total = Object.keys(userQuizAnswers).length;
    if (!user.friendsScore) user.friendsScore = [];
    user.friendsScore.push({ friendName: answerUsername, score: score });
    answerUser.correctAnswers = score;

    writeFile(userName, user);
    writeFile(resultsFileName, answerUser);

    return res.send(JSON.stringify({ correctAnswers: score, total: total }));
  } catch (error) {
    throw error;
  }
};
// ----------------------------------------
// collect the correct answers of all friends.
// ----------------------------------------
exports.getResults = (req, res) => {
  if (!req.params.username) {
    throw new Error("no user name was given");
  }
  const userName = req.params.username;
  try {
    const user = JSON.parse(readFile(userName));
    const total = Object.keys(user.quizAnswers).length;

    return res.send(
      JSON.stringify({ friendsScore: user.friendsScore, total: total }),
    );
  } catch (error) {
    throw error;
  }
};
