const clothingItems = require("../models/clothingItems");
const {
  invalidDataError,
  dataNotFound,
  serverError,
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
    //.orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: err.message });
      }

      return res
        .status(dataNotFound)
        .send({ message: "the item doesn't exist" });
    });
};

module.exports = { getClothingItems, addClothingItems, deleteClothingItems };
