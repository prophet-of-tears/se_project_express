const router = require("express").Router();
const authorization = require("../middlewares/auth");

const {
  getClothingItems,
  addClothingItems,
  deleteClothingItems,
  handleLike,
  handleDislike,
} = require("../controllers/clothingItems");

// start with /items

router.get("/", getClothingItems);

router.use(authorization);

router.post("/", addClothingItems);
router.delete("/:itemId", deleteClothingItems);
router.put("/:itemId/likes", handleLike);
router.delete("/:itemId/likes", handleDislike);

module.exports = router;
