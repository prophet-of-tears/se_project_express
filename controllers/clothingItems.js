const clothingItems = require("../models/clothingItems");
const BadRequestError = require("../Error-Handling/BadRequestError");
const ForbiddenError = require("../Error-Handling/ForbiddenError");
const NotFoundError = require("../Error-Handling/NotFoundError");
const ServerError = require("../Error-Handling/ServerError");

const getClothingItems = (req, res, next) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err));
};

const addClothingItems = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  clothingItems
    .create({ name, weather, imageUrl })
    .then((items) => {
      res.status(201).send({ data: items });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("you are not logged in"));
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

      // if (item.owner.toString() !== req.user._id.toString()) {
      //   return next(new ForbiddenError("current user not authorized"));
      // }

      return clothingItems
        .findByIdAndDelete(itemId)
        .then(() => res.status(200).send(item))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("the ID string is an invalid format"));
      }
      return next(err);
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
      return next(err);
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
      return next(err);
    });
};

module.exports = {
  getClothingItems,
  addClothingItems,
  deleteClothingItems,
  handleLike,
  handleDislike,
};
