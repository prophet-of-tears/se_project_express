const router = require("express").Router();
const { dataNotFound } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

const userRouter = require("./users");
const clothingItems = require("./clothingItems");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", userRouter);

router.use("/items", clothingItems);

router.use((req, res) =>
  res.status(dataNotFound).send({ message: "the page does not exist" })
);

module.exports = router;
