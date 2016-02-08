

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
var allPlayers = {};
var brique = new Image();
brique.src = "images/brique.png";

//menu de pause
var homeLength, resumeLength;
//position des élements du menu
var homeX, homeY, resumeX, resumeY;
//police du menu de pause 
var pausePoliceSize;
//états des différents les listeners
var inputStates = {};
//etat du jeu 
var currentGameState;
var obstacles = [];
var gameStates = {
	home: 0,
    running: 1,
    over: 2,
    pause: 3,
    homeScores: 4,
    homeInfos: 5
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

    //ajout des actions pour chaque menu
    requestAnimationFrame(mainLoop);
    currentGameState = gameStates.home;
    //set le cooldown à 400ms (un clic tous les 400ms sera pris en compte)
    setInterval(setCooldown,400);

}

var mainLoop = function(time)
{
	//console.log(cooldown);
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
  context.save();
  context.clearRect(0, 0, w, h);
  //ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  //ctx.fillRect(0, 0, w, h);
  context.restore();
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
	//menu de départ
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
		context.textBaseline = 'middle';
	  	context.textAlign = "center";
		context.font = '40pt Calibri';
		policeSize = 40;
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center'; 
		clearCanvas();
		dessinerMap(1,context);
		context.fillStyle = "#FF0000";
//context.fillRect(0,0,150,75);
//context.fillRect(100,100,250,175);

//for (var i = 0; i < 500 ; i++){




//	context.drawImage(brique, 250, 80);

	//context.restore();
//}
//context.drawImage(brique, 250, 80);

	//	context.fillText("Vous avez cliqué sur start !!", w/2, spaceBetweenMenus*2);
	function createObstacles() {
        var obstacle1 = {
      x:200,
      y:0,
      w: 20,
      h:200,
      speedX: 0,
      speedY: 100
    };
 
     var obstacle2 = {
      x:100,
      y:80,
      w: 20,
      h:200,
      speedX: 0,
      speedY: 0
     };
      
     var obstacle3 = {
      x:300,
      y:200,
      w: 20,
      h:200,
       speedX: 0,
      speedY: 0
     };
      
      obstacles.push(obstacle1);
      obstacles.push(obstacle2);
      obstacles.push(obstacle3);
    }
	displayObstacles(12);
	}
	 function displayObstacles(delta) {
     for(var i =0; i < obstacles.length; i++) {
       var o = obstacles[i];
       o.x += calcDistanceToMove(delta, o.speedX);
        o.y += calcDistanceToMove(delta, o.speedY);
       
       if(((o.y+o.h) > canvas.height) || (o.y < 0)) {
         o.speedY = -o.speedY;
       }
       
       displayOneObstacle(o);
     }
    }
  
  function displayOneObstacle(obstacle) {
     ctx.save();
      ctx.fillRect(obstacle.x,obstacle.y, obstacle.w, obstacle.h);
      ctx.restore();
  }

	if(currentGameState == gameStates.homeInfos) // pas de menu
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

	if(currentGameState == gameStates.homeScores) // pas de menu
	{
		context.textBaseline = 'middle';
	  	context.textAlign = "center";
		context.font = '40pt Calibri';
		policeSize = 40;
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center'; 
		context.fillText("Vous avez cliqué sur scores !!", w/2, spaceBetweenMenus*2);
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
  	if(event.keyCode === 27) {
  		inputStates.esc = true;
  	}
    if (event.keyCode === 37) {
      inputStates.left = true;
    } else if (event.keyCode === 38) {
      inputStates.up = true;
    } else if (event.keyCode === 39) {
      inputStates.right = true;
    } else if (event.keyCode === 40) {
      inputStates.down = true;
    } else if (event.keyCode === 32) {
      inputStates.space = true;
    }
  }, false);

  //if the key will be released, change the states object   
  window.addEventListener('keyup', function(event) {
  	if(event.keyCode === 27) {
  		inputStates.esc = false;
  	}
    if (event.keyCode === 37) {
      inputStates.left = false;
    } else if (event.keyCode === 38) {
      inputStates.up = false;
    } else if (event.keyCode === 39) {
      inputStates.right = false;
    } else if (event.keyCode === 40) {
      inputStates.down = false;
    } else if (event.keyCode === 32) {
      inputStates.space = false;
    }
  }, false);

  // Mouse event listeners
  canvas.addEventListener('mousemove', function(evt) {
    inputStates.mousePos = getMousePos(evt);
  }, false);

  canvas.addEventListener('mousedown', function(evt) {
    inputStates.mousedown = true;
    inputStates.mouseButton = evt.button;
  }, false);

  canvas.addEventListener('mouseup', function(evt) {
    inputStates.mousedown = false;
  }, false);
}

function addMenuClicks(){

	//clique sur le menu start
	if(inputStates.mousedown)
	{
		//menu de départ
		if(currentGameState == gameStates.home && cooldown==true)
		{
			//START
			if((inputStates.mousePos.x >= (w/2-startLength/2)) && (inputStates.mousePos.x <= (w/2+startLength/2)))
			{
				
				if((inputStates.mousePos.y >= (spaceBetweenMenus-(policeSize/2))) && (inputStates.mousePos.y <= (spaceBetweenMenus+(policeSize/2))))
				{
					//console.log("clique sur le menu start");
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