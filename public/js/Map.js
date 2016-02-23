	function Map(index, canvas){
		this.index= index;
		this.width= 0;
		this.height= 0;
		this.layersT= [];
		this.tiles= [];
		this.images = [];
		this.tilewidth = 0;
		this.tileheight = 0;
		
		this.getMap = function(){
		$.ajax(
		{
		url : '../map/' + "level"+this.index+'.json', // La ressource ciblée
		   type : 'GET', // Le type de la requête HTTP
		   dataType : 'json', // Le type de données à recevoir, ici, du HTML.
		   success: function(result){
			this.height = result.height;
			this.width = result.width;
			this.tileheight = result.tileheight;
			this.tilewidth = result.tilewidth;
			
			for(var t = 0; t < result.tilesets.length; t++){
				this.tiles[t] = result.tilesets[t];
				var image = new Image();
				image.src = result.tilesets[t].image;
				this.images[t] = image;
				console.log("Nom image : "  +result.tilesets[t].name);
			}
			
			for(var r =0 ; r < result.layers.length; r++){
				this.layersT[r] = result.layers[r];
				console.log("Nom Layer : "  +this.layersT[r].name);
			}
			
		}.bind(this)});
		};
		
		this.drawMap = function(canvasC){
			var x = 0 ;
		for(var a = 0; a < this.layersT.length; a++){
			x = 0;
				for( var u = 0; u < this.tiles.length; u++){
					x = 0;
					for(var i = 0; i < this.height ; i++) {
						for( var j = 0; j < this.width ; j++) {
					if(this.layersT[a].data[x] == this.tiles[u].firstgid){
					canvasC.drawImage(this.images[u], j*this.tilewidth, i*this.tileheight);
					}
				x++;
				}
			}
		}
	}
	};
	}
	
	