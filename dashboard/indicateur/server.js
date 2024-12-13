/**
 * @file websocketServer.js
 * @brief Serveur WebSocket pour gérer la communication en temps réel.
 *
 * Ce fichier configure un serveur WebSocket qui permet la communication bidirectionnelle
 * entre les clients et le serveur. Il écoute les connexions entrantes, reçoit les messages,
 * et les diffuse aux clients connectés.
 */

const WebSocket = require('ws'); /**< @brief Module WebSocket pour gérer les connexions WebSocket. */
const http = require('http'); /**< @brief Module HTTP pour créer un serveur de base. */
const serverPort = 3333; /**< @brief Port d'écoute du serveur WebSocket. */

// Création du serveur HTTP
const server = http.createServer(); /**< @brief Instance du serveur HTTP pour intégrer WebSocket. */
const wss = new WebSocket.Server({ server }); /**< @brief Instance du serveur WebSocket. */

/**
 * @brief Gère les connexions WebSocket entrantes.
 *
 * Cette fonction est exécutée lorsqu'un nouveau client se connecte au serveur WebSocket.
 * Elle écoute les messages du client, puis les diffuse à tous les autres clients connectés.
 *
 * @param {WebSocket} ws - Instance WebSocket représentant le client connecté.
 */
wss.on('connection', (ws) => {
    console.log('Client connecté.');

    /**
     * @brief Gère les messages reçus depuis un client.
     *
     * Cette fonction reçoit un message, le valide, puis le renvoie tel quel
     * à tous les clients connectés.
     *
     * @param {string} message - Message reçu du client (attendu en format JSON).
     */
    ws.on('message', (message) => {
        console.log(`Message reçu : ${message}`);

        try {
            // S'assurer que le message est un JSON valide
            const parsedMessage = JSON.parse(message);

            // Renvoie le message tel quel (sans modification)
            const broadcastMessage = JSON.stringify(parsedMessage);

            // Diffuser le message à tous les clients connectés
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    console.log("Diffusion aux clients :", broadcastMessage);
                    client.send(broadcastMessage);
                }
            });
        } catch (error) {
            console.error("Erreur lors du traitement du message :", error);
        }
    });

    /**
     * @brief Gère la déconnexion d'un client.
     *
     * Cette fonction est appelée lorsque le client ferme la connexion.
     */
    ws.on('close', () => {
        console.log('Client déconnecté.');
    });
});

/**
 * @brief Démarre le serveur WebSocket sur le port spécifié.
 *
 * Le serveur écoute les connexions entrantes et initialise le service WebSocket.
 */
server.listen(serverPort, () => {
    console.log(`Serveur WebSocket en écoute sur le port ${serverPort}`);
});
