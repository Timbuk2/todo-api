const express = require("express");
const router = express.Router();
const Task = require("../models/task");

router.get("/tasks", (req, res, next) => {
  console.log("\n\n*******");
  console.log("/tasks");
  Task.find()
    .sort({ createdAt: -1 })
    .then(allTheTasks => {
      console.log("returning all tasks. . .");
      console.log("allTheTasks", allTheTasks);
      res.json(allTheTasks);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/tasks/create", (req, res, next) => {
  // console.log(" \n\n********");
  // console.log(" /tasks/create", req.user);
  // console.log("REQ SESSION >> ", req.user);
  // console.log("REQ SESSION >> ", req.isAuthenticated());
  // console.log("req.body.", req.body);

  Task.create({
    title: req.body.title,
    description: req.body.description,
    owner: req.user._id
  })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/tasks/edit/:id", (req, res, next) => {
  console.log("\n\n*******");
  console.log("EDIT TASK");
  console.log("PAYLOAD", req.body);

  Task.findByIdAndUpdate(req.params.id, req.body)
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/tasks/delete/:id", (req, res, next) => {
  console.log("\n\n*******");
  console.log("/tasks/delete/:id");
  console.log("DELETING");
  console.log("\n\n/tasks/edit/:id", req.params.id);
  console.log("req.params.id", req.params.id);
  Task.findByIdAndRemove(req.params.id)
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
