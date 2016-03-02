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
var rooms=["room1", "room2"];
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


app.get('/rooms', function(req, res) {
  res.send(rooms);
});

var server =  http.createServer( app ).listen(3000, function (){
    console.log( 'Express server listening on port 3000');
});

app.get('/Joueur/:pseudo', function(req, res){
	Joueur.findOne({pseudo: req.params.pseudo}).then(function(joueur){
    if (joueur === null)
      res.send('NOT FOUND');
    else 
      res.send(joueur.pseudo);
  });
});

app.post('/newJoueur', function (req, res){
  var pseudo = req.body.nomPseudo;
    console.log("POST: ");
  console.log("Pseudo: "+ pseudo );
  var find = '';
function IsFind(){
  if(find !== null){
	console.log("already exist !!");
	res.send('Failed');
  }
  else {
  joueur = new Joueur({
    pseudo: pseudo,
	highScore : 0,
	ghost : [],
  });

  joueur.save(function (err) {
    if (!err) {
		console.log("created");
      return "Succes";
	  //res.redirect('index.html');
    } else {
		//console.log("already exist !!");
      return "Failed";
	  console.log(err);
    }
  });
  res.send('Success');
}
}

  Joueur.findOne({pseudo: req.body.nomPseudo}, function(err, doc) {
	if (err) {
		find = err;
		return err;
	}
	else {
		find = doc;
		//console.log(find);
		IsFind();
	}
});
});

app.get('/highScore/:pseudo', function(req, res){
	Joueur.findOne({pseudo: req.params.pseudo}).then(function(joueur){
    if (joueur === null)
      res.send('NOT FOUND');
    else 
      res.send(joueur.highScore);
  });
});

app.put('/updateScore/:pseudo', function(req, res, next) {
  Joueur.findByIdAndUpdate(req.params.pseudo, req.body.highScore, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

var io = require('socket.io')(server);

// usernames which are currently connected to the chat
 defaultRoom = rooms[0];
var welcome = "Welcome in room :  ";
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
       

        socket.join(defaultRoom);
        var clientSize = io.sockets.adapter.rooms[defaultRoom].length;
        //put that in switchRoom in order to avoid there is 3 in room2 (0 actually)
       // io.in(defaultRoom).emit('updateroom',welcome, defaultRoom, clientSize);
       // io.in(rooms[1]).emit('updateroom', defaultRoom);
  
        console.log(clientSize);
        //io.sockets.clients(rooms[1]);
        // Create a new player and store his position too... for that
        // we have an object that is a "list of players" in that form
        // listOfPlayer = {'michel':{'x':0, 'y':0, 'v':0},
        //                          john:{'x':10, 'y':10, 'v':0}}
        // for this example we have x, y and v for speed... ?

        var player = {'x':35, 'y':35, 'v':2};

        listOfPlayers[username] = player;
        console.log("user created : "+username);
        io.sockets.emit('updatePlayers',listOfPlayers);
    });

//When a player switch a room
  socket.on('switchRoom', function(username,joiningRoom){

currentRoom = defaultRoom;
socket.leave(currentRoom);

console.log(username + " is  leaving currentRoom : " + currentRoom);

io.in(currentRoom).emit('switchRoom', username, joiningRoom)

console.log("Joining the room  " + joiningRoom);
console.log("Current room  : " + currentRoom);

socket.join(joiningRoom);
currentRoom = joiningRoom;

console.log("Current room after joiningRoom : " + currentRoom);
 var clientSize = io.sockets.adapter.rooms[currentRoom].length;
 console.log(clientSize + " People in the " + currentRoom );
 io.in(currentRoom).emit('updateroom',welcome, currentRoom, clientSize);
  });

    //when a player moves
    socket.on('sendpos', function (newPos, dir, moving) {  
        // we tell the client to execute 'updatepos' with 2 parameters  
        //console.log("recu sendPos : dir = "+dir);  
        socket.broadcast.emit('updatepos', socket.username, newPos, dir, moving);  
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
