const router = require("express").Router();
const { updateUser, getCurrentUser } = require("../controllers/users");
const authorization = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

router.use(authorization);
router.get("/me", getCurrentUser);

router.patch("/me", validateUpdateUser, updateUser);

module.exports = router;
