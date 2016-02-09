/*	var image = new Image();
	var l,k,data ;
	var layers = [];
	var tilesets = [];
	function dessinerMap(index, canvas){

		$.ajax(
		{
		url : '../map/' + "level"+index+'.json', // La ressource ciblée
		   type : 'GET', // Le type de la requête HTTP

		   /**
			* Le paramètre data n'est plus renseigné, nous ne faisons plus passer de variable
			

		   dataType : 'json', // Le type de données à recevoir, ici, du HTML.
		   success: function(result){
			//console.log(result.tilesets[0].name);

			image.src = 'images/'+result.tilesets[0].name+'.png';
			l = result.height;
			k = result.width  ;
			data = result.layers[1].data;
		   getLayers(result.layers[1].data);

		}});
		var x = 0;
		for(var i = 0; i < l ; i++) {
			var y = i * 32;


			for( var j = 0; j < k ; j++) {

			if(data[x] == "1"){

				canvas.save();
				canvas.drawImage(image, j*32, y);
				canvas.restore();
			}
	  x++;
			}

			//console.log("data length " + data.length);
		}



	}

var image = new Image();
	var l,k,data ;
	var layers = [];
	var tilesets = [];
	function dessinerMapLayer(index, canvas){

		$.ajax(
		{
		url : '../map/' + "level"+index+'.json', // La ressource ciblée
		   type : 'GET', // Le type de la requête HTTP

		   // Le paramètre data n'est plus renseigné, nous ne faisons plus passer de variable
			

		   dataType : 'json', // Le type de données à recevoir, ici, du HTML.
		   success: function(result){
			//console.log(result.tilesets[0].name);

			image.src = 'images/'+result.tilesets[0].name+'.png';
			l = result.height;
			k = result.width  ;
			data = result.layers[1].data;
			
			
			for(var z=0; z< result.layers.length; z++){
			  layers.push(result.layers[z]);
			  console.log("Name layers : " + layers[z].name);
			}

		for(var aa=0; aa< result.tilesets.length; aa++){
			  tilesets.push(result.tilesets[aa]);
				console.log("Name tilesets : " + tilesets[aa].image);
			}
			
		}});

		
		for(var a = 0; a < layers.length; a++){
		var x = 0;
		for(var i = 0; i < l ; i++) {
			var y = i * 32;


			for( var j = 0; j < k ; j++) {

			if(data[x] == "1"){

				canvas.save();
				canvas.drawImage(image, j*32, y);
				canvas.restore();
			}
	  x++;
			}

			//console.log("data length " + data.length);
		}

	}

	}
	*/
	function Map(index){
		this.index= index;
		this.width= 0;
		this.height= 0;
		this.layersT= [];
		this.tiles= [];
		
		this.getMap = function(){
		$.ajax(
		{
		url : '../map/' + "level"+this.index+'.json', // La ressource ciblée
		   type : 'GET', // Le type de la requête HTTP
		   

		

		   dataType : 'json', // Le type de données à recevoir, ici, du HTML.
		   success: function(result){
			//console.log(result.tilesets[0].name);
			this.height = result.height;
			this.width = result.width;
			
			for(var t = 0; t < result.tilesets.length; t++){
				this.tiles.push(result.tilesets[t]);
			}
			
			for(var r =0 ; r < result.layers.length; r++){
				this.layersT.push(result.layers[r]);
			}
			
		}.bind(this)});
		};
		
		this.drawMap = function(canvasC){
			var imageC = new Image();
			//console.log("Dans DRAWMAP , layersT est : " + this.layersT.length);
			var x = 0 ;
		for(var a = 0; a < this.layersT.length; a++){
			x = 0;
			console.log("Dans LAYER , LAYER NAME  : " + this.layersT[a].name);
				for( var u = 0; u < this.tiles.length; u++){
					//console.log("Dans TILES , TILES NAME  : " + this.tiles[u].image);
					imageC.src = this.tiles[u].image;
					for(var i = 0; i < this.height ; i++) {
						for( var j = 0; j < this.width ; j++) {
						console.log("GID TILES : " + this.tiles[u].firstgid );
					if(this.layersT[a].data[x] == this.tiles[u].firstgid){
					//console.log("DANS IF GID: " + this.tiles[u].firstgid );
					//console.log(this.layersT[a].data[x] == this.tiles[u].firstgid);
					//console.log("SOURCE IMAGE : " + imageC.src);
					canvasC.save();
					canvasC.drawImage(imageC, j*this.tiles[u].imagewidth, i*this.tiles[u].imageheight);
					canvasC.restore();
					}
				x++;
				}
				
				
			}
			//console.log("data length " + data.length);
		}

	}

	};
	}
	
	