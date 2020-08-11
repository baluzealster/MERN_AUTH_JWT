const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  //validate userName
  if (validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

  //validate email
  if (validator.isEmpty(data.email)) {
    errors.email = " email field is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "please enter a valid email address";
  }

  //validate password
  if (validator.isEmpty(data.password)) {
    errors.password = "password field is must";
  }

  //validate password2
  if (validator.isEmpty(data.password2)) {
    errors.password2 = "password filed is must";
  }
  if (!validator.isLength(data.password, { min: 8, max: 12 })) {
    errors.password = "password should be in between 8 to 12 characters";
  }
  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "password shouldn't not be matched";
  }

  return { errors, isValid: isEmpty(errors) };
};
