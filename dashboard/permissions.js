/**
 * @file permissions.js
 * @brief Ce fichier s'occupe des permissions GLOBALE des user
 * cad les permissions communes à tous les fichiers.
 * Si une permissions est spécifique à un fichier elle se fera dans ce fichier
 * ex : Ajout de tache
 */

import { Task } from "/js_class/task.js";
import { User } from "/js_class/user.js";

let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
    const settingsButton = document.querySelector(".settings-btn");


      // Récupérer les données utilisateur
    currentUser = await User.fetchUserData();

    if (currentUser) {
        console.log("Utilisateur connecté : (permissions.js)");
        currentUser.displayInfo();
    } else {
        console.error(
        "Aucun utilisateur connecté ou erreur lors de la récupération des données."
        );
    }

    // Récupérer l'ID du projet sélectionné depuis le localStorage
    const selectedProjectId = localStorage.getItem("selectedProjectId");
    console.log("selectedProjectId : " + selectedProjectId);

    // Vérifier si l'utilisateur est un administrateur ou un chef de projet
    if (currentUser.role === "Administrateur" || currentUser.role === "Chef de projet") {
        settingsButton.style.display = "block";
    }
})