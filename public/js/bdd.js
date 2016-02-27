function ExistDeja(){
	var div = document.getElementById('divPseudo');
	div.class="form-group has-error";
	var p = document.createElement('p');
	p.style = 'color : red';
	p.innerHTML += "Ce pseudo est déjà utilisé. Veuillez choisir un autre pseudo.";
	div.appendChild(p);
}

function SuppMessageError(){
	var div = document.getElementById('divPseudo');
	var p = div.getElementsByTagName('p');
	if(p != 'null'){
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
			if(data == 'Failed'){
				ExistDeja();
			}else{
			document.getElementById('connexion').click();
			}
		}
	});
}

