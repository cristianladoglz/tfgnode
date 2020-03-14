'use strict'
var express = require('express');
var app = express();

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

//Para tener acceso a req.session
var expressSession = require('express-session');
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));

var crypto = require('crypto');

var mongo = require('mongodb');

var gestorBD = require("./modules/gestorBD.js");

app.use(express.static('public'));

// Variables
app.set('port', 8080);
app.set('db', 'mongodb+srv://uo257126:uo257126tfg@tfgbasket-ztapo.mongodb.net/test?retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);

app.use( function (err, req, res, next ) {
  console.log("Error producido: " + err); //we log the error in our db
  if (! res.headersSent) {
    res.status(400);
    res.send("Recurso no disponible");
  }
});

app.listen(app.get('port'), function(){
  console.log("Servidor activo en el puerto "+app.get('port'));
});
