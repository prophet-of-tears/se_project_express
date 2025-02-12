const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  invalidDataError,
  dataNotFound,
  serverError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res
        .status(serverError)
        .send({ message: "An error has occured on the server" })
    );
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res
      .status(invalidDataError)
      .send({ message: "email and password are required" });
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      user.create({
        email,
        password: hash,
        name,
        avatar,
      })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: err.message });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occured on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

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

const login = (req, res) => {
  const { email, password } = req.body;

  // console.log(email);
  // console.log(password);

  // send token as response
  return user
    .findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("incorrect email or password"));
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      //return bcrypt.compare(password, user.password)

      //delete user.password;

      return res.status(200).send({ message: "everything good", token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  user
    .findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    )
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === "ValdationError") {
        return res.status(invalidDataError).send({ message: err.mesage });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(dataNotFound).send({ message: err.message });
      }

      return res.status(serverError).send({ message: "server Error" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
