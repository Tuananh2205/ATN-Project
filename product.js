const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer');
fs = require('fs-extra')
app.use(bodyParser.urlencoded({ extended: true }))
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectId;
//var url = 'mongodb://localhost:27017';

var url='mongodb+srv://tuananh2205:tuananh159357@clustermongodb-edrni.mongodb.net/test?retryWrites=true&w=majority';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

    var upload = multer({ storage: storage })  //storage(1) upload storagemulter thong qua bien nay
//product/... (ko go j) -> browser
router.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Product").find({}).toArray();
    let count = await dbo.collection("Product").countDocuments();
    res.render('allProduct',{product:results, count:count});
})

//product/add -> browser
router.get('/add', async(req,res)=>
{
    res.render('addProduct');
})

//product/add -> post
router.post('/add', upload.single('picture'), async(req,res)=>
{
    let name = req.body.Pname;
    let color = req.body.Pcolor;
    let price = req.body.Pprice;
    let status = req.body.Pstatus;
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    var finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_image, 'base64')
    };

    let newProduct= {Name: name, Color: color, Price: price,Status: status, Image:finalImg};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    dbo.collection("Product").insertOne(newProduct);

    res.redirect('/product');
})


//
//
//
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
    /////
    router.get('/photo/:id', async(req, res) => {
      var filename = req.params.id;
    
      let client= await MongoClient.connect(url);
      let dbo = client.db("ATNStorage");
      dbo.collection('Product').findOne({'_id': ObjectId(filename) }, (err, result) => {
        if (err) return console.log(err)
        res.contentType('image/jpeg');
        res.send(result.Image.image.buffer);
      })
  })
///--------------------------------------------------------------------
//Search product
router.post('/', async (req,res)=>{
  let searchItem = req.body.Pname;
  let client= await MongoClient.connect(url);
  let dbo = client.db("ATNStorage");
  let results = await dbo.collection("Product").find({"Name":searchItem}).toArray();
  res.render('allProduct',{product:results});
})
//get SP trong database to Update view
router.get('/update',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Product").findOne({"_id": ObjectID(id)})
    res.render('updateProduct',{product:results});

})
//update SP
router.post('/update',upload.single('picture'),async(req,res)=>{
    let id = req.body.id;
    let name = req.body.Pname;
    let color = req.body.Pcolor;
    let price = req.body.Pprice;
    let status = req.body.Pstatus;
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    var finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_image, 'base64')
    };
    let newValues ={$set : {Name: name, Color: color, Price : price, Status : status, Image : finalImg}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    await dbo.collection("Product").updateOne(condition,newValues);
 
    res.redirect('/product');
})

//get SP trong database to Delete view
router.get('/delete',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Product").findOne({"_id": ObjectID(id)})
    res.render('deleteProduct',{product:results});
    
})
//delete sanpham
router.post('/delete',upload.single('picture'), async(req,res)=>{
    let id = req.body.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    await dbo.collection("Product").deleteOne(condition);
    console.log("Delete 1 item from Product successful!");
    res.redirect('/product');
})
module.exports = router;