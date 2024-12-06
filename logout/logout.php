<?php
// Page de déconnexion : permet de fermer et effacer la session en cours

    session_start();
    session_destroy(); // Détruit la session actuelle
    header("Location: /login/index.html"); // Redirige vers la page de connexion
    exit();
?>
