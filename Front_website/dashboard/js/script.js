/**
 * @file progressWebSocket.js
 * @brief Gestion de la connexion WebSocket et de la mise à jour d'une barre de progression via des messages reçus.
 */

/** 
 * @var progressBar
 * @brief Élément HTML représentant la barre de progression.
 */
const progressBar = document.getElementById('progressBar');

/** 
 * @var progressText
 * @brief Élément HTML pour afficher le pourcentage de progression.
 */
const progressText = document.getElementById('progressText');

/** 
 * @var startPoint
 * @brief Élément HTML utilisé pour gérer l'opacité de l'état initial de la barre de progression.
 */
const startPoint = document.getElementById('startPoint');

/**
 * @var ws
 * @brief Instance de WebSocket pour gérer la connexion au serveur.
 */
let ws;

/**
 * @brief Connecte l'application au serveur WebSocket.
 * 
 * Cette fonction initialise une nouvelle connexion WebSocket, et gère les événements 
 * `onopen`, `onmessage`, `onclose` et `onerror`. Elle tente de reconnecter automatiquement 
 * en cas de fermeture de la connexion.
 */
function connectWebSocket() {
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        console.log('WebSocket connecté.');
    };

    /**
     * @brief Gère les messages reçus via la WebSocket.
     * 
     * Si la donnée reçue est un `Blob`, elle est lue comme texte. Sinon, la donnée 
     * est directement passée à la fonction `handleMessage`.
     * 
     * @param event L'événement `message` contenant la donnée reçue.
     */
    ws.onmessage = (event) => {
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

    /**
     * @brief Gère la fermeture de la connexion WebSocket et tente une reconnexion après 1 seconde.
     */
    ws.onclose = () => {
        console.log('WebSocket fermé. Tentative de reconnexion...');
        setTimeout(connectWebSocket, 1000); // Retente la connexion après 1 seconde
    };

    /**
     * @brief Gère les erreurs de la connexion WebSocket.
     * 
     * @param error L'erreur générée par la WebSocket.
     */
    ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
    };
}

/**
 * @brief Gère les messages reçus depuis la WebSocket.
 * 
 * Convertit le message reçu en nombre et met à jour la barre de progression. Si le message
 * n'est pas un nombre valide, une erreur est affichée dans la console.
 * 
 * @param message Le message reçu du serveur WebSocket, attendu comme une chaîne de caractères.
 */
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

/** 
 * @var totalLength
 * @brief Longueur totale de la barre de progression en SVG.
 */
const totalLength = progressBar.getTotalLength();

/**
 * @brief Initialise la barre de progression.
 * 
 * Configure les propriétés `strokeDasharray` et `strokeDashoffset` de la barre
 * de progression pour permettre un rendu progressif.
 */
progressBar.style.strokeDasharray = totalLength;
progressBar.style.strokeDashoffset = totalLength;

/**
 * @brief Met à jour l'affichage de la barre de progression.
 * 
 * Cette fonction ajuste la longueur visible de la barre de progression en fonction de la 
 * valeur reçue, et met à jour l'affichage du pourcentage. Elle ajuste également l'opacité 
 * de l'élément de départ.
 * 
 * @param value Le pourcentage de progression à afficher (de 0 à 100).
 */
function updateProgress(value) {
    const progress = value / 100;
    const dashoffset = totalLength * (1 - progress);
    progressBar.style.strokeDashoffset = dashoffset;
    progressText.textContent = `${value}%`;

    startPoint.style.opacity = value === 0 ? 1 : 0;

    // Affichage de la valeur dans la console
    console.log(`Valeur mise à jour dans l'indicateur: ${value}`);
}

/*
 * @brief Simulation d'envoi de valeurs pour test.
 * 
 * Ce bloc est commenté car il est utilisé uniquement pour simuler l'envoi de valeurs
 * de test au serveur WebSocket toutes les 2 secondes.
 */
/*
const testValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
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
}, 2000);
*/
