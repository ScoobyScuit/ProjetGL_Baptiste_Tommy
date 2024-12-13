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
    console.log("Client connecté.");

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log("Message reçu :", parsedMessage);

            // Diffuser à tous les clients en ajoutant l'ID du projet
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: parsedMessage.type,
                        projectId: parsedMessage.projectId
                    }));
                }
            });
        } catch (error) {
            console.error("Erreur traitement message :", error);
        }
    });

    ws.on('close', () => {
        console.log("Client déconnecté.");
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
