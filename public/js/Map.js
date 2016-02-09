	var image = new Image();
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
			*/

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


	function dessinerMapLayer(index, canvas){

		$.ajax(
		{
		url : '../map/' + "level"+index+'.json', // La ressource ciblée
		   type : 'GET', // Le type de la requête HTTP

		   /**
			* Le paramètre data n'est plus renseigné, nous ne faisons plus passer de variable
			*/

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
	
	function getTilesetsName(){
		
	}
	
	

	function getLayers(map){
	for (var  i = 0; i < map.length; i++)
	{
	  console.log(map[i]);
	}
	}
