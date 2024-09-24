const WebSocket = require('ws');
const http = require('http');

// Création du serveur HTTP
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connecté');

    ws.on('message', (message) => {
        console.log(`Message reçu: ${message}`);
        
        // Transmettre le message à tous les clients sous forme de chaîne de caractères
        const stringMessage = String(message);  // Assure que le message est une chaîne de caractères

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(stringMessage);  // Envoie le message comme chaîne de caractères
            }
        });
    });

    ws.on('close', () => {
        console.log('Client déconnecté');
    });
});

// Démarrage du serveur HTTP
server.listen(8080, () => {
    console.log('Serveur WebSocket en écoute sur le port 8080');
});