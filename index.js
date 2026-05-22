const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("docappoint");
    const doctorsCollection = db.collection("doctors");
    const appointmentsCollection = db.collection("appointments");

    app.get("/doctors", async (req, res) => {
      const result = await doctorsCollection.find().toArray();
      res.send(result);
    });

    app.get("/doctors/top", async (req, res) => {
      const result = await doctorsCollection
        .find()
        .sort({ rating: -1 })
        .limit(3)
        .toArray();
      res.send(result);
    });

    app.get("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await doctorsCollection.findOne(query);
      res.send(result);
    });

    app.post("/appointments", async (req, res) => {
      const appointment = req.body;
      const result = await appointmentsCollection.insertOne(appointment);
      res.send(result);
    });

    app.get("/appointments", async (req, res) => {
      const email = req.query.email;
      const query = email ? { userEmail: email } : {};
      const result = await appointmentsCollection.find(query).toArray();
      res.send(result);
    });

    app.patch("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updated };
      const result = await appointmentsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await appointmentsCollection.deleteOne(query);
      res.send(result);
    });

  } finally {}
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});