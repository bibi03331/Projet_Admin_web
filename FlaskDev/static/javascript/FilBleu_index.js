document.addEventListener("DOMContentLoaded", function(event) {
    
    /*Création d'un event listener afin de capter un changement de ligne*/
    document.getElementById("select_ligne").addEventListener("change", function(){
        Informations_ligne();
    });
    
    appendLigne();
});
    
/*Création des options pour le SELECT permettant la sélection d'une ligne*/
function appendLigne() {
    getJSON(URL + "lignes/", function(data) {
        /*Création d'une option dans le select pour chaque lignes récupéré*/
        for(i = 0 ; i < data.lignes.length ; i++){
            var e = document.getElementById("select_ligne");
            var opt = document.createElement('option');
            opt.value = data.lignes[i].id;
            opt.innerHTML = data.lignes[i].nom;
            e.appendChild(opt);
        }
        Informations_ligne();
    }, function(status) {
        alert('Something went wrong.');
    });
};

/*Récupération et affichage des informations pour la ligne sélectionnée*/
function Informations_ligne (){
    /*Récupération de l'option du sélect sélectionnée*/
    var e = document.getElementById("select_ligne");
    var idLigne = e.options[e.selectedIndex].value;

    getJSON(URL + "ligne/"+ idLigne + "/arrets/", function(data) {
        /*Purge de la div contenant les informations d'une ligne*/
        var e = document.getElementById("info_ligne");
        e.innerHTML = '';
        
        /*Création de la list contenant les arrêts de la ligne*/
        for(i = 0 ; i < data.arrets_ligne.length ; i++){
            var html =  '<ul class="pageitem">'+
                        '<li class="textbox">'+
                        '<span class="header">' + data.arrets_ligne[i].nom + '</span>'+
                        data.arrets_ligne[i].lieu +
                        '</li>'+
                        '</ul>';
            /*Remplissage de la div HTML avec les arrêts de la ligne obtenus*/
            e.innerHTML = e.innerHTML + html;
        }
    }, function(status) {
        alert('Erreur lors de la récupération des arrêts');
    });
};