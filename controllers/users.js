const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/user");

const {
  invalidDataError, //  400
  unauthorizedError, // 401
  dataNotFound, // 404
  serverError, // 500
  conflictError, // 409
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// const getUsers = (req, res) => {
//   user
//     .find({})
//     .then((users) => res.status(200).send(users))
//     .catch(() =>
//       res
//         .status(serverError)
//         .send({ message: "An error has occured on the server" })
//     );
// };

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
    .then((makeUser) => {
      const userWithoutPassword = makeUser.toObject();
      delete userWithoutPassword.password;

      return res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(conflictError).send({ message: err.message });
      }
      return res
        .status(serverError)
        .send({ message: " an error has occured on the server" });
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

  if (!email || !password) {
    return res
      .status(invalidDataError)
      .send({ message: "email and password fields required" });
  }

  return user
    .findUserByCredentials(email, password)
    .then((userData) => {
      if (!userData) {
        return Promise.reject(new Error("incorrect email or password"));
      }
      const token = jwt.sign({ _id: userData._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).send({ message: "everything good", token });
    })
    .catch((err) => {
      if (err.message === "email or password is incorrect") {
        return res.status(unauthorizedError).send({ message: err.message });
      }

      return res.status(serverError).send({ message: err.message });
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
    .then((loggedUser) => res.status(200).send({ user: loggedUser }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: "invalid Data" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(dataNotFound).send({ message: err.message });
      }

      return res.status(serverError).send({ message: "server Error" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
