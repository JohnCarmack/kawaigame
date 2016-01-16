var express        = require( 'express' );
var http           = require( 'http' );
var path           = require( 'path' );
var fs             = require('fs');

var bodyParser     = require( 'body-parser' );

var logger         = require( 'morgan' );

var static         = require( 'serve-static' );
var mongoose       = require('mongoose');
var app    		   = express();

var router 		   = express.Router();
var nib            = require('nib');
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






app.use( logger( 'dev' ));
app.set('json spaces', 4);
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended : true  }));


//Rendu de l'index.html
app.get('/', function(req, res) {
  res.render('index');
});



  http.createServer( app ).listen(3000, function (){
    console.log( 'Express server listening on port 3000 ');
  });
