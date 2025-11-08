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
    res.send({
      success: false,
      message: "Jobs data retrieved failed",
    });
  }
};

const postJob = async (req, res) => {
  res.send(req.body);
};

module.exports = { getAllJobs, postJob };
