const user = require("../models/user");
const {
  invalidDataError,
  dataNotFound,
  serverError,
} = require("../utils/errors.js");

const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "validationError") {
        res.status(dataNotFound).send({ message: "user not found" });
      } else {
        return res.status(serverError).send({ message: err.message });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  user
    .create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: err.message });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  user
    .findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(dataNotFound).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: err.message });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUserById };
