

/*function Joueur(pseudo, x, y, speed) {
    this.pseudo = pseudo;
	this.highScore;
	this.sprite;*/

function Joueur(pseudo, highScore, x, y, speed, width, height, dir, img, nbImages, nbFramesOfAnimationBetweenRedraws, context, map) {
    this.pseudo = pseudo;
	this.highScore = highScore;
	this.spritesheet = new Image();
    this.spritesheet.src=img;
	this.spritesMan = [];
	this.dead = false;
	this.moving = false;
	this.x = x;
	this.y = y;
	this.speed = speed;
    this.speedX;
    this.speedY;
	/*this.width;
	this.height;
	this.dir;*/
    this.isLevelDone=false;
	this.width = width;
	this.height = width;
	this.dir=dir;
	this.context=context;
	this.nbImages =nbImages;
    this.nbFramesOfAnimationBetweenRedraws = nbFramesOfAnimationBetweenRedraws;
    this.map = map;
	
	this.initSprites = function(spriteWidth, spriteHeight, nbLinesOfSprites,nbSpritesPerLine) { 	
		// on parcour l'image et pour chaque ligne (correspondant à une direction)
		// on extrait un sprite
		for(var i= 0; i < nbLinesOfSprites; i++) {
			var yLineForCurrentDir = i*spriteHeight;

			var sprite = new Sprite(this.spritesheet, 0, yLineForCurrentDir, 
									spriteWidth, spriteHeight, 
									nbSpritesPerLine,
									3, this.context); // draw every 1s
			this.spritesMan[i] = sprite;
		}
    
	}
	
    this.draw = function(context) {
        context.save();
        if(!this.dead){
			if(!this.moving) {
            this.spritesMan[this.dir].render(this.x, this.y);
        } else {
            this.spritesMan[this.dir].renderMoving(this.x, this.y);
        } 
             context.restore();   
        }
    };

	this.move = function(delta){
		context.clearRect(0, 0, w, h);
        if (!this.dead){
            if(this.moving){
                this.speedX = this.speedY = 0; 
				
                if (inputStates.left) {
                    this.speedX = -this.speed;
					this.dir = DIR_W;
					this.spritesMan[this.dir].renderMoving(this.x, this.y);
                }  
                if (inputStates.up) {   
                   this.speedY = -this.speed; 
				   this.dir = DIR_N;	
					this.spritesMan[this.dir].renderMoving(this.x, this.y);				   
                   console.log("up");
                }  
               if (inputStates.right) {  
                    this.speedX = this.speed; 
					this.dir = DIR_E;
					this.spritesMan[this.dir].renderMoving(this.x, this.y);
                    console.log("right"); 
                }  
                if (inputStates.down) {  
                    console.log("down");
                    this.speedY = this.speed; 
					this.dir = DIR_S;					
					this.spritesMan[this.dir].renderMoving(this.x, this.y);
                }
			} if(!this.moving){
				this.spritesMan[this.dir].render(this.x, this.y);
			}
                
            } 
            
            var deplX = calcDistanceToMove(delta, this.speedX);
            var deplY = calcDistanceToMove(delta, this.speedY);
            
			this.x += deplX;  
            this.y += deplY;
            
            if(this.isCollision()){
                this.x -= deplX;
                this.y -= deplY;
            }
        };
        
        this.isCollision = function () {
            var listeObjets = this.map.objetsCollision;
            var utils = new Utils();

            for (var objetIndex in listeObjets) {
                var objet = listeObjets[objetIndex];

                if (objet.properties.blocking) {
                    var boolCollision = utils.collisionRectangles(this.x, this.y, this.width, this.height, objet.x, objet.y, objet.width, objet.height);
                    if (boolCollision) {
                        return true;
                    }
                }
            }
        };
		
    }

