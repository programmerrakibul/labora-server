require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { client } = require("./db.js");
const jobRouter = require("./routes/jobRouter.js");
const taskRouter = require("./routes/taskRouter.js");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const run = async () => {
  try {
    await client.connect();

    app.get("/", (req, res) => {
      res.send("Server running");
    });

    app.use("/jobs", jobRouter);
    app.use("/added-tasks", taskRouter);

    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");

    app.listen(port, () => console.log("Server running in port: ", port));
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);
