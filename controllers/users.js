const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const BadRequestError = require("../middlewares/Error-Handling");
const UnauthorizedError = require("../middlewares/Error-Handling");
const ForbiddenError = require("../middlewares/Error-Handling");
const NotFoundError = require("../middlewares/Error-Handling");
const ConflictError = require("../middlewares/Error-Handling");

const {
  invalidDataError, //  400
  unauthorizedError, // 401
  dataNotFound, // 404
  serverError, // 500
  conflictError, // 409
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next(new BadRequestError("email and password are required"));
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
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }
      if (err.code === 11000) {
        return next(new ConflictError("The id string is in an invalid format"));
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
        return next(new NotFoundError("could not find"));
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
        // return res.status(invalidDataError).send({ message: err.message });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occured on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("email and password fields are required"));
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
        return next(new BadRequestError("information entered is not valid"));
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
        return next(new UnauthorizedError("user is unauthorized"));
      }

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("not found"));
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
