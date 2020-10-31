const express = require("express");
// ----------------------------------------
// run mongoose db
// ----------------------------------------
require("./db/mongoose");
// ----------------------------------------
// for proxy
// ----------------------------------------
const cors = require("cors");
// ----------------------------------------
// require routers
// ----------------------------------------
const quizRouter = require("./routers/quizRouter");
const useRouter = require("./routers/userRouter");
const friendRouter = require("./routers/friendRouter");
// ----------------------------------------
// port
// ----------------------------------------
const port = process.env.PORT || 3005;
// ----------------------------------------
// express instance
// ----------------------------------------
const app = express();
// ----------------------------------------
// json parser
// ----------------------------------------
app.use(express.json());
app.use(cors());
// ----------------------------------------
// use routes
// ----------------------------------------
app.use(quizRouter);
app.use(useRouter);
app.use(friendRouter);

// ----------------------------------------
// ----------------------------------------
app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
