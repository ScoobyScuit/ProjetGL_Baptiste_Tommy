// Variables globales
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressPercentage');
const startPoint = document.getElementById('startPoint');

// Connexion au serveur WebSocket
let ws;
function connectWebSocket() {
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        console.log('WebSocket connecté.');
    };
    ws.onmessage = (event) => {
        // Vérifie si la donnée est un Blob
        if (event.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
                const message = reader.result;  // Lecture du contenu du Blob en tant que texte
                handleMessage(message);
            };
            reader.readAsText(event.data);  // Lis le Blob en tant que texte
        } else {
            handleMessage(event.data);  // Si ce n'est pas un Blob, on traite directement
        }
    };

    ws.onclose = () => {
        console.log('WebSocket fermé. Tentative de reconnexion...');
        setTimeout(connectWebSocket, 1000); // Retente la connexion après 1 seconde
    };

    ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
    };
}

// Fonction de traitement du message reçu
function handleMessage(message) {
    const value = parseInt(message, 10);
    if (isNaN(value)) {
        console.error(`Erreur : le message reçu n'est pas un nombre valide: ${message}`);
    } else {
        console.log(`Valeur reçue via WebSocket: ${value}`);
        updateProgress(value);
    }
}

// Connexion WebSocket initiale
connectWebSocket();

// Initialisation de la barre de progression
const totalLength = progressBar.getTotalLength();
progressBar.style.strokeDasharray = totalLength;
progressBar.style.strokeDashoffset = totalLength;

function updateProgress(value) {
    const progress = value / 100;
    const dashoffset = totalLength * (1 - progress);
    progressBar.style.strokeDashoffset = dashoffset;
    progressText.textContent = `${value}%`;

    startPoint.style.opacity = value === 0 ? 1 : 0;

    // Affichage de la valeur dans la console
    console.log(`Valeur mise à jour dans l'indicateur: ${value}`);
}

// Simulation d'envoi de valeurs pour test
// Remplace ce bloc par des envois de valeur réels depuis une autre partie de ton application si nécessaire
/*const testValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
let index = 0;
const testInterval = setInterval(() => {
    if (index < testValues.length) {
        const value = testValues[index];
        console.log(`Envoi de la valeur de test: ${value}`);
        ws.send(value.toString());  // Envoie la valeur au serveur WebSocket
        index++;
    } else {
        clearInterval(testInterval);
    }
}, 2000);*/
// Envoi toutes les 2 secondes
