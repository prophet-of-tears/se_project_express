const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
  expiresIn: "7d",
});

const JWT_SECRET = "secret key";

module.export = { JWT_SECRET };
