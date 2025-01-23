const user = require("../models/user");
const {
  invalidDataError,
  dataNotFound,
  serverError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      return res
        .status(serverError)
        .send({ message: "An error has occured on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  user
    .create({ name, avatar })
    .then((users) => res.status(201).send(users))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: err.message });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occured on the server" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  user
    .findById(userId)
    .orFail()
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(dataNotFound).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: err.message });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { getUsers, createUser, getUserById };
