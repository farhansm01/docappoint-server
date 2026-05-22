const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// mongodb
const uri = process.env.DB_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

async function run() {
  try {
    await client.connect()

    const db = client.db("docappoint")
    const doctorsCollection = db.collection("doctors")


     // get all doctors
    app.get('/doctors', async (req, res) => {
      const result = await doctorsCollection.find().toArray()
      res.send(result)
    })

    // get top 3 rated doctors
    app.get('/doctors/top', async (req, res) => {
      const result = await doctorsCollection
        .find()
        .sort({ rating: -1 })
        .limit(3)
        .toArray()
      res.send(result)
    })

    // get single doctor
    app.get('/doctors/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await doctorsCollection.findOne(query)
      res.send(result)
    })


  } finally {
    // keep open
  }
}

run().catch(console.dir)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})