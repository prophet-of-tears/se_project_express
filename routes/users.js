const router = require("express").Router();
const { login, createUser, updateUser } = require("../controllers/users");
const authorization = require("../middlewares/auth");

router.use(authorization);

router.get("/protected-route", authorization);

router.patch("/me", updateUser);

module.exports = router;
