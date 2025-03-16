const clothingItems = require("../models/clothingItems");
const BadRequestError = require("../middlewares/Error-Handling");
const UnauthorizedError = require("../middlewares/Error-Handling");
const ForbiddenError = require("../middlewares/Error-Handling");
const NotFoundError = require("../middlewares/Error-Handling");
const ConflictError = require("../middlewares/Error-Handling");

const {
  invalidDataError, // 400
  accessDeniedError, // 403
  dataNotFound, // 404
  serverError, // 500
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(() =>
      res
        .status(serverError)
        .send({ message: "An error has occured on the server" })
    );
};

const addClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((items) => {
      res.status(201).send({ data: items });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new UnauthorzedError("you are not logged in"));
      }
      return res
        .status(serverError)
        .send({ message: "An error has occured on the server" });
    });
};

const deleteClothingItems = (req, res) => {
  const { itemId } = req.params;

  clothingItems
    .findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(dataNotFound)
          .send({ message: "The item doesn't exist" });
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(accessDeniedError)
          .send({ message: "Current user not authorized to perform action" });
      }

      return clothingItems
        .findByIdAndDelete(itemId)
        .then(() => res.status(200).send(item))
        .catch(() =>
          res
            .status(serverError)
            .send({ message: "An error occurred on the server" })
        );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("the ID string is an invalid format"));
      }
      return res
        .status(serverError)
        .send({ message: "An error occurred on the server" });
    });
};

const handleLike = (req, res) => {
  const { itemId } = req.params;
  const { _id } = req.user;
  clothingItems
    .findByIdAndUpdate(itemId, { $addToSet: { likes: _id } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("the ID string is an invalid format"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("unable to identify document"));
      }
      return res
        .status(serverError)
        .send({ message: "An error has occured on the server" });
    });
};

const handleDislike = (req, res) => {
  const { itemId } = req.params;
  const { _id } = req.user;

  clothingItems
    .findByIdAndUpdate(itemId, { $pull: { likes: _id } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("the ID string is an invalid format"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("not found"));
      }
      return res
        .status(serverError)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = {
  getClothingItems,
  addClothingItems,
  deleteClothingItems,
  handleLike,
  handleDislike,
};
