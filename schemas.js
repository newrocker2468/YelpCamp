const joi = require("joi");
const campgroundSchema = joi.object({
    tittle: joi.string().required(),
    location: joi.string().required(),
    image: joi.string().required(),
    price: joi.number().required().min(0),
    description: joi.string().required(),
  });
  module.exports.campgroundSchema = campgroundSchema;