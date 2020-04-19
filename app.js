const express = require('express');  // su dung framework
const engines = require('consolidate'); // su dung consolidate for handlebar
const app = express();

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');


var indexController = require('./index.js');
var productController = require('./product.js');
var employeeController = require('./employee.js');
var homeController = require('./homepage.js');
var accountController = require('./account.js');

app.use('/',indexController);
app.use('/product', productController);
app.use('/employee',employeeController);
app.use('/homepage',homeController);
app.use('/account', accountController);

app.listen(process.env.PORT || 3000);