function SpriteImage(img, x, y, width, height, context) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.context = context;
  
    // xPos et yPos = position où dessiner le sprite,
    this.render = function(xPos, yPos) {
          this.context.drawImage(this.img, 
		  this.x, this.y, 
		  this.width, this.height, 
		  xPos, yPos, 
		  this.width, this.height);
    };
}

function Sprite(spritesheet, x, y, width, height, nbImages, nbFramesOfAnimationBetweenRedraws, context) {
	this.spriteImages = [];
    this.currentFrame = 0;
    this.nbFrames = nbImages;
    this.nbTicksBetweenRedraws = nbFramesOfAnimationBetweenRedraws;
    this.nbCurrentTicks=0;
	this.context = context;

    // on parcour la ligne de l'image où se trouve les imagettes
    // d'animation
	for(var i = 0; i < nbImages; i++) {
		// we extract the subimage
		this.spriteImages[i] = new SpriteImage(spritesheet, x+i*width, y, width, height, this.context);
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