const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// importing the validator functions
const validateLoginInput = require("../../validation/login");
const validateRegisterInput = require("../../validation/register");

//requiring usermodel
const User = require("../../models/User");
const keys = require("../../config/keys");

// @route POST api/users/register
// @desc Register user
// @access Public
Router.post("/register", (req, res) => {
  //Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          return res
            .status(400)
            .json({ email: "email Already exists please login" });
        } else {
          let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          //hash the password before saving it in the database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => res.json(user))
                .catch((err) => console.log(err));
            });
          });
        }
      })
      .catch((err) => console.log(err));
  }
});

//@route GET api/user/login
//@desc Login user
//@access public
Router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by Email
  User.findOne({ email: email }).then((user) => {
    console.log(JSON.stringify(user));
    if (!user) {
      res.status(400).json({ emailNotFound: "Email not Found" });
    }

    //Check password
    bcrypt
      .compare(password, user.password)
      .then((isMatched) => {
        if (isMatched) {
          //UserMatched
          //Create JWT payload
          const payload = {
            id: user.id,
            name: user.name,
          };

          //Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 31556926 },
            (err, token) => {
              res.json({ success: true, token: "Bearer " + token });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordIncorrect: "Password incorrect" });
        }
      })
      .catch((err) => console.log(err));
  });
});

module.exports = Router;
