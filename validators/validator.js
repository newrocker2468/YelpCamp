const { campgroundSchema, reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      console.log(msg);
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  const validateReview = (req, res, next) => {
  
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      console.log(msg);
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
  module.exports = {validateCampground, validateReview };