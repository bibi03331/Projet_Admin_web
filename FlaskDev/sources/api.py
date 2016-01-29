from flask import Flask
from flask_restful import Resource, Api
from flask.ext.cors import CORS
import json
import datetime

app = Flask(__name__)
CORS(app) # Permet d'autoriser l'utilisation de l'API depuis l'application web
api = Api(app)

FILE_ADDRESS_LIGNES         = "../ressources/lignes.json"
FILE_ADDRESS_ARRETS         = "../ressources/arrets.json"
FILE_ADDRESS_ETAPES         = "../ressources/etapes.json"
FILE_ADDRESS_PERTURBATIONS  = "../ressources/info_traffic.json"

# Fonction permettant de comparer deux chaines de charactere
# Retourne 1 si les chaines sont identiques et 0 si elles ne le sont pas
def checkArret(jsonFile, arret):
    present = 1 if jsonFile["nom"] == arret else 0

    return present

def getJSONFile(addressFile):
    try:
        # Ouverture du fichier
        with open(addressFile, 'r') as jsonFile:
            # Lecture du fichier
            jsonFile_data = jsonFile.read()
            try:
                # Parsing du texte issu du fichier en JSON
                result = json.loads(jsonFile_data)
                code = 200
            except ValueError, e:
                # Gestion d'une erreur de parsing JSON
                result = {"error": str(e) }
                code = 500

    except IOError as e:
        # Gestion d'une erreur a l'ouverture du fichier
        result = {"error": str(e) }
        code = 500

    return result, code

# Retourne la liste des lignes au format JSON
class getLignes(Resource):
    def get(self):
        return getJSONFile(FILE_ADDRESS_LIGNES)

# Retourne la liste des arrets de la ligne demandee au format JSON
# Parametre :
#       id_ligne : identifiant de la ligne demandee
class getArretsLigne(Resource):
    def get(self, id_ligne):

        response, code = getJSONFile(FILE_ADDRESS_ARRETS)

        # Si la recuperation du JSON s'est bien passee
        # alors on recupere les arrets de la ligne demandee
        if code == 200:
            try:
                # Recuperation des arrets de la ligne demandee
                response = response['arrets'][id_ligne]
            except IndexError as e:
                # Gestion de l'erreur de l'index : ID de la ligne introuvable
                response = {"error": str(e) }
                code = 404

        return response, code

# Retourne les etapes d'un itineraire
# Parametres :
#       date : Date de depart souhaitee
#       depart : Nom de l'arret de depart
#       arrivee : Nom de l'arret d'arrivee
class getRoute(Resource):
    def get(self, date, depart, arrivee):

        # Remise en forme du nom des arrets en remplacant les underscores par des espaces
        depart = depart.replace('_', ' ')
        arrivee = arrivee.replace('_', ' ')

        # Parsing de la date
        try:
            # Exemple du format attendu : 2012-07-22.16:19
            datetime.datetime.strptime(date, '%Y-%m-%d.%H:%M')
            code = 200
        except ValueError as e:
            # Gestion de l'erreur du format de la date
            response = {"error": str(e) }
            code = 500

        if code == 200:
            # Verification des arrets demandes
            nbArretsVerifies = 0
            arretsExistants, code = getJSONFile(FILE_ADDRESS_ARRETS)
            if code == 200:
                for i in range( len(arretsExistants['arrets']) ):
                    for j in range( len(arretsExistants['arrets'][i]['arrets_ligne']) ):
                        # Verification de l'arret de depart
                        nbArretsVerifies += checkArret(arretsExistants['arrets'][i]['arrets_ligne'][j], depart)
                        # Verification de l'arret d'arrivee
                        nbArretsVerifies += checkArret(arretsExistants['arrets'][i]['arrets_ligne'][j], arrivee)

                # Si les deux noms d'arret sont verifies on retourne l'itineraire
                if nbArretsVerifies == 2:
                    print "Itineraire a partir de " + date + " de " + depart + " a " + arrivee
                    response, code = getJSONFile(FILE_ADDRESS_ETAPES)
                else:
                    code = 404
                    response = {"error": "Choix d'arret invalide ou introuvable" }
            else:
                # arretsExistants contient le message d'erreur au format JSON a renvoyer
                response = arretsExistants

        return response, code

# Retourne la liste des noms d'arrets
class getNomsArrets(Resource):
    def get(self):
        arretsExistants, code = getJSONFile(FILE_ADDRESS_ARRETS)

        if code == 200:
            response = []

            for i in range( len(arretsExistants['arrets']) ):
                    # Recuperation du nom des arrets
                    for j in range( len(arretsExistants['arrets'][i]['arrets_ligne']) ):
                        arretJson = {}
                        # Copie du nom de l'arret pour une donnee au format JSON
                        arretJson['nom'] = arretsExistants['arrets'][i]['arrets_ligne'][j]['nom']
                        # Ajout de la donnee contenant le nom de l'arret a la liste
                        response.append(arretJson)
        else:
            # arretsExistants contient le message d'erreur au format JSON a renvoyer
            response = arretsExistants

        return response, code

# Retourne les perturbations au format JSON
class getPerturbations(Resource):
    def get(self):
        return getJSONFile(FILE_ADDRESS_PERTURBATIONS)

api.add_resource(getLignes,         '/lignes/')
api.add_resource(getNomsArrets,     '/noms_arrets/')
api.add_resource(getArretsLigne,    '/ligne/<int:id_ligne>/arrets/')
api.add_resource(getRoute,          '/route/<string:date>/<string:depart>/<string:arrivee>/')
api.add_resource(getPerturbations,  '/perturbations/')

if __name__ == '__main__':
    # Serveur accessible en local sur le port 5000
    app.run(host='127.0.0.1', port=5000, debug=True)