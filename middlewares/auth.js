const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, "your-secret-key");
    req.user = payload; // Set user info from the token payload
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = authorization;
