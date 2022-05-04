const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.UESR_PASS}@cluster0.2au6f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const productCollection= client.db('cs').collection('product');

        app.post('/products',async(req,res)=>{
            const product=req.body;
            console.log(product);
            
            if(!product.name || !product.price){
                return res.send({sucess:false, error: 'please provide product all info'});
            }
            const result=await productCollection.insertOne(product);
            res.send({sucess:true, messege: `successful inserted ${product.name}`});
        })

        app.get('/products',async(req,res)=>{
            const limit=Number(req.query.limit);
            const pageNumber=Number(req.query.pageNumber);
            const query={}
            const cursor=productCollection.find(query)
            const products=await cursor.skip(pageNumber*limit).limit(limit).toArray();
            const count=await productCollection.estimatedDocumentCount();
            if(!products?.length){
                return res.send({success:false, error: 'product not found'})    
            }

            res.send({success: true, data: products, count});

        })


    }
    finally{

    }
}
        run().catch(console.dir)

        app.get('/', async (req, res) => {
            res.send('hello wordl');
        })

        app.listen(port, () => {
            console.log('succsfully run ', port);
        })


