const express = require("express");
const {
  getAllJobs,
  postJob,
  updateJobById,
  deleteJobById,
  getLatestJobs,
  getJobById,
} = require("../controllers/jobController.js");

const jobRouter = express.Router();

jobRouter.get("/latest", getLatestJobs);

jobRouter.get("/", getAllJobs);

jobRouter.post("/", postJob);

jobRouter.get("/:id", getJobById);

jobRouter.put("/:id", updateJobById);

jobRouter.delete("/:id", deleteJobById);

module.exports = jobRouter;
