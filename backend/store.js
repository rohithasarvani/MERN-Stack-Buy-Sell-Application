const express = require('express'); 
const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = "mongodb+srv://rohitha:rohitha@cluster0.rv2ga.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


const app = express();
const port = process.env.PORT || 3000;

async function connectToMongoDB() {
  try {
    
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas!");
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err);
  }
}


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Backend is connected and running!');
});


connectToMongoDB();


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


module.exports = client;
