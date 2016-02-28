$.ajax({url: "/rooms", success: function(result){
	
	for(i = 0; i < result.length; i++){
		console.log(result[i]);
	 document.getElementById('serveur').innerHTML +=
			  "<option>"+result[i]+"</option>";
			  
	document.getElementById('rooms').innerHTML +=
			  "<option>"+result[i]+"</option>";
	}
              
}});

function FirstRoom(){
	var roomBefore = document.getElementById('rooms').value;
	var room = document.getElementById('serveur').value;
	if(roomBefore !== room){
	document.getElementById('rooms').value = room;
	document.getElementById('switchRoom').click();
	}
	document.getElementById('CloseServeurs').click();
}