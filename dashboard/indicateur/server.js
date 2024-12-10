const WebSocket = require('ws');
const http = require('http');
const serverPort = 3333;

// Création du serveur HTTP
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connecté.');

    ws.on('message', (message) => {
        console.log(`Message reçu : ${message}`);

        // Diffuser le message à tous les clients connectés
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                // S'assurer que le message est une chaîne JSON valide
                const parsedMessage = JSON.stringify({ progress: JSON.parse(message).progress });
                console.log("Diffusion aux clients :", parsedMessage);
                client.send(parsedMessage);
            }
        });
        
    });

    ws.on('close', () => {
        console.log('Client déconnecté.');
    });
});

// Démarrage du serveur HTTP
server.listen(serverPort, () => {
    console.log(`Serveur WebSocket en écoute sur le port ${serverPort}`);
});
