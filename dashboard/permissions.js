/**
 * @file permissions.js
 * @brief Gestion des permissions globales des utilisateurs.
 *
 * Ce fichier définit les permissions globales pour les utilisateurs, telles que l'affichage
 * ou la restriction de certaines fonctionnalités. Les permissions spécifiques à un fichier 
 * ou une fonctionnalité seront gérées directement dans ces fichiers respectifs.
 * 
 * Exemple : Affichage du bouton des paramètres uniquement pour les administrateurs ou chefs de projet.
 */

import { User } from "/js_class/user.js";

let currentUser = null;

/**
 * @brief Écouteur principal chargé au chargement du DOM pour vérifier les permissions.
 * 
 * Cette fonction récupère les informations de l'utilisateur connecté et ajuste l'interface
 * en fonction de ses permissions globales. Par exemple, seuls les administrateurs et chefs
 * de projet peuvent voir le bouton des paramètres.
 */
document.addEventListener("DOMContentLoaded", async () => {
    const settingsButton = document.querySelector(".settings-btn");

    // Récupérer les données utilisateur
    currentUser = await User.fetchUserData();

    // Vérification des données utilisateur récupérées
    if (currentUser) {
        console.log("Utilisateur connecté : (permissions.js)");
        currentUser.displayInfo();
    } else {
        console.error(
            "Aucun utilisateur connecté ou erreur lors de la récupération des données."
        );
    }

    // Récupération de l'ID du projet sélectionné depuis le localStorage
    const selectedProjectId = localStorage.getItem("selectedProjectId");
    console.log("selectedProjectId : " + selectedProjectId);

    /**
     * @brief Vérification des permissions de l'utilisateur.
     * 
     * Si l'utilisateur est un administrateur ou un chef de projet, le bouton des paramètres
     * est affiché. Ce contrôle permet de restreindre l'accès à certaines fonctionnalités.
     */
    if (currentUser.role === "Administrateur" || currentUser.role === "Chef de projet") {
        settingsButton.style.display = "block";
    }
});
