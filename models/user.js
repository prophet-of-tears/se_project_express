const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    required: [true, "the avatar field is required"],
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: { type: String, required: true, select: false },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password).then((isMatched) => {
          if (isMatched) {
            return user;
          }
          return Promise.reject(new Error("email or password is incorrect"));
        });
      }
      return Promise.reject(new Error("email or password is incorrect"));
    });
};

module.exports = mongoose.model("User", userSchema);
