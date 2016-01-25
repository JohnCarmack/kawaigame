
function SpriteSheet(img, x, y, width, height, nbImages, nbFramesOfAnimationBetweenRedraws, spritesheet, spriteWidth, spriteHeight, nbLinesOfSprites, nbSpritesPerLine) {

	this.spritesJoueur = [];

	this.SpriteImage = function(img, x, y, width, height){
		this.img = img;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	  
		// xPos et yPos = position où dessiner le sprite,
		this.render = function(xPos, yPos) {
			  ctx.drawImage(this.img, 
			  this.x, this.y, 
			  this.width, this.height, 
			  xPos, yPos, 
			  this.width, this.height);
		};
	}

	this.Sprite = function(spritesheet, x, y, width, height, nbImages, nbFramesOfAnimationBetweenRedraws) {
		this.spriteImages = [];
		this.currentFrame = 0;
		this.nbFrames = nbImages;
		this.nbTicksBetweenRedraws = nbFramesOfAnimationBetweenRedraws;
		this.nbCurrentTicks=0;

		// on parcour la ligne de l'image où se trouve les imagettes
		// d'animation
		for(var i = 0; i < nbImages; i++) {
			// we extract the subimage
			this.spriteImages[i] = new SpriteImage(spritesheet, x+i*width, y, width, height);
		}

		this.renderMoving = function(x, y) {
			// renders animated sprite, changed every nbTicksBetweenRedraws
			// the frame number
			
			// draw the sprite with the current image
			this.spriteImages[this.currentFrame].render(x, y);

			// increment the number of ticks of animation 
			this.nbCurrentTicks++;

			if(this.nbCurrentTicks > this.nbTicksBetweenRedraws) {
				// enough time elapsed, let's go to the next image
				this.currentFrame++;
				if(this.currentFrame == this.nbFrames) {
					this.currentFrame=0;
				}
				this.nbCurrentTicks = 0;
			}
		};
		this.render = function(x, y) {
			// draws always frame 0, static position
			this.spriteImages[0].render(x, y);
		};
	}
	this.initSprites = function(spritesheet, spriteWidth, spriteHeight, nbLinesOfSprites,nbSpritesPerLine) { 	
		// on parcour l'image et pour chaque ligne (correspondant à une direction)
		// on extrait un sprite
		for(var i= 0; i < nbLinesOfSprites; i++) {
			var yLineForCurrentDir = i*spriteHeight;

			var sprite = new Sprite(spritesheet, 0, yLineForCurrentDir, 
									spriteWidth, spriteHeight, 
									nbSpritesPerLine,
									3); // draw every 1s
			spritesWoman[i] = sprite;
		}
    
	}

	window.onload = function() {	  
		canvas = document.getElementById("canvas");
		ctx = document.getElementById("canvas").getContext("2d");
	  
		// load the spritesheet
		spritesheet = new Image();
		spritesheet.src="http://opengameart.org/sites/default/files/styles/watermarked/public/lpc-art/professor_walk_cycle_no_hat.png";
		spritesheet.onload = function() {
		  
		// info about spritesheet
		var SPRITE_WIDTH = 64.2;
		var SPRITE_HEIGHT = 65;
		var NB_DIRECTIONS = 4;
		var NB_FRAMES_PER_POSTURE = 9;

		initSprites(spritesheet, SPRITE_WIDTH, SPRITE_HEIGHT, 
					NB_DIRECTIONS, NB_FRAMES_PER_POSTURE);
		  
		  requestAnimationFrame(mainLoop);
		};
		
	};

}