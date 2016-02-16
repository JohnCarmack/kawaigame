
function Joueur(pseudo, highScore, x, y, speed, width, height, dir, img, nbImages, nbFramesOfAnimationBetweenRedraws, context) {
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
	this.width = width;
	this.height = width;
	this.dir=dir;
	this.context=context;
	this.nbImages =nbImages;
    this.nbFramesOfAnimationBetweenRedraws = nbFramesOfAnimationBetweenRedraws;
	
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
		
			//this.spritesMan[this.dir].renderMoving(this.x, this.y);
			//Sprite(this.spritesheet, this.x, this.y, this.width, this.height, this.nbImages, this.nbFramesOfAnimationBetweenRedraws, this.context);
            // ici, une fois que les sprites seront présents, on effectuera un switch en fonction de la direction du joueur, et on sélectionnera le sprite corréspondant
            // pour l'instant, on déssine un joueur tout moche :(
             /*context.translate(this.x, this.y);  
            
             // (0, 0) is the top left corner of the this.  
             context.strokeRect(0, 0, 100, 100);  
            
             // eyes  
             context.fillRect(20, 20, 10, 10);  
             context.fillRect(65, 20, 10, 10);  
            
             // nose  
             context.strokeRect(45, 40, 10, 40);  
            
             // mouth  
             context.strokeRect(35, 84, 30, 10);  
            
             // teeth  
             context.fillRect(38, 84, 10, 10);  
             context.fillRect(52, 84, 10, 10); */ 
            
            // restore the context  
             context.restore();   
        }
    };

	this.move = function(delta){
		context.clearRect(0, 0, w, h);
        if (!this.dead){
            if(this.moving){
                this.speedX = this.speedY = 0; 
				
                if (inputStates.left) {
                    console.log("left");
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
			this.x += calcDistanceToMove(delta, this.speedX);  
            this.y += calcDistanceToMove(delta, this.speedY);
        }
		
    }

