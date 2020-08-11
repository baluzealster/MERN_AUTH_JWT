const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.email)) {
    errors.name = "please enter the email address";
  } else if (!validator.isEmail(data.email)) {
    errors.name = "please enter a valid email address";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "please enter the password";
  }

  if (!validator.isLength(data.password, { min: 8, max: 12 })) {
    errors.password = "please enter the correct password";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
