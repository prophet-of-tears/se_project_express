const express = require("express");
const mongoose = require("mongoose");
const process = require("process");
const cors = require("cors");
require("dotenv").config();

const { errors } = require("celebrate");
const routes = require("./routes");
const errorHandler = require("./Error-Handling/Error-Handling");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to db");
  })
  .catch(console.error);

app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
