'use strict'
var express = require('express');
var app = express();

//Para tener acceso a req.session
var expressSession = require('express-session');
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));

var crypto = require('crypto');

var mongo = require('mongodb');

var swig  = require('swig');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Database
var DBManager = require("./modules/DBManager.js");
DBManager.init(app,mongo);

//Validator
var validationManager = require("./modules/validationManager.js");
validationManager.init(app,DBManager);

app.use(express.static('public'));

// Variables
app.set('port', 8080);
app.set('db', 'mongodb://uo257126:uo257126tfg@tfgbasket-shard-00-00-ztapo.mongodb.net:27017,tfgbasket-shard-00-01-ztapo.mongodb.net:27017,tfgbasket-shard-00-02-ztapo.mongodb.net:27017/test?ssl=true&replicaSet=tfgbasket-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);

app.use( function (err, req, res, next ) {
  console.log("Error producido: " + err);
  if (! res.headersSent) {
    res.status(400);
    res.send("Recurso no disponible");
  }
});

require("./routes/rusers.js")(app, swig, DBManager, validationManager);

app.listen(app.get('port'), function(){
  console.log("Servidor activo en el puerto "+app.get('port'));
});