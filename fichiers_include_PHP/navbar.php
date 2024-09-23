<!-- Fichier PHP contenant la navbar qui sera sur toutes les pages du site 
    inclue dans dashboard.php-->
<nav class="navbar">
    <div class="gestion-button-navbar">
        <button class="nav-btn dashboard-btn"><i class="fa-solid fa-house"></i>Dashboard</button>
        <button class="nav-btn project-btn"><i class="fa-regular fa-folder-closed"></i>Projet</button>
        <button class="nav-btn calendar-btn"><i class="fa-regular fa-calendar"></i>Calendriers</button>
    </div>
    <div class="settings">
        <button class="settings-btn"><i class="fa-solid fa-gear"></i></button>
        <button class="profil-btn" onclick="location.href = '../fichiers_include_PHP/profil/profil.html';">
            <i class="fa-solid fa-user"></i>
        </button>

    </div>
</nav>