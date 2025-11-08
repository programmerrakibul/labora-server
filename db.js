const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("labora-db");
const jobsCollection = database.collection("all_jobs");
const tasksCollection = database.collection("all_tasks");

module.exports = { client, jobsCollection, tasksCollection };
