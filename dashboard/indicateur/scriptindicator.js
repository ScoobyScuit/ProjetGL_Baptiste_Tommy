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
let ws; /**< @brief Variable pour stocker l'instance WebSocket. */

import { updateCalendarAndTimeline, updateProjectProgress  } from "/dashboard/calendar/scriptcalendar.js";

/**
 * @brief Établit une connexion WebSocket avec le serveur.
 *
 * Gère la connexion et met à jour le projet correspondant à l'ID reçu dans les messages.
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
        try {
            const data = JSON.parse(event.data);
            const currentProjectId = localStorage.getItem("selectedProjectId");
    
            if (data.projectId === currentProjectId) {
                console.log(`Mise à jour pour le projet ${data.projectId}`);
    
                switch (data.type) {
                    case "TaskDeleted":
                    case "TaskCompleted":
                    case "TaskEdited":
                        updateCalendarAndTimeline();
                        updateProjectProgress(currentProjectId); // Met à jour le taux de progression
                        break;
                    default:
                        console.warn("Commande inconnue :", data.type);
                }
            }
        } catch (error) {
            console.error("Erreur réception WebSocket :", error);
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
 * @brief Envoie une commande de progression au serveur WebSocket.
 *
 * Cette fonction permet d'envoyer des actions spécifiques (comme "TaskDeleted", "TaskCompleted", etc.) 
 * au serveur WebSocket, en incluant l'ID du projet concerné.
 *
 * @param {string} actionType - Le type d'action à envoyer (ex : "TaskDeleted", "TaskCompleted").
 * @param {string} projectId - L'identifiant unique du projet auquel l'action est associée.
 *
 * La fonction vérifie que la connexion WebSocket est ouverte avant d'envoyer le message.
 * Si la connexion n'est pas disponible, elle ne fait rien.
 *
 * @returns {void} - Ne renvoie rien mais envoie un message JSON via la connexion WebSocket.
 *
 * @note La structure du message envoyé est la suivante :
 * {
 *   type: "TaskDeleted",  // Exemple de commande
 *   projectId: "12345"    // ID du projet concerné
 * }
 */
export function sendProgress(actionType, projectId) {
    const message = {
        type: actionType,
        projectId: projectId,
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        console.log("Message envoyé :", message);
    }
}


// Démarrer la connexion WebSocket dès le chargement du script
connectWebSocket();

// Appeler le calcul de progression au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    const currentProjectId = localStorage.getItem("selectedProjectId");

    if (currentProjectId) {
        console.log(`Calcul initial du taux de progression pour le projet : ${currentProjectId}`);
        updateProjectProgress(currentProjectId);
    } else {
        console.warn("Aucun projet sélectionné au chargement de la page.");
    }
});
