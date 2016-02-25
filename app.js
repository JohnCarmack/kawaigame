// mongoose setup
require( './db' );
var express        = require( 'express' );
var http           = require( 'http' );
var path           = require( 'path' );
var fs             = require('fs');

var bodyParser     = require( 'body-parser' );

var static         = require( 'serve-static' );
var mongoose       = require('mongoose');
var app          = express();
 var ent = require('ent');
var router       = express.Router();

// usernames which are currently connected to the chat
var usernames = {};

var listOfPlayers = {};
var Joueur = mongoose.model('Joueur','joueur');

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
    console.log( 'Express server listening');
});

app.post('/newJoueur', function (req, res){
  var pseudo = req.body.nomPseudo;
    console.log("POST: ");
  console.log("Pseudo: "+req.body.nomPseudo );// + "\nDiagramme:" + JSON.stringify(req.body.diagramme["cells"]));
  //Here we miss the diagram.cells part no ? yes but that's not required?
  /*if(User.findOne({mail : userMail, password : userPass})){
    console.log("already exist !!");

  }
  else {*/
  joueur = new Joueur({
    pseudo: req.body.nomPseudo,
	highScore : 0,
	ghost : [],
    //diagramme: req.body.diagramme["cells"]
  });

  joueur.save(function (err) {
    if (!err) {
      return console.log("created");
      res.redirect('index.html');
    } else {
      return console.log(err);
    }
  });
  return res.redirect('index.html');
//}
});

var io = require('socket.io')(server);

// usernames which are currently connected to the chat
var usernames = {};
var listOfPlayers = {};
var rooms=["room1", "room2"];
var welcome = "Bienvenue dans la ";
console.log(rooms);
io.sockets.on('connection', function (socket) {

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        console.log("dans le sendchat")
        console.log(data);
        io.sockets.emit('updatechat', socket.username, data);
    });

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
        // we store the username in the socket session for this client
        // the 'socket' variable is unique for each client connected,
        // so we can use it as a sort of HTTP session
        socket.username = username;
        // add the client's username to the global list
        // similar to usernames.michel = 'michel', usernames.toto = 'toto'
        usernames[username] = username;
        // echo to the current client that he is connecter
        socket.emit('updatechat', 'SERVER', 'you have connected');
        // echo to all client except current, that a new person has connected
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        // tell all clients to update the list of users on the GUI
        io.sockets.emit('updateusers', usernames);
        defaultRoom = rooms[0];

        socket.join(defaultRoom);

        io.in(defaultRoom).emit('updateroom',welcome, defaultRoom);
        io.in(rooms[1]).emit('updateroom', rooms[1]);
        // Create a new player and store his position too... for that
        // we have an object that is a "list of players" in that form
        // listOfPlayer = {'michel':{'x':0, 'y':0, 'v':0},
        //                          john:{'x':10, 'y':10, 'v':0}}
        // for this example we have x, y and v for speed... ?
        var player = {'x':0, 'y':0, 'v':4};
        listOfPlayers[username] = player;
        console.log("user created : "+username);
        io.sockets.emit('updatePlayers',listOfPlayers);
    });



    //when a player moves

    socket.on('sendpos', function (newPos, dir) {  
        // we tell the client to execute 'updatepos' with 2 parameters  
        //console.log("recu sendPos : dir = "+dir);  
        socket.broadcast.emit('updatepos', socket.username, newPos, dir);  
    });  
  
    // when the user disconnects.. perform this  
    socket.on('disconnect', function(){  
        // remove the username from global usernames list  
        delete usernames[socket.username];  
                // update list of users in chat, client-side  
        io.sockets.emit('updateusers', usernames);  
  
        // Remove the player too  
        delete listOfPlayers[socket.username];        
        io.sockets.emit('updatePlayers',listOfPlayers);  
          
        // echo globally that this client has left  
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');  
    }); 

    // when the game starts
    socket.on('sendStartGame', function (lvl) {
        // we tell the client to execute 'updatechat' with 2 parameters
        console.log("on commence le jeu")
        io.sockets.emit('startGame', lvl, listOfPlayers);
    });
});
