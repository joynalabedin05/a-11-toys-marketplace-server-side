const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.SECRET_NAME}:${process.env.SECRET_PASS}@cluster0.ssvrn1a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db('allToys').collection('toys');
    app.get('/alltoys', async(req,res)=>{
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    app.get('/toydetail/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.findOne(query);
      res.send(result) ;
      // console.log(id);
    });

    app.post('/bookings',async(req,res)=>{
      const booking  = req.body;
      // console.log(booking);
      const result = await toysCollection.insertOne(booking);
      res.send(result);
    });

    app.put('/alltoys/:id', async(req, res)=>{
      const id = req.params.id;
      const user = req.body;
      console.log(id,user);
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedUser = {
        $set:{
          name: user.name,
          available_quantity: user.available_quantity,
          price: user.price,
          description: user.description
        }
      }
      const result = await toysCollection.updateOne(filter, updatedUser,options);
      res.send(result);
    })

    app.delete('/bookings/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('toys is running');
});

app.listen(port, ()=>{
    console.log(`toys is running on port: ${port}`);
});