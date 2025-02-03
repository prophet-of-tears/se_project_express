const user = require("../models/user");
const bcrypt = require("bcryptjs");
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
  console.log(name, avatar);

  if (!name || !avatar || !email || !password) {
    return res
      .status(invalidDataError)
      .send({ message: "email and password are required" });
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      user.create({
        email: req.body.email,
        password: hash,
        name: name,
        avatar: avatar,
      })
    )
    .then((users) => res.status(201).send(users))
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
  const { userId } = req.user._id;

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

  // call user.findByCredentials
  // if user is found, create token
  //   const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
  //   expiresIn: "7d",
  // });
  // send token as response
  user.findUserByCredentials({ email });
  user
    .findOne({ email })
    .select("+password")
    .then((user) => {
      if (user) {
        return res.send(user.password);
      }
    })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("incorrect email or password"));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("incorrect email or password"));
      }
      return res.send({ message: "everything good" });
    })
    .then((res) => {
      if (token) {
        return res.send(token);
      }
    })
    .catch((err) => {
      return res.status(401).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.params;

  user
    .find()
    .then((res) => {
      return new res(req.params);
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

module.exports = { getUsers, createUser, getCurrentUser, login, updateUser };
