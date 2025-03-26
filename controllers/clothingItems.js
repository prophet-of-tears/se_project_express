const clothingItems = require("../models/clothingItems");
const BadRequestError = require("../Error-Handling/BadRequestError");
const UnauthorizedError = require("../Error-Handling/UnauthorizedError");
const ForbiddenError = require("../Error-Handling/ForbiddenError");
const NotFoundError = require("../Error-Handling/NotFoundError");
const ServerError = require("../Error-Handling/ServerError");

const getClothingItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(() =>
      res
        .status(ServerError)
        .send({ message: "An error has occured on the server" })
    );
};

const addClothingItems = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((items) => {
      res.status(201).send({ data: items });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new UnauthorizedError("you are not logged in"));
      }
      return next(new ServerError("something went wrong in the server"));
    });
};

const deleteClothingItems = (req, res, next) => {
  const { itemId } = req.params;

  clothingItems
    .findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("the item doesn't exist"));
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError("current user not authorized"));
      }

      return clothingItems
        .findByIdAndDelete(itemId)
        .then(() => res.status(200).send(item))
        .catch(() =>
          res
            .status(ServerError)
            .send({ message: "An error occurred on the server" })
        );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("the ID string is an invalid format"));
      }
      return res
        .status(ServerError)
        .send({ message: "An error occurred on the server" });
    });
};

const handleLike = (req, res, next) => {
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
        .status(ServerError)
        .send({ message: "An error has occured on the server" });
    });
};

const handleDislike = (req, res, next) => {
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
        .status(ServerError)
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
