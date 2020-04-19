const express = require('express')
var router = express.Router();
const bodyParser = require('body-parser')
const app = express()
fs = require('fs-extra')
app.use(bodyParser.urlencoded({ extended: true }))
var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';

var url='mongodb+srv://tuananh2205:tuananh159357@clustermongodb-edrni.mongodb.net/test?retryWrites=true&w=majority';
ObjectId = require('mongodb').ObjectId;

router.get('/',async(req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Product").find({}).toArray();
    res.render('homepage',{product:results});

})

router.get('/photos', async(req, res) => {
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    dbo.collection('Product').find().toArray((err, result) => {
  
      const imgArray = result.map(element => element._id);
      console.log(imgArray);
      if (err) return console.log(err)
      res.send(imgArray)
    })
  });

router.get('/photo/:id',async(req,res)=>{
    var filename = req.params.id;
    
      let client= await MongoClient.connect(url);
      let dbo = client.db("ATNStorage");
      dbo.collection('Product').findOne({'_id': ObjectId(filename) }, (err, result) => {
        if (err) return console.log(err)
        res.contentType('image/jpeg');
        res.send(result.Image.image.buffer);
      })
})

module.exports = router;