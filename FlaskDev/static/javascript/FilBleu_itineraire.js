document.addEventListener("DOMContentLoaded", function(event) {
    /*Nous cachons la div permettant l'affichage des résultats de l'itinéraire la requête n'étant pas encore effectuée*/
    document.getElementById("result-itineraire").style.display = "none";
    /*Ajout d'un listener sur le bouton permettant de soumettre le formulaire de recherche*/
    document.getElementById("submit").addEventListener("click", getForm);
    getArret();
    
    /*Initialisation du calendrier permettant la sélection de la date*/
    calInit("calendarMain1", "", "champ_date1", "jsCalendar", "day", "selectedDay");
    
    /*Purge du formulaire permettant la recherche d'itinéraire lors du lancement d'une nouvelle recherche*/
    document.getElementById("new_search").addEventListener("click", function (){
        document.forms["form_itineraire"]["date"].value = "";
        document.forms["form_itineraire"]["heure"].value = "";
        document.forms["form_itineraire"]["minutes"].value = "";
        
        document.getElementById("result-itineraire").style.display = "none";
        document.getElementById("search-itineraire").style.display = "block";
    });
});

function getArret () {    
    /*Récupération des arrêts afin de créer les options des selects du formulaire*/
    getJSON(URL + "noms_arrets/", function(data) {
        console.log(data);
        for(i = 0 ; i < data.length ; i++){
            /*Remplissage des options pour le select de départ*/
            var e = document.getElementById("select_arret_depart");
            var opt = document.createElement('option');
            opt.value = data[i].nom;
            opt.innerHTML = data[i].nom;
            e.appendChild(opt);
            
            /*Remplissage des options pour le select de d'arrivée*/
            e = document.getElementById("select_arret_arrivee");
            opt = document.createElement('option');
            opt.value = data[i].nom;
            opt.innerHTML = data[i].nom;
            e.appendChild(opt);
        }
    }, function(status) {
        alert('Erreur lors du chargement des arrêts.');
    });
};

function getForm () {
    if (document.forms["form_itineraire"]["date"].value && document.forms["form_itineraire"]["heure"].value && document.forms["form_itineraire"]["minutes"].value && document.forms["form_itineraire"]["depart"].value && document.forms["form_itineraire"]["arrivee"].value) {
        
        /*Récupération du contenu du formulaire*/
        var date = document.forms["form_itineraire"]["date"].value;
        var heure = document.forms["form_itineraire"]["heure"].value;
        var minutes = document.forms["form_itineraire"]["minutes"].value;
        var depart = document.forms["form_itineraire"]["depart"].value;
        var arrivee = document.forms["form_itineraire"]["arrivee"].value;
        
        /*Flag permettant d'effectuer la recherche d'itinéraire si les contrôle des champs du formulaire sont OK*/
        var flagOK = false;
        
        /*Vérification que l'heure entrée est correct*/
        if (heure < 0 || heure > 23){
            alert("Heure incorrect");
            flagOK = false;
        } else {
            flagOK = true;
        }
        
        /*Vérification que les minutes entrées sont corrects*/
        if (minutes < 0 || minutes > 59){
            alert("Minutes incorrect");
            flagOK = false;
        } else {
            flagOK = true;
        }
        
        if (flagOK == true){
            /*Mise en forme de la date pour la requête GET*/
            date = date.split("/");
            var dateURL = date[2] + "-" + date[1] + "-" + date[0];
            
            /*Suppression des espaces dans les noms d'arrêts*/
            var departURL = depart.replace(" ", "_");
            var arriveeURL = arrivee.replace(" ", "_");

            /*Construction de l'URL pour obtenir l'itinéraire*/
            var URLget = dateURL +"."+ heure +":"+ minutes +"/"+ departURL +"/"+ arriveeURL;
            console.log(URL);

            getJSON(URL + "route/" + URLget, function(data) {
                console.log(data);
                
                /*Purge de la div contenant les itinéraires*/
                var e = document.getElementById("itineraire");
                e.innerHTML = '';

                for(i = 0 ; i < data.etapes.length ; i++){
                    var html =  '<ul class="pageitem">'+
                                '<li class="textbox">'+
                                '<span class="header">' + data.etapes[i].mode + '</span>';

                    if (data.etapes[i].duree) {
                        /*Si à pied*/
                        html += data.etapes[i].duree + " minutes";
                    } else {
                        /*Si Tram ou Bus*/
                        html += data.etapes[i].ligne + '<br>' +
                                "Arrêt : " + data.etapes[i].arret + '<br>' +
                                "Direction : " + data.etapes[i].direction + '<br>' +
                                "Horaire : " + data.etapes[i].heure ;
                    }
                    html +=     '</li>'+
                                '</ul>';
                    e.innerHTML = e.innerHTML + html;
                }
                /*Affichage de la div contenant les resultats de la recherche et masquage du formulaire de recherche*/
                document.getElementById("search-itineraire").style.display = "none";
                document.getElementById("result-itineraire").style.display = "block";
            }, function(status) {
                alert('Erreur lors du chargement des itinéraires.');
            });
        }
    } else {
        alert("Formulaire incomplet");
    }
};