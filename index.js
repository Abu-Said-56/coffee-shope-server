const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;

// MiddleWire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD_KEY}@cluster0.szzkw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    // Using get operation for read data
    app.get('/coffee',async(req,res)=>{
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // use get opereation for Update element
    app.get('/coffee/:id',async(req,res)=> {
        const id = req.params.id;
        const quary = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(quary);
        res.send(result);
    })


    // Using post operation for create element to server side
    app.post('/coffee', async(req,res)=>{
        const newCoffee  = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
    })
     
    // Update coffee using put operation
    app.put('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedCoffee = req.body;

        const Coffee = {
            $set: {
                name : updatedCoffee.name,
                chief : updatedCoffee.chief,
                supplier : updatedCoffee.supplier,
                test : updatedCoffee.test,
                categori : updatedCoffee.categori,
                photo : updatedCoffee.photo,
            }
        }
        const result = await coffeeCollection.updateOne(filter,Coffee,options); 
        res.send(result);
    })


    // delete operations for delete an item
    app.delete('/coffee/:id',async(req,res) => {
        const id = req.params.id;
        const quary = {_id: new ObjectId(id) }
        const result = await coffeeCollection.deleteOne(quary);
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
    res.send("Coffee Shope Server is Running");
})


app.listen(port,()=>{
    console.log(`Coffee server in open on port ${port}`)
})
