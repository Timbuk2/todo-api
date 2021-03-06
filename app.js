require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");

const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const passport = require("passport");

// require authentication strategy
require("./config/passport");

mongoose.Promise = Promise;
mongoose
  .connect("mongodb://localhost/blah-the-to-do-list", { useMongoClient: true })
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
    // cookie: { httpOnly: false }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"]
  })
);

const index = require("./routes/index");
app.use("/", index);

const taskRoutes = require("./routes/tasks");
app.use("/api", taskRoutes);

const authroutes = require("./routes/authroutes");
app.use("/api", authroutes);

module.exports = app;
