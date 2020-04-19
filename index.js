const express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url='mongodb+srv://tuananh2205:tuananh159357@clustermongodb-edrni.mongodb.net/test?retryWrites=true&w=majority';

router.get('/',(req,res)=>{
    res.render('index');
})


router.post('/login',async(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let results = await dbo.collection("Account").find({"Username":username, "Password":password}).toArray();
    if (results != 0)
    {
    res.redirect('/homepage');
    }
    else
    {
        res.redirect('/');
    }
})

router.get('/signup', (req,res)=>{
    res.render('signupAccount');
})
//account/insert -> post
router.post('/signup',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNStorage");
    let username = req.body.username;
    let password = req.body.password;
    let newAcc = {Username : username, Password : password};
    await dbo.collection("Account").insertOne(newAcc);
    console.log("Insert 1 account successful!");
    res.render('index');

})
module.exports = router;