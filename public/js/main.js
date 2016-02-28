window.onload = function () {
    main();
	var accueil = document.querySelector("#Accueil");
	accueil.click();
};

function main() {
    var appli = new App();        
}

/* Cet array associatif permettra d'associer un temps d'appuie pour chaque touche. Quand l'utilisateur appuiera sur une fleche, on stockera la "date" de debut d'appuie, dès qu'il relachera la touche, on fera la différence en milliseconds et on saura combien de temps l'utilisateur a appuié sur la touche en question 
38 = haut, 40 = bas, 37 = gauche, 39 = droite
*/
var keyAppuie = {38:null, 40:null, 37:null, 39:null};

/* Cette liste correspondra à la liste des touches dans l'ordre sur lesquels l'utilisateur a appuié, avec pour chaque touche le temps d'appuies en milliseconds. Ce cera un tableau de tuples comme ceci { {codeTouche: tempsMs}, {etc..} } */
var listeAppuies = [];

$(document).keyup(function (e) {
    e = e || window.event;
    var code = e.keyCode;
    if (code == '38' || code == '40' || code == '37' || code == '39') {
      var dateActuelle = new Date();
      var diff = dateActuelle - keyAppuie[code]; // en ms
      
      keyAppuie[code] = null;
      listeAppuies.push({code, diff});
    }
});

/* On part du principe que si un utilisateur relache un input du clavier, c'est qu'il a forcemment appuié dessus, donc on ne vérifiera pas la valeur de l'array */
$(document).keydown(function (e) {
    e = e || window.event;
    var code = e.keyCode;
    if (code == '38' || code == '40' || code == '37' || code == '39') {
      if(keyAppuie[code] === null){
        keyAppuie[code] = new Date();
        //console.log("appuie");
      }
    }
});