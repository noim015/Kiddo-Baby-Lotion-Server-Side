const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8s32d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("babyDB");
      const productCollection = database.collection("babyProducts");
      const orderCollection = database.collection("orderedProducts");
      const reviewCollection = database.collection("reviewProducts");

        //POST API ORDER

        app.post('/orders', async(req, res)=> {
          const newOrder = req.body;
          const result = await orderCollection.insertOne(newOrder);
                console.log('got new user',req.body);
                console.log('Placed new order',result);
                res.json(result);
        })
        //POST API REVIEW

        app.post('/reviews', async(req, res)=> {
          const newOrder = req.body;
          const review = await reviewCollection.insertOne(newOrder);
                console.log('got new user',req.body);
                console.log('added new review',review);
                res.json(review);
        })
        //POST API PRODUCT

        app.post('/products', async(req, res)=> {
          const newProduct = req.body;
          const result = await productCollection.insertOne(newProduct);
                console.log('got new product',req.body);
                console.log('added new product',result);
                res.json(result);
        })

         // GET API PRODUCT
         app.get('/products', async (req, res) => {
          const cursor = productCollection.find({});
          const users = await cursor.toArray();
          res.send(users);
      });
         // GET API ORDERS
         app.get('/orders', async (req, res) => {
          const cursor = orderCollection.find({});
          const orders = await cursor.toArray();
          res.send(orders);
      });
         // GET API REVIEWS
         app.get('/reviews', async (req, res) => {
          const cursor = reviewCollection.find({});
          const orders = await cursor.toArray();
          res.send(orders);
      });

      app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const user = await productCollection.findOne(query);
        // console.log('load user with id: ', id);
        res.send(user);
    });

    

  // DELETE API ORDER
  app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);

      console.log('deleting user with id ', result);

      res.json(result);
  })
  // DELETE API PRODUCTS
  app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);

      console.log('deleting user with id ', result);

      res.json(result);
  })

    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running my Kiddo Baby Lotion Server');
});

app.listen(port, ()=> {
    console.log('Running on port',port)
})