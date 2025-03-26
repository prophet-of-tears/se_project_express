const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../Error-Handling/NotFoundError");

const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const { validateSignin, validateSignup } = require("../middlewares/validation");

router.post("/signin", validateSignin, login);
router.post("/signup", validateSignup, createUser);

router.use("/users", userRouter);

router.use("/items", clothingItems);

router.use((req, res, next) =>
  next(new NotFoundError("the page does not exist"))
);

module.exports = router;
