const clothingItems = require("../models/clothingItems");

const {
  invalidDataError, // 400
  dataNotFound, // 404
  serverError, // 500
} = require("../utils/errors.js");

const getClothingItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "referenceError") {
        res.status(invalidDataError).send({ message: err.message });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

const addClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  console.log(req);
  console.log(req.body);

  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((items) => {
      console.log(items);
      res.status(201).send({ data: items });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: err.message });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

const deleteClothingItems = (req, res) => {
  const { item_id } = req.params;
  clothingItems
    .findByIdAndDelete(item_id)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: err.message });
      }

      return res
        .status(dataNotFound)
        .send({ message: "the item doesn't exist" });
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
      console.error(err);
      console.log(_id);
      console.log(itemId);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(dataNotFound).send({ message: err.message });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

const handleDislike = (req, res) => {
  const { itemId } = req.params;
  const { _id } = req.user._id;

  clothingItems
    .findByIdAndUpdate(itemId, { $pull: { likes: _id } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      console.error(err.name);

      if (err.name === "CastError") {
        return res.status(invalidDataError).send({ message: "incorrect Id" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(dataNotFound).send({ message: err.message });
      }
      return res.status(serverError).send({ message: err.message });
    });
};

module.exports = {
  getClothingItems,
  addClothingItems,
  deleteClothingItems,
  handleLike,
  handleDislike,
};

// module.exports.likeItem = (req, res) =>
//   clothingItems.findByIdAndUpdate(
//     req.params.itemId,
//     { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
//     { new: true }
//   );
// //...

// module.exports.dislikeItem = (req, res) =>
//   clothingItems.findByIdAndUpdate(
//     req.params.itemId,
//     { $pull: { likes: req.user._id } }, // remove _id from the array
//     { new: true }
//   );
