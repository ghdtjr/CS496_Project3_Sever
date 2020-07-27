/* MAIN FILE OF THE SERVER */

const PORT = 80;

/* import packages */
var mongodb = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

/* define models */
var Recipe_Text = require('./models/recipe_text.js');
var Recipe_Img = require('./models/recipe_img.js');
var Recipe_Timer = require('./models/recipe_timer.js');
var Ingredients = require('./models/ingredients');
var Img = require('./models/img');

/* Create express service */
var app = express();

/* To extract the parameter from the POST request data's body */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true, parameterLimit: 1000000 }));

//cors
app.use(cors({
    origin: 'http://localhost:3000',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    // maxAge: 5,
    // credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'application/json', 'X-Requested-With', 'Origin'],
}));

/* for render html file */
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

/* Variable for connection to mongodb */
var MongoClient = mongodb.MongoClient;
var mongo_url = 'mongodb://localhost:27017/project3';

/* Confure router model */
var router = require('./routes')(app, Recipe_Text, Recipe_Img, Recipe_Timer, Ingredients, Img)

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

