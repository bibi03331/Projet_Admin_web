import SimpleHTTPServer
import SocketServer

# Serveur HTTML sur le port 8080
PORT = 8080
# En ecoute sur l'adresse local uniquement
BIND_ADDRESS = "127.0.0.1"

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer((BIND_ADDRESS, PORT), Handler)

print "Demarrage du serveur web sur le port ", PORT

httpd.serve_forever()