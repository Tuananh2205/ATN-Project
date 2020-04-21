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
    let phone = req.body.Ephone;
    let newEm = {Employee_Name : name, Employee_Age: age,Employee_Gender : gender, Employee_Phone:phone};
    await dbo.collection("Employee").insertOne(newEm);
    console.log("Insert successful!");
    
    res.redirect('/employee');

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
    let newphone = req.body.phone;
    let newValues ={$set : {Employee_Name: newname, Employee_Age: newage, Employee_Gender : newgender, Employee_Phone : newphone}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    await dbo.collection("Employee").updateOne(condition,newValues);
 
    res.redirect('/employee');
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
    let phone = req.body.phone;
    let delEm = {Employee_Name: name, Employee_Age: age, Employee_Gender : gender, Employee_Phone : phone};
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    await dbo.collection("Employee").deleteOne(delEm);
    console.log("Delete 1 employee successful!");
    res.redirect('/employee');
})
module.exports = router;