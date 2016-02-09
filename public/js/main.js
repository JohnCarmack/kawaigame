window.onload = function () {
    setTimeout(main, 1000); // Petit délai pour voir le loading
};

function main() {
    // On lance le loading dès le chargement de la page
    var loading = new Loading();
    loading.chargerImages(); // Charger sons et images
    loading.chargerSons();

    /* On affiche le loading tant que toutes les images n'ont pas été chargées */
    var intervalLoading = setInterval(function () {
        if (loading.chargementImageTermine && loading.chargementSonTermine) {
            // Quand tout est chargé, on supprime l'intervale permettant de savoir si le loading est finie, on retire l'image de loading et on lance le jeu
            clearInterval(intervalLoading);

            var loadingDOM = document.getElementById("loading").style.display = "none";
            loadingDOM;

            var json = getMap("./map/map1.json");
            
            var map = new Map(json, loading.imagesChargees["tileset1"]);
            canvas = document.querySelector("#canvas");
            context = canvas.getContext('2d');
            map.afficherMap(context);
            //var appli = new App();
        }
    }, 200);
}

function getMap(url) {
    var resultat = null;

    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function (data) {
            resultat = data;
        }
    });
    
    return resultat;
}