const express = require('express')

const cors=require('cors')

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port =process.env.PORT||5000
console.log(process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqnwo.mongodb.net/emajonSample?retryWrites=true&w=majority`;
const app = express()
app.use(cors())
app.use(express.json())




app.get('/', (req, res) => {
  res.send('Hello World!')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emajonSample").collection("emajon");
  const orders = client.db("emajonSample").collection("orders");

  app.post('/addProducts',(req,res)=>{
    products.insertMany(req.body)
    .then(result=>{
       res.send(result.insertContent)
    })

  })

  app.get('/products', (req,res)=>{
      products.find({})
      .toArray((err,documents)=>{
          res.send(documents)

      })

  })

  app.get('/product/:key', (req,res)=>{
    products.find({key:req.params.key})
    .toArray((err,documents)=>{
        res.send(documents[0])

    })

})

app.post('/productCart',(req,res)=>{
const productCart=req.body
  products.find({key:{$in : productCart}})
  .toArray((err,documents)=>{
    res.send(documents)

})
  
})



app.post('/orders',(req,res)=>{
  console.log(req.body)
  orders.insertOne(req.body)

  .then(result=>{
    res.send(result.insertContent)
 })
})
 
  
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})