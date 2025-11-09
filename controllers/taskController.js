const { tasksCollection } = require("../db.js");

const postTask = async (req, res) => {
  const newTask = req.body;

  try {
    const result = await tasksCollection.insertOne(newTask);

    res.send({
      success: true,
      message: "Task posted successfully",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Task post failed",
    });
  }
};

module.exports = { postTask };
