const router = require("express").Router();

const {
  getClothingItems,
  addClothingItems,
  deleteClothingItems,
  handleLike,
  handleDislike,
} = require("../controllers/clothingItems");

// start with /items

router.get("/", getClothingItems);
router.post("/", addClothingItems);
router.delete("/:itemId", deleteClothingItems);
router.put("/:itemId/likes", handleLike);
router.delete("/:itemId/likes", handleDislike);

module.exports = router;
