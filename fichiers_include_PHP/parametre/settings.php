<?php


// Vérifiez si le cookie de session existe
if (isset($_COOKIE['session_user'])) {
    // Charge la session spécifique en fonction de l'ID
    session_id($_COOKIE['session_user']);
    session_start();

    // Vérifie si les données utilisateur sont présentes
    if (isset($_SESSION['user_id'], $_SESSION['name'])) {
    } else {
        // Session invalide ou expirée
        header("Location: /login/index.php");
        exit();
    }
} else {
    // Aucun cookie, redirection
    header("Location: /login/index.php");
    exit();
}

?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Paramètres</title>
    <link
      rel="stylesheet"
      href="/fichiers_include_PHP/parametre/css/settings.css"
    />
    <link rel="stylesheet" href="/dashboard/css/board.css" />
    <script
      src="https://kit.fontawesome.com/cd0d448035.js"
      crossorigin="anonymous"
    ></script>
  </head>

  <body>
    <div id="settings-page"></div>
    <!-- Start Navbar -->
    <nav class="navbar">
      <div class="gestion-button-navbar">
        <button
          class="nav-btn dashboard-btn"
          onclick="location.href = '/dashboard/dashboard.php';"
        >
          <i class="fa-solid fa-house"></i>Dashboard
        </button>
        <button
          class="nav-btn project-btn"
          onclick="location.href = '/fichiers_include_PHP/projet/projet.php';"
        >
          <i class="fa-regular fa-folder-closed"></i>Projet
        </button>
      </div>
      <div class="settings">
        <button
          class="settings-btn"
          style="display: none"
          onclick="location.href = '/fichiers_include_PHP/parametre/settings.php';"
        >
          <i class="fa-solid fa-gear"></i>
        </button>
        <button
          class="profil-btn"
          onclick="location.href = '/fichiers_include_PHP/profil/profil.php';"
        >
          <i class="fa-solid fa-user"></i>
        </button>
      </div>
    </nav>
    <!-- End Navbar -->

    <div class="settings-container">
      <h1>Paramètres</h1>

      <!-- Section : Modification des rôles -->
      <section class="role-management" style="display: none;">
        <h2>Modifier les rôles des utilisateurs</h2>
        <div id="role-form">
          <label for="user-select">Sélectionnez un utilisateur :</label>
          <select id="user-select"></select>

          <label for="role-select">Nouveau rôle :</label>
          <select id="role-select">
            <option value="Membre">Membre</option>
            <option value="Chef de projet">Chef de projet</option>
            <option value="Administrateur">Administrateur</option>
          </select>

          <button id="update-role-btn">Mettre à jour le rôle</button>
        </div>
      </section>

      <!-- Section : Assignation des tâches -->
      <section class="task-assignment">
        <h2>Assigner un utilisateur à une tâche</h2>
        <div id="task-form">
          <label for="task-select">Sélectionnez une tâche :</label>
          <select id="task-select"></select>

          <label for="assign-user-select">Utilisateur assigné :</label>
          <select id="assign-user-select"></select>

          <button id="assign-task-btn">Assigner la tâche</button>
        </div>
      </section>
    </div>

    <script type="module" src="/fichiers_include_PHP/parametre/js/settings.js"></script>
    <script type="module" src="/dashboard/permissions.js"></script>
  </body>
</html>
