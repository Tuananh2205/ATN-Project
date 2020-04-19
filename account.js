const express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';

var url='mongodb+srv://tuananh2205:tuananh159357@clustermongodb-edrni.mongodb.net/test?retryWrites=true&w=majority';

router.get('/', async(req,res)=>
{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Account").find({}).toArray();
    let count = await dbo.collection("Account").countDocuments();
    res.render('allAccount',{account:results, count:count});
})


router.post('', async (req,res)=>{

    let findAcc = req.body.username;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Account").find({"Username":findAcc}).toArray();
    res.render('allAccount',{account:results});

})


router.get('/update',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Account").findOne({"_id": ObjectID(id)});
    res.render('updateAccount',{account:results});

})

router.post('/update',async(req,res)=>{
    let id = req.body.id;
    let newname = req.body.username;
    let newpass = req.body.password;
    let newValues ={$set : {Username: newname, Password: newpass}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    await dbo.collection("Account").updateOne(condition,newValues);
 
    res.redirect('/account');
})

//
router.get('/delete',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Account").findOne({"_id": ObjectID(id)})
    res.render('deleteAccount',{account:results});
    
})

router.post('/delete', async(req,res)=>{
    let id = req.body.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    await dbo.collection("Account").deleteOne(condition);
    console.log("Delete 1 item from Account successful!");
    res.redirect('/account');
})

//Search account
router.post('/', async (req,res)=>{
    let searchAcc = req.body.username;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Account").find({"Username":searchAcc}).toArray();
    res.render('allAccount',{account:results});
  })
module.exports = router;

