<?php
if (isset($_COOKIE['session_user'])) {
    session_id($_COOKIE['session_user']);
    session_start();

    if (isset($_SESSION['user_id'], $_SESSION['name'])) {
    } else {
        header("Location: /login/index.php");
        exit();
    }
} else {
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
    <!-- profil style -->
    <link rel="stylesheet" href="/fichiers_include_PHP/profil/css/profil.css" />
    <!-- navbar style -->
    <link rel="stylesheet" href="/dashboard/css/board.css" />
    <link rel="stylesheet" href="/dashboard/indicateur/indicator.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
  </head>

  <body id="profile-page">
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
          <button class="settings-btn"
           onclick="location.href = '/fichiers_include_PHP/parametre/settings.php';"
           style="display: none;">
            <i class="fa-solid fa-gear"></i>
          </button>
          <button
            id="profile-btn"
            class="nav-btn profile-btn"
            onclick="location.href = '/fichiers_include_PHP/profil/profil.php';"
          >
            <i class="fa-solid fa-user"></i>
          </button>
        </div>
      </nav>
      <!-- End Navbar -->

      <h1>Profil Utilisateur</h1>
      <div class="detailProfil-container">
        <div id="profile-info" class="profile-info"></div>
      </div>
      <button
        class="logout-btn"
        onclick="window.location.href = '/logout/logout.php';"
      >
        Déconnexion
      </button>
    </div>

    <script type="module">
      import { User } from "/js_class/user.js";
      (async () => {
        const currentUser = await User.fetchUserData();
        if (currentUser) {
          // Afficher les informations utilisateur dans le div
          const profileInfoDiv = document.getElementById("profile-info");
          profileInfoDiv.innerHTML = `
                        <div class="profile-line"><strong>Nom :</strong> <span>${currentUser.nom}</span></div>
                        <div class="profile-line"><strong>Prénom :</strong><span>${currentUser.prenom}</span></div>
                        <div class="profile-line"><strong>Email :</strong><span>${currentUser.email}</span></div>
                        <div class="profile-line"><strong>ID :</strong><span>${currentUser.id}</span></div>
                        <div class="profile-line"><strong>Rôle :</strong><span>${currentUser.role}</span></div>
                    `;
        } else {
          console.log("Aucun utilisateur connecté.");
        }
      })();
    </script>
    <script type="module" src="/dashboard/permissions.js"></script>
    <script
      src="https://kit.fontawesome.com/cd0d448035.js"
      crossorigin="anonymous"
    ></script>
  </body>
</html>
