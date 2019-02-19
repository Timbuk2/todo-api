const express = require("express");
const authRoutes = express.Router();

const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

authRoutes.post("/signup", (req, res, next) => {
  console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.json({ message: "Provide username and password" });
    return;
  }

  if (password.length < 7) {
    res.json({
      message: "Please make your password at least 7 characters"
    });
    return;
  }

  User.findOne({ username: username }, "_id", (err, foundUser) => {
    if (foundUser) {
      res.json({ message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser = new User({
      username: username,
      password: hashPass
    });

    theUser.save(err => {
      if (err) {
        res.json({ message: "Something went wrong saving user to Database" });
        return;
      }

      req.login(theUser, err => {
        if (err) {
          res.json({
            message: "Something went wrong with automatic login after signup"
          });
          return;
        }
        res.status(200).json(req.user);
      });
    });
  });
});

authRoutes.post("/login", (req, res, next) => {
  // Authenticate cookie here
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res.json({ message: "Something went wrong authenticating user" });
      return;
    }

    if (!theUser) {
      res.json({ message: "sorry, we coun't find that account" });
      return;
    }

    // log the user in.
    req.login(theUser, err => {
      if (err) {
        res.json({ message: "Something went wrong logging in" });
        return;
      }
      res.status(200).json(req.user);
    });
  })(req, res, next);
});

// logout- clear cookie from in memory session
authRoutes.post("/logout", (req, res, next) => {
  req.logout();
  res.json({ message: "Success" });
});

// i dont knoe what this is used for ?
authRoutes.get("/loggedin", (req, res, next) => {
  if (req.user) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

module.exports = authRoutes;
