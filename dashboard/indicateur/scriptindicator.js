const serverPort = 3333;
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const startPoint = document.getElementById('startPoint');
let ws;

// Fonction pour établir la connexion WebSocket
function connectWebSocket() {
    // Initialisation de la barre de progression
    const totalLength = progressBar.getTotalLength();
    progressBar.style.strokeDasharray = totalLength;
    progressBar.style.strokeDashoffset = totalLength;
    ws = new WebSocket(`ws://localhost:${serverPort}`);

    ws.onopen = () => {
        console.log('WebSocket connecté.');
    };

    ws.onmessage = (event) => {
        console.log('Message reçu du serveur :', event.data);

        try {
            const data = JSON.parse(event.data); // Convertir le message en JSON
            if (data.progress !== undefined) {
                console.log("data progress : " + data.progress);
                updateProgressIndicator(data.progress); // Mettre à jour l'indicateur
            }
        } catch (error) {
            console.error('Erreur lors de la réception des données :', error);
        }
    };

    ws.onerror = (error) => {
        console.error('Erreur WebSocket :', error);
    };

    ws.onclose = () => {
        console.warn('WebSocket fermé. Tentative de reconnexion...');
        setTimeout(connectWebSocket, 3000); // Reconnexion après 3 secondes
    };
}

// Fonction pour mettre à jour l'indicateur de progression
function updateProgressIndicator(value) {
    value = Math.max(0, Math.min(100, value)); // Limite la valeur entre 0 et 100

    if (progressBar && progressText && startPoint) {
        const totalLength = progressBar.getTotalLength(); // Longueur totale du trait SVG
        const dashoffset = totalLength * (1 - value / 100); // Calcul du dashoffset

        // Appliquer le style pour le SVG
        progressBar.style.strokeDashoffset = dashoffset;

        // Mettre à jour le texte de progression
        progressText.textContent = `${value}%`;

        console.log(`Progression mise à jour : ${value}%`);
    } else {
        console.error("Éléments de l'indicateur introuvables.");
    }
}





// Fonction pour envoyer les progrès au serveur
function sendProgress(value) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ progress: value }));
        console.log(`Progrès envoyé : ${value}%`);
    } else {
        console.warn("WebSocket non connecté, tentative de reconnexion...");
        connectWebSocket();
    }
}

// Démarrer la connexion WebSocket
connectWebSocket();

// Exporter la fonction pour être utilisée ailleurs
export { sendProgress };