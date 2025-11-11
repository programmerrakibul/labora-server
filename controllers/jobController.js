const { ObjectId } = require("mongodb");
const { jobsCollection } = require("../db.js");

const getJobs = async (req, res) => {
  const query = {};
  const sortObj = {};
  let projectField = {};
  const { sortBy, sortOrder, limit, fields, excludes } = req.query;
  const limitNum = Number(limit) || 0;
  const sortField = sortBy || "posted_by";
  const order = sortOrder === ("desc" || "-1") ? -1 : 1;
  sortObj[sortField] = order;

  if (fields) {
    const fieldsArray = fields.split(",");
    fieldsArray.forEach((field) => {
      projectField[field.trim()] = 1;
    });
  }

  if (excludes) {
    const excludesArray = excludes.split(",");
    excludesArray.forEach((field) => {
      projectField[field.trim()] = 0;
    });
  }

  if (Object.keys(projectField).length === 0) {
    projectField = null;
  }

  try {
    const result = await jobsCollection
      .find(query)
      .sort(sortObj)
      .limit(limitNum)
      .project(projectField)
      .toArray();

    res.send({
      jobs: result,
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

const getUserJobs = async (req, res) => {
  const query = {};
  const userEmail = req.query.email;

  if (userEmail !== req.token_email) {
    res.status(403).send({ message: "Forbidden Access" });
    return;
  }

  if (userEmail) {
    query.creator_email = userEmail;
  }

  try {
    const result = await jobsCollection.find(query).toArray();

    res.send({
      success: true,
      message: "User jobs data successfully retrieved",
      user_jobs: result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "User jobs data retrieved failed",
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
  getJobs,
  getUserJobs,
  getJobById,
  postJob,
  updateJobById,
  deleteJobById,
};
