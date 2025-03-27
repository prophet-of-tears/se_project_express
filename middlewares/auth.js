const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../Error-Handling/UnauthorizedError");

const authorizeUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("bearer");
    return next(new UnauthorizedError("authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);

    //  req.user = payload; // Set user info from the token payload
    //  Proceed to the next middleware or route handler
  } catch (err) {
    console.log("catch", err);
    return next(new UnauthorizedError("invalid token"));
  }

  req.user = payload;
  return next();
};

module.exports = authorizeUser;
