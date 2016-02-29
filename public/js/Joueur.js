

/*function Joueur(pseudo, x, y, speed) {
 this.pseudo = pseudo;
 this.highScore;
 this.sprite;*/

function Joueur(pseudo, highScore, x, y, speed, width, height, dir, img, nbImages, nbFramesOfAnimationBetweenRedraws, context, map) {
    this.pseudo = pseudo;
    this.highScore = highScore;
    this.spritesheet = new Image();
    this.spritesheet.src = img;
    this.spritesMan = [];
    this.dead = false;
    this.moving = false;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.speedX = this.speed;
    this.speedY = this.speed;
    /*this.width;
     this.height;
     this.dir;*/
    this.isLevelDone = false;
    this.width = width;
    this.height = width;
    this.dir = dir;
    this.context = context;
    this.nbImages = nbImages;
    this.nbFramesOfAnimationBetweenRedraws = nbFramesOfAnimationBetweenRedraws;
    this.map = map;

    this.initSprites = function (spriteWidth, spriteHeight, nbLinesOfSprites, nbSpritesPerLine) {

        // on parcour l'image et pour chaque ligne (correspondant à une direction)
        // on extrait un sprite
        for (var i = 0; i < nbLinesOfSprites; i++) {
            var yLineForCurrentDir = i * spriteHeight;

            var sprite = new Sprite(this.spritesheet, 0, yLineForCurrentDir,
                    spriteWidth, spriteHeight,
                    nbSpritesPerLine,
                    3, this.context); // draw every 1s
            this.spritesMan[i] = sprite;
        }
    }

    this.draw = function (context) {
        context.save();
        if(!this.dead){
			if(!this.moving) {
				//console.log(this.dir);
            this.spritesMan[this.dir].render(this.x, this.y);
        } else {
            this.spritesMan[this.dir].renderMoving(this.x, this.y);
        } 
             context.restore();   
        }
        
        this.context.fillStyle = "rgba(0, 200, 0, 0.5)";
        this.context.fillRect (this.x, this.y, this.width, this.height);
        
        context.restore();
    };

	this.move = function(delta){
		//context.save();
		context.clearRect(0, 0, w, h);
        if (!this.dead){
            if(this.moving){
                this.speedX = this.speedY = 0; 
				
                if (inputStates.left) {
                    this.speedX = -this.speed;
					//this.dir = DIR_W;
					//this.spritesMan[this.dir].renderMoving(this.x, this.y);
                }  
                if (inputStates.up) {   
                   this.speedY = -this.speed; 
				   //this.dir = DIR_N;	
					//this.spritesMan[this.dir].renderMoving(this.x, this.y);				   
                   //console.log("up");
                }  
               if (inputStates.right) {  
                    this.speedX = this.speed; 
					//this.dir = DIR_E;
					//this.spritesMan[this.dir].renderMoving(this.x, this.y);
                    //console.log("right"); 
                }  
                if (inputStates.down) {  
                    //console.log("down");
                    this.speedY = this.speed; 
					//this.dir = DIR_S;					
                }
				if (inputStates.mousedown) {
					var dx = this.x - inputStates.mousePos.x;
					var dy = this.y - inputStates.mousePos.y;
					var angle = Math.atan2(dy, dx);
					var deplX -= calcDistanceToMove(delta,2*Math.cos(angle));
					var deplY -= calcDistanceToMove(delta,2*Math.sin(angle));

                    this.x += deplX;
                    this.y += deplY;

                        if (this.isCollision()) {
                            this.x -= deplX;
                            this.y -= deplY;
                        }
				}
                /*this.spritesMan[this.dir].renderMoving(this.x, this.y);
				
				
			} else{
				this.spritesMan[this.dir].render(this.x, this.y);
			}*/
             
            } 
        var deplX = calcDistanceToMove(delta, this.speedX);
        var deplY = calcDistanceToMove(delta, this.speedY);

        this.x += deplX;
        this.y += deplY;

        if (this.isCollision()) {
            this.x -= deplX;
            this.y -= deplY;
        }
    };

    this.isCollision = function () {
        
        var listeObjets = this.map.objetsCollision;

        for (var objetIndex in listeObjets) {
            var objet = listeObjets[objetIndex];

            if (objet.properties.blocking) {
                var boolCollision = collisionRectangles(this.x, this.y, this.width, this.height, objet.x, objet.y+(objet.height/2), objet.width, objet.height);
                if (boolCollision) {
                    return true;
                }
            }
        }
    };

}
}

