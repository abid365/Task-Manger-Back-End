const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Node Is Running At ${port}`);
});

// mongodb
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.sonex9g.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Send a ping to confirm a successful connection
    await client.connect();

    const dbName = "taskManagerApp";

    // collection: todo_pending
    const todoCollectionPending = client.db(dbName).collection("todo_pending");

    // collection: todo_finidhed
    const todoCollectionFinsihed = client
      .db(dbName)
      .collection("todo_finished");

    // collection: todo_cancelled
    const todoCollectionCancelled = client
      .db(dbName)
      .collection("todo_cancelled");

    // collection: trash_bin
    const trashBinCollection = client.db(dbName).collection("trash_bin");

    // post pending todos
    app.post("/pending", async (req, res) => {
      const pending_todos = req.body;
      const result = await todoCollectionPending.insertOne(pending_todos);
      res.send(result);
    });

    //get pending todos
    app.get("/pending", async (req, res) => {
      const result = await todoCollectionPending.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Node Engine Running`);
});
