<?php
// Vérifie si le cookie contenant l'ID de session existe
if (isset($_COOKIE['session_user'])) {
    session_id($_COOKIE['session_user']);
    session_start();

    // Vérifie si les informations de l'utilisateur sont présentes dans la session
    if (isset($_SESSION['user_id'], $_SESSION['name'])) {
    } else {
        // Session invalide, redirection vers la connexion
        header("Location: /login/index.php");
        exit();
    }
} else {
    // Aucun cookie de session, redirection vers la connexion
    header("Location: /login/index.php");
    exit();
}
?>



<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gestion de Projet</title>
  <link rel="stylesheet" href="/dashboard/css/board.css" />
  <link rel="stylesheet" href="/dashboard/indicateur/indicator.css" />
  <link rel="stylesheet" href="/dashboard/calendar/css/stylecalendar.css"/>
  <link rel="stylesheet" href="/dashboard/calendar/css/styledaycalendar.css"/>
  <link rel="stylesheet" href="/dashboard/calendar/css/styletimeline.css"/>
  <link rel="stylesheet" href="/dashboard/todolist/css/checkbox.css" />
  <link rel="stylesheet" href="/dashboard/todolist/css/styletodolist.css" />
  <link rel="stylesheet" href="/dashboard/todolist/css/addTask.css" />
  <script src="https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/interactjs@1.10.11/dist/interact.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
</head>

<body id="dashboard-page">
  <div class="dashboard">
    <!-- Start Navbar -->
    <nav class="navbar">
      <div class="gestion-button-navbar">
        <button class="nav-btn dashboard-btn">
          <i class="fa-solid fa-house"></i>Dashboard
        </button>
        <button class="nav-btn project-btn" onclick="location.href = '/fichiers_include_PHP/projet/projet.php';">
          <i class="fa-regular fa-folder-closed"></i>Projet
        </button>

      </div>
      <div class="settings">
        <button class="settings-btn" style="display: none;" onclick="location.href = '/fichiers_include_PHP/parametre/settings.php';">
          <i class="fa-solid fa-gear"></i>
        </button>
        <button class="profil-btn" onclick="location.href = '/fichiers_include_PHP/profil/profil.php';">
          <i class="fa-solid fa-user"></i>
        </button>
      </div>
    </nav>
    <!-- End Navbar -->

    <!-- Start Dashboard container -->
    <div class="main-dashboard">
      <!-- Start progress indicator -->
      <div class="all-progress">
        <div class="indicator-progress">
          <div class="title-indicator-progress">
            <h2>Progress Projet</h2>
          </div>
          <div class="progress-container">
            <svg width="100%" height="100%" viewBox="0 0 450 250">
              <path class="progress-background" d="M50 200 A150 150 0 0 1 400 200" />
              <path class="progress-bar" d="M50 200 A150 150 0 0 1 400 200" id="progressBar" />
              <circle class="start-point" cx="50" cy="200" r="7%" id="startPoint" />
              <text class="progress-text" x="225" y="200" text-anchor="middle" id="progressText">
                0%
              </text>
            </svg>
          </div>
        </div>

        <!-- Start Todolist -->
        <div class="todolist">
          <div class="container-todolist">
            <h1>Liste de tâches :</h1>

            <!-- Formulaire d'ajout de tâche -->
            <div id="addTaskModal" class="modal" style="display:none;"></div>

            <!-- Options de filtrage -->
            <div id="filter-options">
              <button class="filter-btn active" data-filter="all">Toutes</button>
              <button class="filter-btn" data-filter="active">Actives</button>
              <button class="filter-btn" data-filter="completed">Terminées</button>
            </div>

            <!-- Liste des tâches -->
            <ul id="task-list"></ul>

            <!-- Informations sur une tâche -->
            <div id="task-info" class="task-info">
              Cliquez sur une tâche pour afficher ses informations ici.
            </div>

            <!-- Modal pour afficher les détails d'une tâche -->
            <div id="taskInfoModal" class="modal">
              <div class="modal-content">
                <span class="close" id="close-modal-btn">&times;</span>
                <div id="task-info-modal-content">
                  <!-- Les informations de la tâche seront injectées ici -->
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- End Todolist -->
      </div>
      <!-- End progress indicator -->

      <!-- Start calendar -->
      <div class="calendar-progress">
        <div class="tab-container">
          <button class="tab-button active" data-tab="timeline">
            <div class="buttondesign">
              <i class="fa-solid fa-timeline"></i>Timeline
            </div>
          </button>
          <button class="tab-button" data-tab="calendar">
            <div class="buttondesign">
              <i class="fa-solid fa-calendar-week"></i>Calendrier
            </div>
          </button>
          <!-- Bouton d'ajout de tâche -->
          <button class="add-task-btn hidden" id="openAddTaskModal" onclick="openAddTaskModal()">
            <div class="buttondesign">
              <i class="fa-solid fa-plus"></i>Ajouter une tâche
            </div>
          </button>
        </div>
        <div class="container-timeline">
          <div id="timeline-tab" class="timeline-tab tab-content active">
            <div class="timeline">
              <div id="timeline-content" class="timeline-content"></div>
            </div>
          </div>
          <div id="calendar-tab" class="calendar-tab tab-content">
            <div id="calendar" class="calendar"></div>
          </div>
        </div>
      </div>
      <!-- End calendar -->
    </div>
    <!-- End Dashboard container -->

    <!-- Inclusion des scripts -->
    <script type="module" src="/dashboard/todolist/scripttodolist.js"></script>
    <script type="module" src="/dashboard/calendar/scriptcalendar.js"></script>
    <script type="module" src="/dashboard/indicateur/scriptindicator.js"></script>
    <script type="module" src="/dashboard/permissions.js"></script>
    <script src="https://kit.fontawesome.com/cd0d448035.js" crossorigin="anonymous"></script>
  </div>
</body>

</html>