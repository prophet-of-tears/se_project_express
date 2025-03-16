const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const { updateUser, createUser, login } = require("../controllers/users");
const { addClothingItems } = require("../controllers/clothingItems");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    // ...
  }),
});

router.post(
  "/items",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
    }),
  }),
  addClothingItems
);

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      avatar: Joi.String().required().custom(validateURL).messages({
        "string.empty": "the avatar field must be filled in",
        "string.uri": "the avatar field must be a valid url",
      }),
      email: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "email" field must be filled in',
        "string.uri": 'the "email" field must be a valid email',
      }),
      password: Joi.required(),
    }),
  }),
  createUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "email" field must be filled in',
        "string.uri": 'the "email" field must be a valid email',
      }),
      password: Joi.required(),
    }),
  }),
  login
);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      Id: Joi.value().min(24),
    }),
  }),
  updateUser
);
