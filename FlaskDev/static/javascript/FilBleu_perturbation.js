document.addEventListener("DOMContentLoaded", function(event) {
    appendPerturbations();
    getLignes();
    /*Ajout d'un event listener afin de capter un changement du filtre pour les perturbations*/
    document.getElementById("select_ligne").addEventListener("change", filtrer);
});

var perturbationsLignes;

/*Création des options pour le SELECT permettant la sélection d'une ligne*/
function appendPerturbations() {
    getJSON(URL + "perturbations/", function(data) {
        perturbationsLignes = data;
        
        /*Purge de la div contenant les perturbations*/
        var e = document.getElementById("perturbations");
        e.innerHTML = '';

        /*Pour chaque perturbation création insertion de la partie HTML permettant l'affichage*/
        for(i = 0 ; i < data.perturbations.length ; i++){
            var html =  '<ul class="pageitem">'+
                        '<li class="textbox">'+
                        '<span class="header">' +
                        data.perturbations[i].intitule +
                        '</span>' +
                        '<b>Lignes concernées : </b> ';
            
            /*Ajout de chaque ligne concernée par la perturbation dans le descriptif de celle-ci*/
            for(j = 0 ; j < data.perturbations[i].lignes_concernees.length ; j++){
                /*Si la ligne que l'on ajoute à la perturbation est la dernère concerné par le perturbation on ne met pas de ","*/
                if(j + 1 == data.perturbations[i].lignes_concernees.length){
                    html += data.perturbations[i].lignes_concernees[j].nom_ligne;
                }
                else {
                    html += data.perturbations[i].lignes_concernees[j].nom_ligne + ', ';
                }
            }

            /*Mise en forme de la date pour affichage*/
            date_debut = data.perturbations[i].date_debut.split("-");
            date_debut[2] = date_debut[2].split(".");
            date_fin = data.perturbations[i].date_fin.split("-");
            date_fin[2] = date_fin[2].split(".");
            
            /*Construction du HTML permettant l'affichage des données descriptive de la perturbations*/
            html += '<br><b>À partir du : </b> ' +
                    date_debut[0] + '/' + date_debut[1] + '/' + date_debut[2][0] +
                    ' ' + date_debut[2][1];

            html += "<br><b>Jusqu'au : </b> " +
                    date_fin[0] + '/' + date_fin[1] + '/' + date_fin[2][0] +
                    ' ' + date_fin[2][1];

            html += '<br><br>' + data.perturbations[i].detail +
                    '</li>' +
                    '</ul>';

            e.innerHTML = e.innerHTML + html;
        }
    }, function(status) {
        alert('Something went wrong.');
    });
};

/*Création des options pour le SELECT permettant la sélection d'une ligne pour filter les perturbations*/
function getLignes() {
    getJSON(URL + "lignes/", function(data) {
        /*Ajout d'une option dans le select permettant de filter pour chaque ligne existante*/
        for(i = 0 ; i < data.lignes.length ; i++){
            var e = document.getElementById("select_ligne");
            var opt = document.createElement('option');
            opt.value = data.lignes[i].nom;
            opt.innerHTML = data.lignes[i].nom;
            e.appendChild(opt);
        }
        document.getElementById("select_ligne").value = "";

    }, function(status) {
        alert('Something went wrong.');
    });
};

function filtrer () {
    /*Récupération de la ligne sur laquelle l'utilisateur souhaite effectuer un filtre*/
    filtre = document.getElementById("select_ligne").value;
    
    /*Purge de la div permettant l'affichage des perturbations*/
    var e = document.getElementById("perturbations");
    e.innerHTML = '';

    ajouterElement = 0;

    for(i = 0 ; i < perturbationsLignes.perturbations.length ; i++){
        ajouterElement = 0;
        var html =  '<ul class="pageitem">'+
                  '<li class="textbox">'+
                  '<span class="header">' +
                  perturbationsLignes.perturbations[i].intitule +
                  '</span>' +
                  '<b>Lignes concernées : </b> ';

        /*Ajout de chaque ligne concernée par la perturbation dans le descriptif de celle-ci*/
        for(j = 0 ; j < perturbationsLignes.perturbations[i].lignes_concernees.length ; j++){
            /*Vérification que la ligne en cours de traitement est concernée*/
            if(perturbationsLignes.perturbations[i].lignes_concernees[j].nom_ligne == filtre){
              ajouterElement += 1;
            }
            
            /*Si la ligne que l'on ajoute à la perturbation est la dernère concerné par le perturbation on ne met pas de ","*/
            if(j + 1 == perturbationsLignes.perturbations[i].lignes_concernees.length){
              html += perturbationsLignes.perturbations[i].lignes_concernees[j].nom_ligne;
            }
            else {
              html += perturbationsLignes.perturbations[i].lignes_concernees[j].nom_ligne + ', ';
            }
        }
        
        /*Mise en forme de la date pour affichage*/
        date_debut = perturbationsLignes.perturbations[i].date_debut.split("-");
        date_debut[2] = date_debut[2].split(".");
        date_fin = perturbationsLignes.perturbations[i].date_fin.split("-");
        date_fin[2] = date_fin[2].split(".");
        
        /*Construction du HTML permettant l'affichage des données descriptive de la perturbations*/
        html += '<br><b>À partir du : </b> ' +
              date_debut[0] + '/' + date_debut[1] + '/' + date_debut[2][0] +
              ' ' + date_debut[2][1];

        html += "<br><b>Jusqu'au : </b> " +
              date_fin[0] + '/' + date_fin[1] + '/' + date_fin[2][0] +
              ' ' + date_fin[2][1];

        html += '<br><br>' + perturbationsLignes.perturbations[i].detail +
              '</li>' +
              '</ul>';
        
        if(ajouterElement == 1) {
            e.innerHTML = e.innerHTML + html;
        }
    }
}
