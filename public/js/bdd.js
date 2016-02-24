function inscription(){
	$.post("/newJoueur",
	{
		pseudo: document.querySelector('#nomPseudo').value,
	},
		function(data, status){
			console.log(data,"succés");
		}
	);
}