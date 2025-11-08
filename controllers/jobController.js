const { ObjectId } = require("mongodb");
const { jobsCollection } = require("../db.js");

const getLatestJobs = async (req, res) => {
  const query = {};
  const sortedBy = { created_at: -1 };

  try {
    const result = await jobsCollection
      .find(query)
      .limit(6)
      .sort(sortedBy)
      .toArray();

    res.send({
      latest_jobs: result,
      success: true,
      message: "Latest jobs data retrieved successfully",
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Latest jobs data retrieved failed",
    });
  }
};

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
      message: "Job data post failed",
    });
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };

  try {
    const result = await jobsCollection.findOne(query);
    res.send({
      success: true,
      message: "Single job data retrieved successfully",
      single_job: result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Single job data retrieved failed",
    });
  }
};

const updateJobById = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };
  const updatedJob = req.body;
  const update = {
    $set: updatedJob,
  };

  try {
    const result = await jobsCollection.updateOne(query, update);

    res.send({
      success: true,
      message: "Job data updated successfully",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Job data update failed",
    });
  }
};

const deleteJobById = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };

  try {
    const result = await jobsCollection.deleteOne(query);

    res.send({
      success: true,
      message: "Job data deleted successfully",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Job data delete failed",
    });
  }
};

module.exports = {
  getLatestJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJobById,
  deleteJobById,
};
