/**
 * @file websocketServer.js
 * @brief Implémentation d'un serveur WebSocket en utilisant Node.js et le module 'ws'.
 */

const WebSocket = require('ws');
const http = require('http');

/**
 * @brief Création du serveur HTTP.
 * 
 * Le serveur HTTP est créé pour permettre au serveur WebSocket de fonctionner.
 */
const server = http.createServer();

/** 
 * @brief Initialisation du serveur WebSocket.
 * 
 * Le serveur WebSocket est lié au serveur HTTP pour écouter les connexions sur le même port.
 */
const wss = new WebSocket.Server({ server });

/**
 * @brief Gère les nouvelles connexions au serveur WebSocket.
 * 
 * Cette fonction est exécutée chaque fois qu'un nouveau client se connecte au serveur.
 * 
 * @param ws L'objet WebSocket représentant la connexion avec le client.
 */
wss.on('connection', (ws) => {
    console.log('Client connecté');

    /**
     * @brief Gère la réception des messages envoyés par les clients.
     * 
     * Chaque message reçu est retransmis à tous les autres clients connectés.
     * 
     * @param message Le message reçu du client, généralement sous forme de Buffer.
     */
    ws.on('message', (message) => {
        console.log(`Message reçu: ${message}`);

        // Convertir le message en chaîne de caractères
        const stringMessage = String(message);  // Assure que le message est une chaîne de caractères

        /**
         * @brief Envoie le message à tous les clients connectés.
         * 
         * Parcourt tous les clients et envoie le message à ceux qui sont encore connectés.
         */
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(stringMessage);  // Envoie le message comme chaîne de caractères
            }
        });
    });

    /**
     * @brief Gère la fermeture de la connexion par un client.
     * 
     * Cette fonction est appelée lorsque le client se déconnecte.
     */
    ws.on('close', () => {
        console.log('Client déconnecté');
    });
});

/**
 * @brief Démarrage du serveur HTTP.
 * 
 * Le serveur écoute sur le port 8080 et affiche un message dans la console une fois démarré.
 */
server.listen(8080, () => {
    console.log('Serveur WebSocket en écoute sur le port 8080');
});
