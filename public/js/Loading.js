
function Loading(htmlLoading){
    this.htmlLoading = htmlLoading;
    
    /* IMAGES */
    this.images = {
        //imageExemple: "assets/img/image.png"
    };
    this.imagesChargees = {}; // Contiendra les objets images chargés
    
    /* SONS */
    this.sons = {
        //sonExemple: "assets/sounds/son.mp3"
    };
    this.sonsCharges = {};
    
    this.chargementImageTermine = false;
    this.chargementSonTermine = false;
}

/* Gestion du chargement des images */
Loading.prototype.chargerImages = function() {
    var self = this;
    
    if(this.images.length === undefined){
        this.chargementImageTermine = true;
    }
    
    for(var cle in this.images){
        var imageUrl = this.images[cle];
        
        var image = new Image();
        image.src = imageUrl;
        image.cle = cle;
        
        image.onload = function(){
            self.charger(this, this.cle);
        };
    }
};

Loading.prototype.charger = function(image, cle) {
    this.imagesChargees[cle] = image;
    
    if(this.images.length === this.imagesChargees.length){
        this.chargementImageTermine = true;
    }
};

/* Gestion du chargement des sons */
Loading.prototype.chargerSons = function() {
    var self = this;
    
    if(this.sons.length === undefined){
        this.chargementSonTermine = true;
    }
    
    for(var cle in this.sons){
        var sonUrl = this.sons[cle];
        
        var audio = new Audio(sonUrl);
        audio.type = "audio/mpeg";
        audio.cle = cle;
        
        audio.oncanplaythrough = function(){
            self.loadSon(this, this.cle);
        };
    }
};

Loading.prototype.loadSon = function(son, cle) {
    this.sonsCharges[cle] = son;
    
    if(this.sons.length === this.sonsCharges.length){
        this.chargementSonTermine = true;
    }
};