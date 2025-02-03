const router = require("express").Router();
const { login, createUser, updateUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/me", updateUser);

module.exports = router;
