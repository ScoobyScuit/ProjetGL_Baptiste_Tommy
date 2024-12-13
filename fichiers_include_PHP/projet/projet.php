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
    <title>Profil Utilisateur</title>
    <!-- projet style -->
    <link rel="stylesheet" href="/fichiers_include_PHP/projet/css/projet.css" />
    <!-- navbar style -->
    <link rel="stylesheet" href="/dashboard/css/board.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body id="project-page">
    <div class="profile-container">
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
            onclick="location.href = '/fichiers_include_PHP/parametre/settings.php';"
            style="display: none"
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
      <h1>Projets utilisateur</h1>

      <div class="btn-project">
        <!-- Bouton pour Supprimer un projet -->
        

        <!-- Bouton pour ajouter un projet -->
        <button class="add-project-btn" id="openAddProjectModal">
            <i class="fa-solid fa-plus"></i> Ajouter un projet
          
        </button>

        <!-- Conteneur pour le formulaire modal -->
        <div id="addProjectModal" class="modal" style="display: none"></div>
      </div>
      <div id="projects-list" class="projects-list">
        <!-- Les projets seront insérés ici -->
      </div>
    </div>

    <!-- Import des modules avant les scripts inline -->
    <script type="module" src="/js_class/project.js"></script>
    <script type="module" src="/dashboard/permissions.js"></script>

    <script
      type="module"
      src="/fichiers_include_PHP/projet/scriptproject.js"
    ></script>
    <script
      src="https://kit.fontawesome.com/cd0d448035.js"
      crossorigin="anonymous"
    ></script>
  </body>
</html>