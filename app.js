var express        = require( 'express' );
var http           = require( 'http' );
var path           = require( 'path' );
var fs             = require('fs');

var bodyParser     = require( 'body-parser' );

var static         = require( 'serve-static' );
var mongoose       = require('mongoose');
var app    		   = express();
 var ent = require('ent');
var router 		   = express.Router();


//var Sequelize = require('sequelize');

/*sequelize = new Sequelize('vtmiage', 'root', 'root', {
  dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
  port:    3306, // or 5432 (for postgres)
});
// check database connection
sequelize
.authenticate()
.then(function(err) {
  console.log('Connection has been established successfully.');
}, function (err) {
  console.log('Unable to connect to the database:', err);
});


*/

//Permet de rendre les fichiers html
app.use(express.static(__dirname +  '/public'));
app.set( 'views',  __dirname + '/public/' );






//app.use( logger( 'dev' ));
app.set('json spaces', 4);
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended : true  }));


//Rendu de l'index.html
app.get('/', function(req, res) {
  res.render('index');
});



var server =  http.createServer( app ).listen(3000, function (){
    console.log( 'Express server listening on port 3000 ');
  });

  var io = require('socket.io')(server);
  io.on('connection', function(socket, pseudo) {

socket.on('nouveau_client', function(pseudo){
  socket.pseudo = pseudo;
  socket.pseudo = ent.encode(pseudo);
  socket.broadcast.emit('nouveau_client ', pseudo);

});


// Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
socket.on('message', function (message) {
    message = ent.encode(message);
    socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
});

  });
