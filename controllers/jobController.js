const { jobsCollection } = require("../db.js");

const getAllJobs = async (req, res) => {
  const query = {};
  try {
    const result = await jobsCollection.find(query).toArray();
    res.send({
      all_jobs: result,
      success: true,
      message: "All jobs data retrieved successfully",
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Jobs data retrieved failed",
    });
  }
};

const postJob = async (req, res) => {
  const newJob = req.body;
  try {
    const result = await jobsCollection.insertOne(newJob);
    res.send({
      ...result,
      success: true,
      message: "Job data posted successfully",
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Job post failed",
    });
  }
};

module.exports = { getAllJobs, postJob };
