const express = require("express");
const { getAllJobs, postJob } = require("../controllers/jobController.js");

const jobRouter = express.Router();

jobRouter.get("/", getAllJobs);

jobRouter.post("/", postJob);

module.exports = jobRouter;
