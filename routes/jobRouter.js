const express = require("express");
const {
  getAllJobs,
  postJob,
  updateJobById,
  deleteJobById,
  getLatestJobs,
  getJobById,
  getUserJobs,
} = require("../controllers/jobController.js");
const validateTokenId = require("../middlewares/validateTokenId.js");
const verifyTokenId = require("../middlewares/verifyTokenId.js");

const jobRouter = express.Router();

jobRouter.get("/latest", getLatestJobs);

jobRouter.get("/", getAllJobs);

jobRouter.get("/user", validateTokenId, verifyTokenId, getUserJobs);

jobRouter.post("/", validateTokenId, verifyTokenId, postJob);

jobRouter.get("/:id", validateTokenId, verifyTokenId, getJobById);

jobRouter.put("/:id", validateTokenId, verifyTokenId, updateJobById);

jobRouter.delete("/:id", validateTokenId, verifyTokenId, deleteJobById);

module.exports = jobRouter;
