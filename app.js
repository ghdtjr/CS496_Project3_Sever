/* MAIN FILE OF THE SERVER */

const PORT = 80;

/* import packages */
var mongodb = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/* define models */
var Recipe = require('./models/recipe');
var Ingredients = require('./models/ingredients');
var Img = require('./models/img');


/* Create express service */
var app = express();

/* To extract the parameter from the POST request data's body */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


/* Variable for connection to mongodb */
var MongoClient = mongodb.MongoClient;
var mongo_url = 'mongodb://localhost:27017/project3';

/* Confure router model */
var router = require('./routes')(app, Recipe, Ingredients, Img)

/* Create WEB SERVER*/
var server = app.listen(PORT, function () {
    console.log("Express server has started on port 80")
});

/* Connect to the database using mongoose */
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});

mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongo_url, { useNewUrlParser: true });

