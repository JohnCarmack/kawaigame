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
// room actuelle du joueur
var currentRoom;

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
var currentLevelTime =0;

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
var MapLevel2;
var MapLevel3;

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
    end: 2,
    pause: 3,
    homeScores: 4,
    homeInfos: 5
};

var roomStart = false;

/* Cet array associatif permettra d'associer un temps d'appuie pour chaque touche. Quand l'utilisateur appuiera sur une fleche, on stockera la "date" de debut d'appuie, dès qu'il relachera la touche, on fera la différence en milliseconds et on saura combien de temps l'utilisateur a appuié sur la touche en question 
38 = haut, 40 = bas, 37 = gauche, 39 = droite
*/
var keyAppuie = {38:null, 40:null, 37:null, 39:null};

/* Cette liste correspondra à la liste des touches dans l'ordre sur lesquels l'utilisateur a appuié, avec pour chaque touche le temps d'appuies en milliseconds. Ce cera un tableau de tuples comme ceci { {codeTouche: tempsMs}, {etc..} } */
var listeAppuies = [];
var replay = false;

var timer = function(currentTime) {
	var delta = currentTime - oldTime;
	oldTime = currentTime;
	return delta;
};

function goToNextLevel(){
        currentLevelTime = 0;
        level++;        
}

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


	MapLevel1 = new Map(1 , context);
	MapLevel2 = new Map(2 , context);
	MapLevel3 = new Map(3 , context);
					
    //ajout des actions pour chaque menu
    startGame(1, allPlayers);

	recupereMap(MapLevel1);
	recupereMap(MapLevel2);
	recupereMap(MapLevel3);
	
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
        
        if(allPlayers[username] && allPlayers[username].isLevelDone){
            console.log("ici");
            if(! replay){
                replay = true;
                $("#replay").show();
            }
            
            jouerFantome();
            
            drawPlayer(allPlayers[username]);
        }
        
	addMenuClicks(); 
	/*
	if(typeof allPlayers[username]!='undefined')
	{
		console.log("on checkEnd()");
		checkEnd();
	}
	*/
	//console.log(inputStates.mousePos);
	requestAnimationFrame(mainLoop);
}

function jouerFantome(){
    var xActuel = allPlayers[username].x;
    var yActuel = allPlayers[username].y;
    
    var xVoulu = listeAppuies[0].fin[0];
    var yVoulu = listeAppuies[0].fin[1];
    
    // 38 = haut, 40 = bas, 37 = gauche, 39 = droite 
    var code = listeAppuies[0].code;
    
    if(code === 39){
        xActuel += 2;
        if(xVoulu <= xActuel){
            listeAppuies.shift();
        }
        allPlayers[username].x = xActuel;
    }
    
    else if(code === 40){
        yActuel += 2;
        if(yVoulu <= yActuel){
            listeAppuies.shift();
        }
        allPlayers[username].y = yActuel;
    }
    
    else if(code === 37){
        xActuel -= 2;
        if(xVoulu >= xActuel){
            listeAppuies.shift();
        }
        allPlayers[username].x = xActuel;
    }
    
    else if(code === 38){
        yActuel -= 2;
        if(yVoulu >= yActuel){
            listeAppuies.shift();
        }
        allPlayers[username].y = yActuel;
    }
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


function EndLevel(){
	var length = 0;
	var count = 0;
            
                
	//console.log("dans le endLevel, pour le joueur "+username);
	for(name in allPlayers){
		if(allPlayersStates[name].room == currentRoom)
		{
			if(allPlayers[name].isLevelDone === true){
				count++;
			}
			length++;
		}
	}
        
	console.log(count+"players ont fini le niveau / "+length+" players au total dans cette room");
	if(count === length){
                replay = false;
                listeAppuies = [];
                allPlayers[username].x = 35;
                allPlayers[username].y = 35;
                allPlayers[username].replayLance = false;
                allPlayers[username].isLevelDone = false;
                $("#replay").hide();
                
                console.log(allPlayers[username]);
                console.log(listeAppuies);
		console.log("on change de niveau");
		goToNextLevel();
	}
}

function ToLevel(lvl){
	if(lvl === 1){
		dessineMap(MapLevel1, context);
	}
	if(lvl === 2){
		
		for( name in allPlayers){
			allPlayers[name].map = MapLevel2;
		}
		dessineMap(MapLevel2, context);
		//startGame(lvl, allPlayers);
	}
		if(lvl === 3){
		
		for( name in allPlayers){
			allPlayers[name].map = MapLevel3;
		}
		dessineMap(MapLevel3, context);
		//startGame(lvl, allPlayers);
	}
		if(lvl === 4){
			currentGameState = gameStates.end;
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
		currentLevelTime += delta;
		if(!(typeof allPlayers[username] == 'undefined'))
			movePlayer(allPlayers[username], delta);
		ToLevel(level);
                
                if(! replay){
                    drawAllPlayers();
                    for( name in allPlayers){
                            MonsterCollisionWithWalls(allPlayers[name], h, w);
                    }
                }
		//EndLevel();
		//drawAllPlayers();

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
		context.fillText("Meilleurs scores", w/2, spaceBetweenMenus+70);
		//context.fillText("Score:", w/2, spaceBetweenMenus + 100);
		var t = 120;
		var roomJoueur = document.querySelector("#rooms").value;
		for( name in allPlayers){
			if(allPlayersStates[name].room == roomJoueur){
			context.save();
			drawHighScore(allPlayers[name],context, t);
			t += 50;
			context.restore();
			}
		}
		context.drawImage(etoile, w/4+25, 0);
		
	}
	if(currentGameState == gameStates.end) // menu de fin
	{
			context.save();
			context.textBaseline = 'middle';
			context.textAlign = "center";
			context.font = '40pt Calibri';
			policeSize = 30;
			context.fillStyle = 'white';
			context.textBaseline = 'middle';
			context.textAlign = 'center'; 
			context.fillText("Scores", w/2, 35);
			var t = 50;
			var roomJoueur = document.querySelector("#rooms").value;
		for( name in allPlayers){
			if(allPlayersStates[name].room == roomJoueur){
			allPlayers[name].isLevelDone = true;
			context.save();
			drawHighScore(allPlayers[name],context, t);
			t += 50;
			}
		}
		context.restore();
		context.save();
		policeSize = 10;
		var rejouerText = "Cliquez ici pour rejouer";
	    rejouerLength = context.measureText(rejouerText).width;
		context.fillText(rejouerText, w/2, spaceBetweenMenus*4);
		context.restore();
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
      
      if(replay){
        return;
    }
      
  	if(event.keyCode === 27){
  		inputStates.esc = true;
  	}
    else if (event.keyCode === 37){
      inputStates.left = true;
      if(typeof allPlayers[username] != "undefined"){
	      allPlayers[username].moving = true;
	      allPlayers[username].dir=DIR_W;
      }
      //movePlayer(allPlayers[username], delta);
      //console.log("left");
  	}
    else if (event.keyCode === 38){
      inputStates.up = true;
      if(typeof allPlayers[username] != "undefined"){
	      allPlayers[username].moving = true;
	      allPlayers[username].dir=DIR_N;
  	  }
      //movePlayer(allPlayers[username], delta);
      //console.log("down");
  	}
    else if (event.keyCode === 39){
        inputStates.right = true;
        if(typeof allPlayers[username] != "undefined"){
	        allPlayers[username].moving = true;
	        allPlayers[username].dir=DIR_E;
    	}
        //movePlayer(allPlayers[username], delta);
        //console.log("right");
    }
    else if (event.keyCode === 40){
      inputStates.down = true;
      if(typeof allPlayers[username] != "undefined"){
	      allPlayers[username].moving = true;
	      allPlayers[username].dir=DIR_S;
  	  }
      //movePlayer(allPlayers[username], delta);
  	}
	
    else if (event.keyCode === 32)
      inputStates.space = true;
  
    var code = event.keyCode;
    if (code == '38' || code == '40' || code == '37' || code == '39') {
        if(listeAppuies.length > 0){
            var tailleTab = listeAppuies.length;
            var lastElmt = listeAppuies[tailleTab - 1];
        }

        if(lastElmt && (lastElmt.code == code)){
            return;
        }else{
            listeAppuies.push({code: code, depart: [allPlayers[username].x, allPlayers[username].y], fin: []});
        }
    }
  
  }, false);

  //if the key will be released, change the states object   
  window.addEventListener('keyup', function(event) {
      
      if(replay && event.keyCode == 32){
            EndLevel();
          return; 
      }
      else if(replay){
        return;
    }
      
  	if(event.keyCode === 27){
  		inputStates.esc = false;
  		if(!checkInputStatesTrue()) allPlayers[username].moving = false;
  		//stopPlayer(allPlayers[username]);
  		//setPlayerMoving(j, false);
  	}
    else if (event.keyCode === 37){
      inputStates.left = false;
      if(!checkInputStatesTrue()) allPlayers[username].moving = false;
      //stopPlayer(allPlayers[username]);
      //setPlayerMoving(j, false);
    }
    else if (event.keyCode === 38){
      inputStates.up = false;
      if(!checkInputStatesTrue()) allPlayers[username].moving = false;
      //stopPlayer(allPlayers[username]);
      //setPlayerMoving(j, false);
  	}
    else if (event.keyCode === 39){
      inputStates.right = false;
      if(!checkInputStatesTrue()) allPlayers[username].moving = false;
      //stopPlayer(allPlayers[username]);
      //setPlayerMoving(j, false);
  	}
    else if (event.keyCode === 40){
      inputStates.down = false;
      if(!checkInputStatesTrue()) allPlayers[username].moving = false;
      //stopPlayer(allPlayers[username]);
      //setPlayerMoving(j, false);
  	}
    else if (event.keyCode === 32){
      inputStates.space = false;
      //setPlayerMoving(j, false);
  	}
        
          var code = event.keyCode;
    if (code == '38' || code == '40' || code == '37' || code == '39') {
            var tailleTab = listeAppuies.length;
            var lastElmt = listeAppuies[tailleTab - 1];

            lastElmt.fin = [allPlayers[username].x, allPlayers[username].y];
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
		if(typeof allPlayers[username] != "undefined")
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
    if(typeof allPlayers[username] != "undefined")
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
		if(allPlayers[name].isLevelDone !== true){
		drawPlayer(allPlayers[name]);
		}
	}
}

function movePlayer(player, delta){
	//console.log("le joueur bouge");
	//console.log(checkInputStatesTrue());
	room = $("#rooms").val();
	if(typeof player != "undefined"){
		if(player.moving){
			player.move(delta);
		}
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
	//console.log("Room dans App.js" + room);
	if(typeof player != "undefined")
		socket.emit('sendpos', room, pos, direct, player.moving);
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
				
				if((inputStates.mousePos.y >= (spaceBetweenMenus-(policeSize/2))) && (inputStates.mousePos.y <= (spaceBetweenMenus+(policeSize/2))) && roomStart == true)
				{
					//console.log("clique sur le menu start");
					//console.log("on start le jeu dans la room : "+currentRoom);
					socket.emit('sendStartGame', level, currentRoom);
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
		if(currentGameState == gameStates.end && cooldown == true)
		{
			if((inputStates.mousePos.x >= (w/2-rejouerLength/2)) && (inputStates.mousePos.x <= (w/2+rejouerLength/2)))
			{
				
				if((inputStates.mousePos.y >= (spaceBetweenMenus*4-(policeSize/2))) && (inputStates.mousePos.y <= (spaceBetweenMenus*4+(policeSize/2))))
				{
					//console.log("clique sur le menu scores");
					
					currentGameState = gameStates.home;
					level = 1;
					for( name in allPlayers){
						allPlayers[name].isLevelDone = false;
					}
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
			if(typeof allPlayersStates[name] != 'undefined')
			{
				console.log("updatePlayers name : "+name+ " speed : "+listOfPlayers.v);
				updateOnePlayer(name, allPlayersStates[name].v,allPlayersStates[name].isLvLDone,allPlayersStates[name].isDead);
			}
	}
}

function updatePlayerNewPos(user, newPos, dir, moving){
	if(typeof allPlayers[user]!="undefined"){
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
		if(typeof allPlayers[user] != "undefined")
			allPlayers[user].moving = moving;
	}
}

//le jeu commence,  au niveau lvl
function startGame(lvl,listOfPlayers, room){
	console.log("startGame recu, on commence, room = "+room);
	sprite = ["images/heroRouge.png","images/heroJaune.png","images/heroVert.png","images/heroBleu.png"];
	var j = 0;
	
	if(currentRoom == room)
	{
        for(var i in listOfPlayers){
        	if(listOfPlayers[i].room == room){
            	createOnePlayer(i, listOfPlayers[i].x, listOfPlayers[i].y, listOfPlayers[i].v, sprite[j]);
				j++;
			}
        }
        
		allPlayersStates = listOfPlayers;
		level = lvl;
		console.log(lvl);
		if(level == 0)
		{
			for (name in allPlayersStates)
			{
				if(typeof allPlayers[name] != "undefined"){
					if(allPlayersStates[name].room == room)
						createOnePlayer(name, allPlayersStates[name].x, allPlayersStates[name].y, allPlayersStates[name].v, sprite[j]);
				}
					j++;
		//		console.log(name+" crée");
			}
			for (name in allPlayers)
			{
				if(typeof allPlayers[name] != "undefined")
					allPlayers[name].initSprites(32, 32, NB_DIRECTIONS, NB_FRAMES_PER_POSTURE);
			}
			currentGameState = gameStates.running;
		}
		currentGameState = gameStates.running;
	}
        
        requestAnimationFrame(mainLoop);
        
	//console.log("on commence le jeu, au niveau : "+level);
}

function updateOnePlayer(name,speed,isLvLDone,isDead){
	console.log("updatePlayers");
	if(typeof allPlayers[name]!="undefined"){
		//console.log(typeof allPlayers[name]);
		//console.log(typeof allPlayers[name].speed);
		if(typeof allPlayers[name].speed!="undefined")
			allPlayers[name].speed = speed;
		if(typeof allPlayers[name].isLevelDone!="undefined")
			allPlayers[name].isLevelDone = isLvLDone;
		//console.log("isLevelDone du joueur "+name+" : "+allPlayers[name].isLevelDone);
		if(typeof allPlayers[name].dead!="undefined")
			allPlayers[name].dead = isDead;
	}
}
function createOnePlayer(name,x,y,speed, sprite){

	var j = new Joueur(name, 0, x, y, speed, 21, 27, DIR_S, sprite, nbImages, nbFramesOfAnimationBetweenRedraws, context, MapLevel1);
       j.initSprites(32,32,4,3);
	   RecuperationDonnees(j);
	//j.spritesheet.onload = function(){
	//j.initSprites(51, 78, NB_DIRECTIONS, NB_FRAMES_PER_POSTURE);
	//};
	//var j = new Joueur(name, x, y, speed);
	allPlayers[name]=j;
	//console.log("joueur crée ! : name : "+name+" "+allPlayers[name].x+":"+allPlayers[name].y+":v="+allPlayers[name].speed);
}

function updateUserRoom(room){
	//console.log("updateUserRoom");
	currentRoom = room;
	//console.log("currentRoom = "+currentRoom);
}

function checkInputStatesTrue(){
	//console.log("checking inputStates...");
	var isTrue = false;
	if(inputStates.left) isTrue=true;
	if(inputStates.right) isTrue=true;
	if(inputStates.up) isTrue=true;
	if(inputStates.down) isTrue=true;
	return isTrue;
}


function setRoomStart(){
	roomStart = true;
}

function nextLevel(listOfPlayers, room)
{
    if(replay){
        return;
    }
    
    console.log("next level");
    
	if(room==currentRoom)
	{
		currentLevelTime = 0;
		level++;
		if(typeof allPlayers[username] != "undefined"){ 
			allPlayers[username].isLevelDone=false;
			//console.log("on remet les joueurs au début"+ allPlayers[username].x, allPlayers[username].y);
			allPlayers[username].x = 35;
			allPlayers[username].y = 35;
			//console.log("."+ allPlayers[username].x, allPlayers[username].y);
			socket.emit('resetLevelDone', username, allPlayers[username].isLevelDone);
			//console.log(allPlayers[username].isLevelDone);
		}

	}
}

