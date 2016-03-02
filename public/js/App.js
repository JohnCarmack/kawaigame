// variables relatives au canvas
var canvas, w, h;
//variable d'affichage, -1 ==> menu de pause, 1 ==> menu de départ, 2 ==> infos, 3 ==> scores, 0 ==> pas de menu (jeu en cours)
//var displayMenu=1;
//espace (y) entre les différents menu 
var spaceBetweenMenus;
var spaceBetweenPauseMenu;
// variable permettant de disable le click de souris pendant un certain temps
var cooldown=true;
// "taille" des différents menus
// menu start
var startLength, infosLength, scoresLength, policeSize;


var allPlayersStates = {};
var allPlayers={};
//position du joueur
var pos;
//direction envoyée sous forme de string
var direct;
//pseudo du joueur
var username;
var j;
var level=0;

var delta, oldTime = 0;

var nbImages =0;
var nbFramesOfAnimationBetweenRedraws = 0;

var DIR_S=  1;
var DIR_W=  2;
var DIR_N = 0;
var DIR_E = 3;
var NB_DIRECTIONS = 4;
var NB_FRAMES_PER_POSTURE = 3;

var etoile = new Image();
etoile.src = "images/etoile.png";

var MapLevel1;

//menu de pause
var homeLength, resumeLength;
//position des élements du menu
var homeX, homeY, resumeX, resumeY;
//police du menu de pause 
var pausePoliceSize;
//états des différents les listeners
var inputStates = {};
var dir = {};
//etat du jeu 
var currentGameState;
var gameStates = {
	home: 0,
    running: 1,
    over: 2,
    pause: 3,
    homeScores: 4,
    homeInfos: 5
};

var timer = function(currentTime) {
	var delta = currentTime - oldTime;
	oldTime = currentTime;
	return delta;
};

function App() {

    //console.log("Constructeur principal");
    // recupérer le canvas et son contexte
    canvas = document.querySelector("#canvas");
    context = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;
    spaceBetweenMenus = h/5;
    //ajout listeners 
    addKeyListeners();

    //joueur test


	MapLevel1 = new Map(6 , context);
	
    //ajout des actions pour chaque menu
    startGame(3, allPlayers);

	recupereMap(MapLevel1);

    currentGameState = gameStates.home;
    //set le cooldown ࠴00ms (un clic tous les 400ms sera pris en compte)
    setInterval(setCooldown,400); 
	
}

var mainLoop = function(time)
{
	//console.log(cooldown);
	delta = timer(time);
	clearCanvas();
	//console.log("k");
	//console.log(displayMenu);
	keyFunctions();
	drawCurrentMenu();
	addMenuClicks(); 
	//console.log(inputStates.mousePos);
	requestAnimationFrame(mainLoop);
}

function setCooldown(){
  cooldown=true;
}

function clearCanvas() {
  context.clearRect(0, 0, w, h);
}

function keyFunctions(){
	if(inputStates.esc)
	{
		//console.log("displayMenu = "+displayMenu);
		if(currentGameState == gameStates.running)
		{
			//console.log("dans le jeu, on print donc le menu de pause");
			currentGameState = gameStates.pause;
		}
		else if(currentGameState!=gameStates.pause)
		{
			currentGameState = gameStates.home;
		}
	}
}

function drawCurrentMenu(){
	
	context.save();
	context.restore();
	//menu de d걡rt
	if(currentGameState == gameStates.pause)
	{
		context.save();
		//context.fillStyle= "rgba(0, 0, 0, 100)";
		context.strokeStyle="#FFFFFF";
		context.strokeRect(h/2.8, w/4, w/2.5, h/3);
		context.textBaseline = 'middle';
	  	context.textAlign = "center";
	  	pausePoliceSize = 20;
		context.font = pausePoliceSize+'pt Calibri';
		context.fillStyle = 'white';
		var homeText = "HOME";
		homeLength = context.measureText(homeText).width;
		homeX = h/2.8+((w/2.5)/2);
		homeY = w/4+((h/3)/2)-h/10;
		context.fillText(homeText, homeX, homeY);
		var resumeText = "RESUME";
		resumeLength = context.measureText(resumeText).width;
		resumeX = h/2.8+((w/2.5)/2);
		resumeY = w/4+((h/3)/2)+h/10;
		context.fillText(resumeText,resumeX,resumeY);
		context.restore();
	}

	if(currentGameState == gameStates.home)
	{
		//console.log("drawing menu 1");
		context.textBaseline = 'middle';
	  	context.textAlign = "center";
		context.font = '40pt Calibri';
		policeSize = 40;
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center'; 
		    //menu start
		var startText = "START";
	    startLength = context.measureText(startText).width;
		context.fillText(startText, w/2, spaceBetweenMenus);
			//menu infos
		var infosText = "INFOS";
		infosLength = context.measureText(infosText).width;
		context.fillText(infosText, w/2, spaceBetweenMenus*2);
			//menu scores
		var scoresText = "SCORES";
	    scoresLength = context.measureText(scoresText).width;
		context.fillText(scoresText, w/2, spaceBetweenMenus*3);
	}

	if(currentGameState == gameStates.running) // pas de menu
	{
		/*
	  	context.textAlign = "center";
		context.font = '40pt Calibri';
		policeSize = 40;
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center'; 
		context.fillText("Vous avez cliqué sur start !!", w/2, spaceBetweenMenus*2);
		*/
		movePlayer(allPlayers[username], delta);
		dessineMap(MapLevel1, context);
		drawAllPlayers();
		for( name in allPlayers){
			MonsterCollisionWithWalls(allPlayers[name], h, w);
		}
		drawAllPlayers();

	}

	if(currentGameState == gameStates.homeInfos) // menu d'infos
	{
		context.textBaseline = 'middle';
	  	context.textAlign = "center";
		context.font = '40pt Calibri';
		policeSize = 40;
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center'; 
		context.fillText("Vous avez cliqué sur infos !!", w/2, spaceBetweenMenus*2);
		
	}

	if(currentGameState == gameStates.homeScores) // menu de scores
	{
		context.textBaseline = 'middle';
	  	context.textAlign = "center";
		context.font = '40pt Calibri';
		policeSize = 30;
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center'; 
		context.fillText("Meilleurs scores", w/2, spaceBetweenMenus+50);
		//context.fillText("Score:", w/2, spaceBetweenMenus + 100);
		var t = 120;
		for( name in allPlayers){
			context.save();
			drawHighScore(allPlayers[name],context, t);
			t += 50;
			context.restore();
		}
		context.drawImage(etoile, w/4+25, 0);
	}
}

function getMousePos(evt) {
  // necessary to take into account CSS boudaries
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function addKeyListeners() {
  //add the listener to the main, window object, and update the states  
  window.addEventListener('keydown', function(event) {
  	if(event.keyCode === 27){
  		inputStates.esc = true;
  	}
    if (event.keyCode === 37){
      inputStates.left = true;
      allPlayers[username].moving = true;
      allPlayers[username].dir=DIR_W;
      //movePlayer(allPlayers[username], delta);
      //console.log("left");
  	}
    if (event.keyCode === 38){
      inputStates.up = true;
      allPlayers[username].moving = true;
      allPlayers[username].dir=DIR_N;
      //movePlayer(allPlayers[username], delta);
      //console.log("down");
  	}
    if (event.keyCode === 39){
        inputStates.right = true;
        allPlayers[username].moving = true;
        allPlayers[username].dir=DIR_E;
        //movePlayer(allPlayers[username], delta);
        //console.log("right");
    }
    if (event.keyCode === 40){
      inputStates.down = true;
      allPlayers[username].moving = true;
      allPlayers[username].dir=DIR_S;
      //movePlayer(allPlayers[username], delta);
  	}
	
    if (event.keyCode === 32)
      inputStates.space = true;
  }, false);

  //if the key will be released, change the states object   
  window.addEventListener('keyup', function(event) {
  	if(event.keyCode === 27){
  		inputStates.esc = false;
  		allPlayers[username].moving = false;
  		//stopPlayer(allPlayers[username]);
  		//setPlayerMoving(j, false);
  	}
    if (event.keyCode === 37){
      inputStates.left = false;
      allPlayers[username].moving = false;
      //stopPlayer(allPlayers[username]);
      //setPlayerMoving(j, false);
    }
    if (event.keyCode === 38){
      inputStates.up = false;
      allPlayers[username].moving = false;
      //stopPlayer(allPlayers[username]);
      //setPlayerMoving(j, false);
  	}
    if (event.keyCode === 39){
      inputStates.right = false;
      allPlayers[username].moving = false;
      //stopPlayer(allPlayers[username]);
      //setPlayerMoving(j, false);
  	}
    if (event.keyCode === 40){
      inputStates.down = false;
      allPlayers[username].moving = false;
      //stopPlayer(allPlayers[username]);
      //setPlayerMoving(j, false);
  	}
    if (event.keyCode === 32){
      inputStates.space = false;
      //setPlayerMoving(j, false);
  	}
  }, false);

  // Mouse event listeners
  canvas.addEventListener('mousemove', function(evt) {
    inputStates.mousePos = getMousePos(evt);
	//allPlayers[username].moving = true;
  }, false);

  canvas.addEventListener('mousedown', function(evt) {
    inputStates.mousedown = true;
    inputStates.mouseButton = evt.button;
	if(currentGameState === gameStates.running){
		allPlayers[username].moving = true;
		var diffx = inputStates.mousePos.x-allPlayers[username].x;   
		var diffy = inputStates.mousePos.y-allPlayers[username].y; 
		if(inputStates.mousePos.y < allPlayers[username].y && diffx >= diffy && diffx <= diffy*(-1)){
				allPlayers[username].dir = DIR_N;
		} 
		if(inputStates.mousePos.y > allPlayers[username].y && diffx <= diffy && diffx >= diffy*(-1)){
				allPlayers[username].dir = DIR_S;
		}
		if(inputStates.mousePos.x < allPlayers[username].x && diffy >= diffx && diffy <= diffx*(-1)){
				allPlayers[username].dir = DIR_W;
		}
		if(inputStates.mousePos.x > allPlayers[username].x && diffy <= diffx && diffy >= diffx*(-1)){
				allPlayers[username].dir = DIR_E; 
		}
	}
  }, false);

  canvas.addEventListener('mouseup', function(evt) {
    inputStates.mousedown = false;
	allPlayers[username].moving = false;
  }, false);
}

function drawPlayer(player){
	player.draw(context);
	//console.log(player.x + ":"+player.y);
}

function drawAllPlayers(){
	for(var name in allPlayers) {
		//console.log("on déssine tous les joueurs");
		drawPlayer(allPlayers[name]);
	}
}

function movePlayer(player, delta){
	//console.log("le joueur bouge");
	if(player.moving){
		//player.moving=true;
		player.move(delta);
	}
	pos = {'user':username, 'posX':player.x, 'posY':player.y};
	//console.log("moving to the "+player.dir);
	if(player.dir==1)
		direct = "down";
	if(player.dir==2)
		direct = "left";
	if(player.dir==3)
		direct = "right";
	if(player.dir==0)
		direct = "up";
	//console.log(direct);	
	socket.emit('sendpos', pos, direct, player.moving);
}
/*
function stopPlayer(player){
	player.moving=false;
	pos = {'user':username, 'posX':player.x, 'posY':player.y};
	socket.emit('sendpos', pos, direct, player.moving);
}*/
function addMenuClicks(){

	//clique sur le menu start
	if(inputStates.mousedown)
	{
		//menu de d걡rt
		if(currentGameState == gameStates.home && cooldown==true)
		{
			//START
			if((inputStates.mousePos.x >= (w/2-startLength/2)) && (inputStates.mousePos.x <= (w/2+startLength/2)))
			{
				
				if((inputStates.mousePos.y >= (spaceBetweenMenus-(policeSize/2))) && (inputStates.mousePos.y <= (spaceBetweenMenus+(policeSize/2))))
				{
					//console.log("clique sur le menu start");
					socket.emit('sendStartGame', level);
					currentGameState = gameStates.running;
					
				}
			}
			//INFOS
			if((inputStates.mousePos.x >= (w/2-infosLength/2)) && (inputStates.mousePos.x <= (w/2+infosLength/2)))
			{
				
				if((inputStates.mousePos.y >= (spaceBetweenMenus*2-(policeSize/2))) && (inputStates.mousePos.y <= (spaceBetweenMenus*2+(policeSize/2))))
				{
					//console.log("clique sur le menu infos");
					currentGameState = gameStates.homeInfos;
				}
			}
			//SCORES
			if((inputStates.mousePos.x >= (w/2-scoresLength/2)) && (inputStates.mousePos.x <= (w/2+scoresLength/2)))
			{
				
				if((inputStates.mousePos.y >= (spaceBetweenMenus*3-(policeSize/2))) && (inputStates.mousePos.y <= (spaceBetweenMenus*3+(policeSize/2))))
				{
					//console.log("clique sur le menu scores");

					currentGameState = gameStates.homeScores;
				}
			}
		}
		//Menu de pause
		if(currentGameState == gameStates.pause && cooldown==true)
		{
			//HOME
			if((inputStates.mousePos.x >= (homeX-homeLength/2)) && (inputStates.mousePos.x <= (homeX+homeLength/2)))
			{
				
				if((inputStates.mousePos.y >= (homeY-(pausePoliceSize/2))) && (inputStates.mousePos.y <= (homeY+(pausePoliceSize/2))))
				{
					//console.log("clique sur le menu home");
					currentGameState = gameStates.home;
				}
			}
			//Resume
			if((inputStates.mousePos.x >= (resumeX-resumeLength/2)) && (inputStates.mousePos.x <= (resumeX+resumeLength/2)))
			{
				
				if((inputStates.mousePos.y >= (resumeY-(pausePoliceSize/2))) && (inputStates.mousePos.y <= (resumeY+(pausePoliceSize/2))))
				{
					//console.log("clique sur le menu resume");
					currentGameState = gameStates.running;
				}
			}
		}
		cooldown=false;
	}
}

function recupereMap(map){
	map.getMap();
}

function dessineMap(map,ctx){
	map.drawMap(ctx);
}

function drawHighScore(joueur, context, t){
	var pseudo = joueur.pseudo;
	var highScore = joueur.highScore;
	//context.save();
	policeSize = 10;
	context.fillText(pseudo + " : " + highScore, w/2, spaceBetweenMenus + t);
	//context.restore();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Fonctions "réponses" socket.on /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////


function updatePlayers(listOfPlayers){
	allPlayersStates = listOfPlayers;
	for (name in allPlayersStates){
	//	console.log(name);
		if(typeof allPlayersStates[name] != 'undefined')
			updateOnePlayer(name, allPlayersStates[name].v,allPlayersStates[name].isLvLDone,allPlayersStates[name].isDead);
	}
}

function updatePlayerNewPos(user, newPos, dir, moving){
	allPlayers[user].x = newPos.posX;
	allPlayers[user].y = newPos.posY;
	//console.log("newPlayerPos : dir="+dir);
	if(dir=="down")
		allPlayers[user].dir = DIR_S;
	if(dir=="left")
		allPlayers[user].dir = DIR_W;
	if(dir=="up")
		allPlayers[user].dir = DIR_N;
	if(dir=="right")
		allPlayers[user].dir = DIR_E;

	allPlayers[user].moving = moving;

}

//le jeu commence,  au niveau lvl
function startGame(lvl,listOfPlayers){
	
        for(var i in listOfPlayers){
            createOnePlayer(i, listOfPlayers[i].x, listOfPlayers[i].y, listOfPlayers[i].v);
        }
        
	allPlayersStates = listOfPlayers;
	level = lvl;
	if(level == 0)
	{
		for (name in allPlayersStates)
		{
			createOnePlayer(name, allPlayersStates[name].x, allPlayersStates[name].y, allPlayersStates[name].v);
	//		console.log(name+" crée");
		}
		for (name in allPlayers)
		{
			allPlayers[name].initSprites(32, 32, NB_DIRECTIONS, NB_FRAMES_PER_POSTURE);
		}
		currentGameState = gameStates.running;
	}
        
        requestAnimationFrame(mainLoop);
        
	//console.log("on commence le jeu, au niveau : "+level);
}
function updateOnePlayer(name,speed,isLvLDone,isDead){
	if(typeof allPlayers[name]!='undefined'){
		allPlayers[name].speed = speed;
		allPlayers[name].isLevelDone = isLvLDone;
		allPlayers[name].dead = isDead;
	}
}
function createOnePlayer(name,x,y,speed){

	var j = new Joueur(name, 0, x, y, 1, 21, 27, DIR_S, "images/heroRouge.png", nbImages, nbFramesOfAnimationBetweenRedraws, context, MapLevel1);
       j.initSprites(32,32,4,3);
	   RecuperationDonnees(j);
	//j.spritesheet.onload = function(){
	//j.initSprites(51, 78, NB_DIRECTIONS, NB_FRAMES_PER_POSTURE);
	//};
	//var j = new Joueur(name, x, y, speed);
	allPlayers[name]=j;
	//console.log("joueur crée ! : "+allPlayers[name].x+":"+allPlayers[name].y+":v="+allPlayers[name].v);
}


