const express = require("express");
const {
  getAllJobs,
  postJob,
  updateJobById,
  deleteJobById,
} = require("../controllers/jobController.js");

const jobRouter = express.Router();

jobRouter.get("/", getAllJobs);

jobRouter.post("/", postJob);

jobRouter.put("/:id", updateJobById);

jobRouter.delete("/:id", deleteJobById);

module.exports = jobRouter;
