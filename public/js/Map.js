function Map(index, canvas) {
    this.index = index;
    this.width = 0;
    this.height = 0;
    this.layersT = [];
    this.tiles = [];
    this.images = [];
    this.tilewidth = 0;
    this.tileheight = 0;

    this.objetsCollision = [];

    this.getMap = function () {
        $.ajax(
                {
                    url: './map/' + "level" + this.index + '.json', // La ressource ciblée
                    type: 'GET', // Le type de la requête HTTP
                    dataType: 'json', // Le type de données à recevoir, ici, du HTML.
                    success: function (result) {
                        this.height = result.height;
                        this.width = result.width;
                        this.tileheight = result.tileheight;
                        this.tilewidth = result.tilewidth;

                        for (var t = 0; t < result.tilesets.length; t++) {
                            this.tiles[t] = result.tilesets[t];
                            var image = new Image();
                            image.src = result.tilesets[t].image;
                            this.images[t] = image;
                        }

                        for (var r = 0; r < result.layers.length; r++) {
                            this.layersT[r] = result.layers[r];
                        }

                        this.initialiserCollisions();

                    }.bind(this)});
    };

    this.drawMap = function (canvasC) {
        
        var x = 0;
        for (var a = 0; a < this.layersT.length; a++) {
            x = 0;
            for (var u = 0; u < this.tiles.length; u++) {


                x = 0;
                for (var i = 0; i < this.height; i++) {
                    for (var j = 0; j < this.width; j++) {

                        if (this.layersT[a].name === "objetCollision") {
                            continue;
                        }
                        if (this.layersT[a].data[x] === this.tiles[u].firstgid) {

                            canvasC.drawImage(this.images[u], j * this.tilewidth, i * this.tileheight);
                        }
                        x++;
                    }
                }
            }
        }
        
        for(var i in this.objetsCollision){
            var objet = this.objetsCollision[i];
            
            canvasC.fillStyle = "rgba(0, 0, 200, 0.5)";
            canvasC.fillRect (objet.x, objet.y+objet.height/2, objet.width, objet.height);
        }
    };

    this.initialiserCollisions = function () {
        var index;
        for (var i = 0; i < this.layersT.length; i++) {
            if (this.layersT[i].name === "objetCollision") {
                index = i;
            }
        }

        var collision = this.layersT[index];
        var objetsArray = collision.objects;

        this.objetsCollision = objetsArray;
    };

}

	