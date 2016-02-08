var image = new Image();
var l,k,data ;
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
        console.log(result.tilesets[0].name); 
        
        image.src = 'images/'+result.tilesets[0].name+'.png';
        l = result.height;
        k = result.width  ;
        data = result.layers[0].data;
        
 
    }});
    var x = 0;
    for(var i = 0; i < l ; i++) {
		var y = i * 32;
		//	canvas.drawImage(image, 0, y);
		for(var j = 1; j <= k ; j++) {
		    x++;
		//	this.tileset.dessinerTile(ligne[j], context, j * 32, y);
		if(data[x] == "1"){
		    /*if(j == "1"){
		canvas.save();
			canvas.drawImage(image, i, j);
			canvas.restore();
		}else{*/
		    canvas.save();
			canvas.drawImage(image, j*32, y);
			canvas.restore();
		}
		    
		}
		//}
		console.log("data length " + data.length);
	}
   
    
}