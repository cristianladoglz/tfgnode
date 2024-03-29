'use strict'
var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// router user session
var routerUserSession = express.Router();
routerUserSession.use(function(req, res, next) {
  if ( req.session.user ) {
      next();
  } else {
      res.redirect("/inicioSesion");
  }
});
app.use("/match/*", routerUserSession);
app.use("/team/*", routerUserSession);
app.use("/coach/*", routerUserSession);
app.use("/player/*", routerUserSession);

//Database
var DBManager = require("./modules/DBManager.js");
DBManager.init(app,mongo);

//Validators
var userValidationManager = require("./modules/userValidationManager.js");
userValidationManager.init(app,DBManager);

var teamValidationManager = require("./modules/teamValidationManager.js");
teamValidationManager.init(app,DBManager);

var matchValidationManager = require("./modules/matchValidationManager.js");
matchValidationManager.init(app,DBManager);

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

require("./routes/rhome.js")(app, swig, DBManager);
require("./routes/rusers.js")(app, swig, DBManager, userValidationManager);
require("./routes/rteams.js")(app, swig, DBManager, teamValidationManager);
require("./routes/rmatches.js")(app, swig, DBManager, matchValidationManager);
require("./routes/rapirest.js")(app, swig, DBManager, io);

require("./routes/test/fillDB.js")(app, swig, DBManager);

http.listen(app.get('port'), function(){
  console.log("Servidor activo en el puerto "+app.get('port'));
});

module.exports = {
  app,
  mongo
};