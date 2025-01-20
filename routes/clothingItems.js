const router = require("express").Router();

const {
  getClothingItems,
  addClothingItems,
  deleteClothingItems,
} = require("../controllers/clothingItems");

// start with /items

router.get("/", getClothingItems);
router.post("/", addClothingItems);
router.delete("/:item_id", deleteClothingItems);

module.exports = router;
