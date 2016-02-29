function ExistDeja(){
	var div = document.getElementById('divPseudo');
	div.class="form-group has-error";
	var p = document.createElement('p');
	p.style = 'color : red';
	p.innerHTML += "Ce pseudo est déjà utilisé. Veuillez choisir un autre pseudo.";
	div.appendChild(p);
}

function FaireInscrip(){
	var div = document.getElementById('divPseudo');
	div.class="form-group has-error";
	var p = document.createElement('p');
	p.style = 'color : red';
	p.innerHTML += "Ce pseudo n'est pas reconnu. Veuillez vous inscrire.";
	div.appendChild(p);
}

function SuppMessageError(){
	var div = document.getElementById('divPseudo');
	var p = div.getElementsByTagName('p');
	if(p.length !== 0){
		div.removeChild(p[0]);
	}
}

function Inscription(){
	var nomPseudo = document.getElementById('nomPseudo').value;
	$.ajax({ url : '/newJoueur', 
		type : 'post',
		data :{ nomPseudo },
		dataType : 'text',
		success : function(data){
			if(data === 'Failed'){
				ExistDeja();
			}else{
			document.getElementById('connexion').click();
			}
		}
	});
}

function Connexion(){
	var nomPseudo = document.getElementById('nomPseudo').value;
	$.ajax({ url : '/Joueur/'+nomPseudo, 
		type : 'get',
		dataType : 'text',
		success : function(data){
			if(data === 'NOT FOUND'){
				FaireInscrip();
			}else{
			document.getElementById('CloseAccueil').click();
			document.querySelector("#LienServeurs").getElementsByTagName('a')[0].click();
			}
		}
	});
}

function UpdateScore(joueur, highScore){
		$.ajax({ url : '/updateScore/'+joueur.pseudo, 
		type : 'put',
		data :{ highScore },
		dataType : 'text',
		success : function(data){
			if(data === 'error updating highScore'){
				//FaireInscrip();
			}else{
			//document.getElementById('CloseAccueil').click();
			//document.querySelector("#LienServeurs").getElementsByTagName('a')[0].click();
			}
		}
	});
}

function TestUpdateScore(joueur, highScore){
		$.ajax({ url : '/highScore/'+joueur.pseudo, 
		type : 'get',
		dataType : 'text',
		success : function(data){
			if(data === 'NOT FOUND'){
				//FaireInscrip();
			}else{
				if(data < highScore){
					UpdateScore(joueur,highScore);
				}
			}
		}
	});
}

