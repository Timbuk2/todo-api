const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

passport.serializeUser((loggedInUser, cb) => {
  console.log("*******");
  console.log("serializeUser");
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    console.log("*******");
    console.log("deserializeUser");

    if (err) {
      cb(err);
      return;
    }

    cb(null, userDocument);
  });
});

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, foundUser) => {
      console.log("*******");
      console.log("checking passport credentials. . .");
      console.log("username. . .", username);
      console.log("password. . .", password);

      if (err) {
        next(err);
        return;
      }

      if (!foundUser) {
        console.log("incorrect username");
        next(null, false, { message: "Incorrect username" });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        console.log("incorrect password");
        next(null, false, { message: "Incorrect password" });
        return;
      }

      console.log("OK");

      next(null, foundUser);
    });
  })
);
