
function Joueur(pseudo, highScore, sprite, x, y, speed, width, height, dir) {
    this.pseudo = pseudo;
	this.highScore = highScore;
	this.sprite = sprite;
	this.dead = false;
	this.moving = false;
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.width = width;
	this.height = width;
	this.dir = dir;
	
	this.updateMonsterPosition(delta) = function{
        this.speedX = this.speedY = 0;   

    if (!this.dead){

        if (this.moving) {
    		switch(this.dir) {
    		case DIR_E:
               this.speedX = this.speed;
    		    break;
    		case DIR_W:
    		   this.speedX = -this.speed;
    		    break;
    		case DIR_N:
    		   this.speedY = -this.speed;
    		    break;
    		case DIR_S:
    		   this.speedY = this.speed;
                break;
    		}

        }
		  
		this.x += calcDistanceToMove(delta, this.speedX);
        this.y += calcDistanceToMove(delta, this.speedY);
	}
	}
}