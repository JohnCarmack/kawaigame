
function Map(json, image) {
    this.json = json;

    this.tileWidth = this.json.tilewidth;
    this.tileHeight = this.json.tileheight;
    this.nbWidth = this.json.width;
    this.nbHeight = this.json.height;
    this.map = this.json.layers[0].data;
    this.image = image;
}

Map.prototype.afficherMap = function (context) {
    i = 0;
    id = 0;
    
    while (i < (this.nbHeight * this.nbWidth)) {
        for (j = 0; j < this.nbWidth; j++) {
            var coords = this.getCoordonnees(this.map[id]);
            context.drawImage(this.image, coords[0], coords[1], this.tileWidth, this.tileHeight, j * this.tileWidth, (i % this.nbHeight) * this.tileHeight, this.tileWidth, this.tileHeight);
            
            id++;
        }
        
        i++;
    }
};

/* 
 * Renvoie les coordonées en pixel pour un tile donné avec un id
 */
Map.prototype.getCoordonnees = function (id) {
    var largeurTileset = this.json.tilesets[0].imagewidth;
    var nbTilesLargTileset = this.json.tilesets[0].columns;

    var numeroLigne = Math.floor((id * this.tileWidth) / largeurTileset);
    var numeroColonne = (id - 1) % nbTilesLargTileset;

    var coordX = numeroColonne * this.tileWidth;
    var coordY = numeroLigne * this.tileHeight;

    return [coordX, coordY];
};