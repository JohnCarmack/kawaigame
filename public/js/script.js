$.ajax({url: "/rooms", success: function(result){
	
	for(i = 0; i < result.length; i++){
		console.log(result[i]);
	 document.getElementById('rooms').innerHTML +=
			  "<option>"+result[i]+"</option>";
	}
              
}});