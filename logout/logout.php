<?php
if (isset($_COOKIE['session_user'])) {
    // Charger la session spécifique
    session_id($_COOKIE['session_user']);
    session_start();

    // Réinitialiser et détruire la session
    $_SESSION = [];
    session_destroy();

    // Supprimer le cookie associé
    setcookie('session_user', '', time() - 3600, '/', '', true, true);

    // Redirection après déconnexion
    header("Location: /login/index.html");
    exit();
} else {
    header("Location: /login/index.html");
    exit();
}
?>