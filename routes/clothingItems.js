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
router.put("/:id/likes", handleLike);
router.delete("/:id/likes", handleDislike);

module.exports = router;
