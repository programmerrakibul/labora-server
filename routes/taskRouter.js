const express = require("express");
const { postTask } = require("../controllers/taskController.js");
const taskRouter = express.Router();

taskRouter.post("/", postTask);

module.exports = taskRouter;
