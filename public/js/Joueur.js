
function Joueur(pseudo, x, y, speed) {
    this.pseudo = pseudo;
	this.highScore;
	this.sprite;
	this.dead = false;
	this.moving = false;
	this.x = x;
	this.y = y;
	this.speed = speed;
    this.speedX;
    this.speedY;
	this.width;
	this.height;
	this.dir;
    this.isLevelDone=false;
	
    this.draw = function(context) {
        context.save();
        if(!this.dead){
            // ici, une fois que les sprites seront présents, on effectuera un switch en fonction de la direction du joueur, et on sélectionnera le sprite corréspondant
            // pour l'instant, on déssine un joueur tout moche :(
             context.translate(this.x, this.y);  
            
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
             context.fillRect(52, 84, 10, 10);  
            
            // restore the context  
             context.restore();   
        }
    };

	this.move = function(){
        if (!this.dead){
            if(this.moving){
                this.speedX = this.speedY = 0; 

                if (inputStates.left) {
                    this.speedX = -this.speed;
                }  
                if (inputStates.up) {   
                   this.speedY = -this.speed;  
                }  
               if (inputStates.right) {  
                    this.speedX = this.speed; 
                }  
                if (inputStates.down) {  
                    this.speedY = this.speed;  
                }   

                this.x += this.speedX;  
                this.y += this.speedY; 
            } 
        }
    }
}
