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
            console.log('Message reçu du serveur :', data);

            // Récupérer l'ID du projet actuellement sélectionné
            const currentProjectId = localStorage.getItem("selectedProjectId");
            console.log("ID du projet sélectionné : " + currentProjectId);

            // Vérifier si le message concerne le projet actuel
            if (data.projectId === currentProjectId) {
                console.log("Message accepté pour le projet :", currentProjectId);

                // Traiter la commande en fonction du type
                if (data.type) {
                    handleCommand(data.type); // Gérer les commandes spécifiques
                } else {
                    console.warn("Type de commande manquant dans le message.");
                }
            } else {
                console.log(
                    `Message ignoré : ID projet reçu (${data.projectId}) différent de l'ID actuel (${currentProjectId}).`
                );
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
 * Commandes reconnues :
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
            console.log(`Commande reçue : ${command}. Mise à jour requise.`);
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
export function sendProgress(value) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ progress: value }));
        console.log(`Progrès envoyé : ${value}%`);
    } else {
        console.warn("WebSocket non connecté. Tentative de reconnexion...");
        connectWebSocket();
    }
}

export function sendProgress2(actionType, projectId) {
    if (!projectId) {
        console.error("ID du projet manquant lors de l'envoi de la progression.");
        return;
    }

    const message = {
        type: actionType,
        projectId: projectId, // Passe l'ID du projet reçu en argument
        timestamp: new Date().toISOString(),
    };

    console.log("Envoi de la progression WebSocket :", message);

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.warn("WebSocket non connecté. Tentative de reconnexion...");
        connectWebSocket();
    }
}


// Démarrer la connexion WebSocket dès le chargement du script
connectWebSocket();

