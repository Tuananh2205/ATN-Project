const express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';

var url='mongodb+srv://tuananh2205:tuananh159357@clustermongodb-edrni.mongodb.net/test?retryWrites=true&w=majority';
//employee/... (ko go j) -> browser
router.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Employee").find({}).toArray();
    let count = await dbo.collection("Employee").countDocuments();
    res.render('allEmployee',{employee:results, count:count});
})

//employee/insert -> browser
router.get('/add', (req,res)=>{
    res.render('addEmployee');
})
//employee/insert -> post
router.post('/add',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let name = req.body.Ename;
    let age = req.body.Eage;
    let gender = req.body.Egender;
    let newEm = {Employee_Name : name, Employee_Age: age,Employee_Gender : gender};
    await dbo.collection("Employee").insertOne(newEm);
    console.log("Insert successful!");
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee',{employee:results});

})

//employee/search -> post
router.post('', async (req,res)=>{

    let searchEm = req.body.Ename;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Employee").find({"Employee_Name":searchEm}).toArray();
    res.render('allEmployee',{employee:results});

})

//get employee trong database to Update view
router.get('/update',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Employee").findOne({"_id": ObjectID(id)})
    res.render('updateEmployee',{employee:results});

})
//update employee
router.post('/update',async(req,res)=>{
    let id = req.body.id;
    let newname = req.body.name;
    let newage = req.body.age;
    let newgender = req.body.gender;
    let newValues ={$set : {Employee_Name: newname, Employee_Age: newage, Employee_Gender : newgender}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    await dbo.collection("Employee").updateOne(condition,newValues);
 
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee',{employee:results});
})

//get employee trong database to Delete view
router.get('/delete',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Employee").findOne({"_id": ObjectID(id)})
    res.render('deleteEmployee',{employee:results});
    
})
//delete employee
router.post('/delete', async(req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let delEm = {Employee_Name: name, Employee_Age: age, Employee_Gender : gender};
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    await dbo.collection("Employee").deleteOne(delEm);
    console.log("Delete successful!");
    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee',{employee:results});
})
module.exports = router;