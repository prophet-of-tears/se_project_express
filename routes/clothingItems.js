const router = require("express").Router();
const authorization = require("../middlewares/auth");
const { validateId } = require("../middlewares/validation");
const { validateClothingItems } = require("../middlewares/validation");

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

router.post("/", validateClothingItems, addClothingItems);

router.delete("/:itemId", validateId, deleteClothingItems);
router.put("/:itemId/likes", validateId, handleLike);
router.delete("/:itemId/likes", validateId, handleDislike);

module.exports = router;
