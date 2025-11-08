const express = require("express");
const {
  getAllJobs,
  postJob,
  updateJobById,
} = require("../controllers/jobController.js");

const jobRouter = express.Router();

jobRouter.get("/", getAllJobs);

jobRouter.post("/", postJob);

jobRouter.put("/:id", updateJobById);

module.exports = jobRouter;
