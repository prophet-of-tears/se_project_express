const router = require("express").Router();
const { handleLike, handleDislike } = require("../controllers/clothingItems");

const {
  getClothingItems,
  addClothingItems,
  deleteClothingItems,
} = require("../controllers/clothingItems");

// start with /items

router.get("/", getClothingItems);
router.post("/", addClothingItems);
router.delete("/:item_id", deleteClothingItems);
router.put("/:itemId/likes", handleLike);
router.delete("/:itemId/likes", handleDislike);

module.exports = router;
