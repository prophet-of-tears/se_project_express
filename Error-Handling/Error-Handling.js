const express = require("express");

const app = express();

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message =
    statusCode === 500 ? "an error has occured on the server" : err.message;

  console.error(err);
  res.status(statusCode).send({ message });
  next();
});

module.exports = app;
