// TODO don't forget to update dev:nodemon src/index.js,

const express = require("express");
require("./db/mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");

const quizRouter = require("./routers/quizRouter");
const useRouter = require("./routers/userRouter");
const friendRouter = require("./routers/friendRouter");

const port = process.env.PORT || 3005;

const app = express();

// app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(quizRouter);
app.use(useRouter);
app.use(friendRouter);

// ----------------------------------------
// ----------------------------------------
app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
