// variables relatives au canvas
var canvas, w, h;
//variable d'affichage, 1 ==> menu de départ, 2 ==> infos, 3 ==> scores, 0 ==> pas de menu (jeu en cours)
var displayMenu=1;
//espace (y) entre les différents menu 
var spaceBetweenMenus;
// "taille" des différents menus
var startLength, infosLength, scoresLength, policeSize;
//états des différents les listeners
var inputStates = {};


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
}

var mainLoop = function(time)
{
	clearCanvas();
	//console.log("k");
	//console.log(displayMenu);
	drawCurrentMenu();
	addMenuClicks(); 
	//console.log(inputStates.mousePos);
	requestAnimationFrame(mainLoop);
}

function clearCanvas() {
  context.save();
  context.clearRect(0, 0, w, h);
  //ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  //ctx.fillRect(0, 0, w, h);
  context.restore();
}

function drawCurrentMenu(){
	
	context.save();
	context.restore();
	//menu de départ
	if(displayMenu==1)
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

	if(displayMenu==0) // pas de menu
	{
		context.textBaseline = 'middle';
	  	context.textAlign = "center";
		context.font = '40pt Calibri';
		policeSize = 40;
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center'; 
		context.fillText("Vous avez cliqué sur start !!", w/2, spaceBetweenMenus*2);
	}

	if(displayMenu==2) // pas de menu
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

	if(displayMenu==3) // pas de menu
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
		if(displayMenu==1)
		{
			//START
			if((inputStates.mousePos.x >= (w/2-startLength/2)) && (inputStates.mousePos.x <= (w/2+startLength/2)))
			{
				
				if((inputStates.mousePos.y >= (spaceBetweenMenus-(policeSize/2))) && (inputStates.mousePos.y <= (spaceBetweenMenus+(policeSize/2))))
				{
					//console.log("clique sur le menu start");
					displayMenu = 0;
				}
			}
			//INFOS
			if((inputStates.mousePos.x >= (w/2-infosLength/2)) && (inputStates.mousePos.x <= (w/2+infosLength/2)))
			{
				
				if((inputStates.mousePos.y >= (spaceBetweenMenus*2-(policeSize/2))) && (inputStates.mousePos.y <= (spaceBetweenMenus*2+(policeSize/2))))
				{
					//console.log("clique sur le menu infos");
					displayMenu = 2;
				}
			}
			//SCORES
			if((inputStates.mousePos.x >= (w/2-scoresLength/2)) && (inputStates.mousePos.x <= (w/2+scoresLength/2)))
			{
				
				if((inputStates.mousePos.y >= (spaceBetweenMenus*3-(policeSize/2))) && (inputStates.mousePos.y <= (spaceBetweenMenus*3+(policeSize/2))))
				{
					//console.log("clique sur le menu scores");
					displayMenu = 3;
				}
			}
		}
	}
}