const express = require("express");
const { postTask, getUserTasks } = require("../controllers/taskController.js");
const taskRouter = express.Router();

taskRouter.post("/", postTask);

taskRouter.get("/user", getUserTasks);

module.exports = taskRouter;
