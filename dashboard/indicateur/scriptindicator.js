/**
 * @file scriptindicator.js
 * @brief Gestion des indicateurs de progression via WebSocket.
 *
 * Ce fichier gère la connexion WebSocket pour recevoir et envoyer les mises à jour de progression
 * ainsi que les commandes spécifiques liées au calendrier et à la timeline. Il met également à jour
 * l'affichage de la barre de progression dans l'interface utilisateur.
 */

const serverPort = 3333; /**< @brief Port sur lequel le serveur WebSocket écoute. */
const progressBar = document.getElementById('progressBar'); /**< @brief Élément SVG représentant la barre de progression. */
const progressText = document.getElementById('progressText'); /**< @brief Élément affichant le pourcentage de progression. */
const startPoint = document.getElementById('startPoint'); /**< @brief Point de départ de la barre de progression. */
let ws; /**< @brief Variable pour stocker l'instance WebSocket. */

import { updateCalendarAndTimeline } from "/dashboard/calendar/scriptcalendar.js";

/**
 * @brief Établit une connexion WebSocket avec le serveur.
 *
 * Initialise la barre de progression et gère les événements `onopen`, `onmessage`, `onerror` et `onclose`.
 * En cas de fermeture, la connexion est rétablie automatiquement après un délai.
 */
function connectWebSocket() {
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
            const data = JSON.parse(event.data);
            
            // Vérifie si le champ "progress" existe dans le message
            if (data.progress !== undefined) {
                if (typeof data.progress === 'number') {
                    console.log("Progress numérique : " + data.progress);
                    updateProgressIndicator(data.progress);
                } else if (typeof data.progress === 'string') {
                    console.log("Progress commande : " + data.progress);
                    handleCommand(data.progress);
                } else {
                    console.warn("Type de progress non pris en charge :", typeof data.progress);
                }
            } else {
                console.warn("Aucun champ 'progress' trouvé dans le message.");
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
        setTimeout(connectWebSocket, 3000); // Reconnexion automatique après 3 secondes
    };
}

/**
 * @brief Gère les commandes spécifiques reçues via WebSocket.
 *
 * @param {string} command - Commande envoyée par le serveur.
 *
 * Les commandes reconnues sont :
 * - "TaskAdded" : Tâche ajoutée.
 * - "TaskDeleted" : Tâche supprimée.
 * - "TaskCompleted" : Tâche terminée.
 * - "TaskEdited" : Tâche modifiée.
 */
async function handleCommand(command) {
    switch (command) {
        case "TaskAdded":
        case "TaskDeleted":
        case "TaskCompleted":
        case "TaskEdited":
            console.log("Commande reçue. Rafraîchissement du calendrier...");
            await updateCalendarAndTimeline();
            break;
        default:
            console.warn("Commande non reconnue :", command);
    }
}

/**
 * @brief Met à jour l'affichage de la barre de progression.
 *
 * @param {number} value - Nouvelle valeur de la progression (entre 0 et 100).
 */
function updateProgressIndicator(value) {
    value = Math.max(0, Math.min(100, value)); // Clampe la valeur entre 0 et 100

    if (progressBar && progressText && startPoint) {
        const totalLength = progressBar.getTotalLength();
        const dashoffset = totalLength * (1 - value / 100);

        progressBar.style.strokeDashoffset = dashoffset;
        progressText.textContent = `${value}%`;

        console.log(`Progression mise à jour : ${value}%`);
    } else {
        console.error("Éléments de l'indicateur introuvables.");
    }
}

/**
 * @brief Envoie une mise à jour de progression au serveur WebSocket.
 *
 * @param {number} value - Valeur numérique représentant le pourcentage de progression.
 */
function sendProgress(value) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ progress: value }));
        console.log(`Progrès envoyé : ${value}%`);
    } else {
        console.warn("WebSocket non connecté. Tentative de reconnexion...");
        connectWebSocket();
    }
}

// Démarrer la connexion WebSocket dès le chargement du script
connectWebSocket();

/** @brief Exporte la fonction sendProgress pour une utilisation externe. */
export { sendProgress };
