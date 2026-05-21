const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb')

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
    // ping to confirm connection
    await client.db("admin").command({ ping: 1 })
    console.log("Pinged! Successfully connected to MongoDB!")

    app.get('/', (req, res) => {
      res.send('DocAppoint server is running')
    })

  } finally {
    // keep open
  }
}

run().catch(console.dir)