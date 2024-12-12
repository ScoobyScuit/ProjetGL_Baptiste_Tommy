import { Task } from "/js_class/task.js";
import { User } from "/js_class/user.js";

let currentUser = null;
let tasks = [];
let selectedDate = moment();

// ====================== INITIALISATION ======================
document.addEventListener("DOMContentLoaded", async () => {
  await initializeUser();
  initializeTabs();
  initializeModals();
  initializeTimeIndicator();

  createCalendar();
  createTimeline();
});

// ==================== INITIALISER UTILISATEUR ====================
async function initializeUser() {
  currentUser = await User.fetchUserData();
  if (currentUser) {
    console.log("Utilisateur connecté (calendar.js) :");
    currentUser.displayInfo();
  } else {
    console.error(
      "Aucun utilisateur connecté ou erreur lors de la récupération des données."
    );
  }

  const selectedProjectId = localStorage.getItem("selectedProjectId");
  console.log("selectedProjectId (calendar.js) : " + selectedProjectId);

  if (
    currentUser.role === "Administrateur" ||
    currentUser.role === "Chef de projet"
  ) {
    tasks = await Task.fetchTasksByProjectIdWithoutUser(
      parseInt(selectedProjectId)
    );
  } else {
    tasks = await Task.fetchTasksByProjectId(parseInt(selectedProjectId));
  }
}

// ========================= ONGLET =========================
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabButtons.length === 0 || tabContents.length === 0) {
    console.warn("Les éléments pour les onglets n'existent pas dans le DOM.");
    return;
  }

  tabButtons.forEach((button) => {
    // Ignorer le bouton "Ajouter une tâche" grâce à la classe "add-task-btn"
    if (button.classList.contains("add-task-btn")) return;

    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab");

      // Désactiver les onglets actifs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Activer le nouvel onglet
      button.classList.add("active");
      const tabContent = document.getElementById(`${tabName}-tab`);
      if (tabContent) tabContent.classList.add("active");

      if (tabName === "calendar") {
        createCalendar();
      } else {
        createTimeline();
      }
    });
  });
}

// ========================= MODAL =========================
function initializeModals() {
  const addTaskModal = document.getElementById("addTaskModal");
  const editTaskModal = document.getElementById("editTaskModal");

  // Fermer avec la croix
  document.querySelectorAll(".close").forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
      closeAddTaskModal();
    });
  });

  // Fermer le modal sur un clic en dehors du contenu
  window.addEventListener("click", (event) => {
    if (event.target === addTaskModal) {
      closeAddTaskModal();
    }
    if (event.target === editTaskModal) {
      closeEditTaskModal();
    }
  });
}

// ======================= CALENDRIER ========================
function createCalendar() {
  const calendarElement = document.getElementById("calendar");
  const startOfMonth = moment(selectedDate).startOf("month");
  const daysInMonth = moment(selectedDate).daysInMonth();
  const currentDate = moment();
  const colorBank = [
    "#C0A0BD",
    "#94A7AE",
    "#64766A",
    "#FBE0C3",
    "#FFBB98",
    "#7D8E95",
    "#344648",
    "#748B6F",
    "#2A403D",
    "#D05663",
  ];

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]; // En-tête des jours de la semaine

  // Construction du calendrier
  calendarElement.innerHTML = `
    <div class="scrollable-content">
      <!-- Boutons de navigation -->
      <div class="calendar-header">
        <button onclick="changeMonth(-1)">
          <i class="fa-solid fa-angles-left"></i> Précédent
        </button>
        <h2>${selectedDate.format("MMMM YYYY")}</h2>
        <button onclick="changeMonth(1)">
          Suivant <i class="fa-solid fa-angles-right"></i>
        </button>
      </div>
      <!-- En-tête des jours de la semaine -->
      <div class="calendar-week-header">
        ${daysOfWeek
          .map((day) => `<div class="calendar-week-day">${day}</div>`)
          .join("")}
      </div>
      <!-- Grille des jours -->
      <div class="calendar-grid">
        ${Array.from({ length: daysInMonth }, (_, i) => {
          const day = moment(startOfMonth).add(i, "days");
          const isActive = day.isSame(currentDate, "day");
          const isPast = day.isBefore(currentDate, "day");

          // Filtrer les tâches pour cette journée
          const tasksForDay = tasks.filter((task) =>
            day.isBetween(task.dateDebut, task.dateEcheance, null, "[]")
          );

          return `
            <div class="calendar-day${isActive ? " active" : ""}${
            isPast ? " past-date" : ""
          }" 
                data-date="${day.format("YYYY-MM-DD")}">
              <div class="calendar-date">${day.format("D")}</div>
              ${tasksForDay
                .map((task) => {
                  const isSingleDay = moment(task.dateDebut).isSame(
                    task.dateEcheance,
                    "day"
                  );
                  const taskClass = isSingleDay
                    ? "single-day-task"
                    : "multi-day-task";
                  const color =
                    task.couleur || colorBank[task.id % colorBank.length]; // Prioriser la couleur de la tâche
                  return `
                    <div class="calendar-task ${taskClass}" style="background-color: ${color};">
                      ${task.titre}
                    </div>`;
                })
                .join("")}
            </div>`;
        }).join("")}
      </div>
    </div>`;
}

// ========================= TIMELINE =========================
let filterPriority = ""; // Filtre de priorité
let filterStatus = ""; // Filtre de statut (toutes, terminées, en cours, en attente)

// Fonction pour définir la classe CSS de priorité
const getPriorityClass = (priority) => {
  if (priority == 1) return "priority-1"; // Haute priorité
  if (priority == 2) return "priority-2"; // Moyenne priorité
  if (priority == 3) return "priority-3"; // Basse priorité
  return "";
};

async function createTimeline() {
  const timelineContent = document.getElementById("timeline-content");
  const today = selectedDate.format("YYYY-MM-DD");

  // Filtrer les tâches par plage de dates, priorité et statut
  const filteredTasks = tasks.filter((task) => {
    const taskStartDate = moment(task.dateDebut); // Date de début
    const taskEndDate = moment(task.dateEcheance); // Date d'échéance
    const selectedDay = moment(selectedDate.format("YYYY-MM-DD")); // Date sélectionnée

    // Vérification si la date sélectionnée est entre dateDebut et dateEcheance
    const isInRange = selectedDay.isBetween(
      taskStartDate,
      taskEndDate,
      "days",
      "[]"
    );

    // Assurez-vous que les propriétés sont des chaînes sans espaces
    const taskPriority = task.priorite ? task.priorite.toString().trim() : "";
    const taskStatus = task.statut ? task.statut.toLowerCase().trim() : "";

    const matchesPriority =
      filterPriority === "" || taskPriority === filterPriority;
    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "terminées" && taskStatus === "terminée") ||
      (filterStatus === "non-terminées" && taskStatus !== "terminée");

    return isInRange && matchesPriority && matchesStatus;
  });

  // Générer le contenu de la timeline
  timelineContent.innerHTML = `
    <div class="day-header">
      <h3>${selectedDate.format("dddd, DD MMMM YYYY")}</h3>
      <div>
        <!-- Filtre par priorité -->
        <label for="filter-priority">Filtrer par priorité :</label>
        <select id="filter-priority">
          <option value="">Toutes</option>
          <option value="1" ${
            filterPriority === "1" ? "selected" : ""
          }>1 - Haute</option>
          <option value="2" ${
            filterPriority === "2" ? "selected" : ""
          }>2 - Moyenne</option>
          <option value="3" ${
            filterPriority === "3" ? "selected" : ""
          }>3 - Basse</option>
        </select>

        <!-- Filtre par statut -->
        <label for="filter-status">Filtrer par statut :</label>
        <select id="filter-status">
          <option value="">Tous</option>
          <option value="terminées" ${
            filterStatus === "terminées" ? "selected" : ""
          }>Terminées</option>
          <option value="non-terminées" ${
            filterStatus === "non-terminées" ? "selected" : ""
          }>Non Terminées</option>
        </select>
      </div>
    </div>
    <div class="task-list">
      ${
        filteredTasks.length > 0
          ? filteredTasks
              .map(
                (task) => `
                  <div class="task-item">
                    <div class="task-details">
                      <h4>
                        ${task.titre}
                        <span class="priority-indicator ${getPriorityClass(
                          task.priorite
                        )}"></span>
                      </h4>
                      <p>${task.description}</p>
                      <p><strong>Statut :</strong> ${task.statut}</p>
                      <p><strong>Priorité :</strong> ${task.priorite}</p>
                      <p><strong>Date de début :</strong> ${task.dateDebut}</p>
                      <p><strong>Date d'échéance :</strong> ${
                        task.dateEcheance
                      }</p>
                    </div>
                  </div>
                `
              )
              .join("")
          : "<p>Aucune tâche pour cette période.</p>"
      }
    </div>`;

  // Ajouter les écouteurs d'événements pour les filtres
  document.getElementById("filter-priority").addEventListener("change", (e) => {
    filterPriority = e.target.value;
    createTimeline(); // Rafraîchir la timeline
  });

  document.getElementById("filter-status").addEventListener("change", (e) => {
    filterStatus = e.target.value;
    createTimeline(); // Rafraîchir la timeline
  });
}

// ================== METTRE À JOUR CALENDRIER ET TIMELINE ==================
export async function updateCalendarAndTimeline() {
  try {
    const selectedProjectId = localStorage.getItem("selectedProjectId");

    // Recharger les tâches depuis le serveur
    if (
      currentUser.role === "Administrateur" ||
      currentUser.role === "Chef de projet"
    ) {
      tasks = await Task.fetchTasksByProjectIdWithoutUser(
        parseInt(selectedProjectId)
      );
    } else {
      tasks = await Task.fetchTasksByProjectId(parseInt(selectedProjectId));
    }

    // Rafraîchir l'affichage du calendrier et de la timeline
    createCalendar();
    createTimeline();

    console.log("Calendrier et timeline mis à jour avec succès !");
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du calendrier et de la timeline :",
      error
    );
  }
}

// ====================== CHANGER DE MOIS =====================
function changeMonth(delta) {
  selectedDate.add(delta, "month");
  createCalendar();
  createTimeline();
}

// ================= INDICATEUR DE TEMPS ====================
function initializeTimeIndicator() {
  function updateIndicator() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const hoursContainer = document.querySelector(".hours");

    if (hoursContainer) {
      let indicator = document.querySelector(".current-time-indicator");
      if (!indicator) {
        indicator = document.createElement("div");
        indicator.className = "current-time-indicator";
        hoursContainer.appendChild(indicator);
      }

      indicator.style.left = `${
        ((currentHour * 60 + currentMinute) / (24 * 60)) * 100
      }%`;
      setTimeout(updateIndicator, 60000);
    }
  }
  updateIndicator();
}

// ================= Affiche et ferme la fenetre d'ajout de taches
function openAddTaskModal() {
  const addTaskModal = document.getElementById("addTaskModal");
  if (addTaskModal) {
    addTaskModal.style.display = "block";
  } else {
    console.error("L'élément addTaskModal n'existe pas dans le DOM.");
  }
}

function closeAddTaskModal() {
  const modal = document.getElementById("addTaskModal");
  if (modal) {
    modal.style.display = "none";
  } else {
    console.error("L'élément addTaskModal n'existe pas dans le DOM.");
  }
}

// Rendre la fonction accessible globalement
window.closeAddTaskModal = closeAddTaskModal;
// Rendre la fonction accessible globalement
window.openAddTaskModal = openAddTaskModal;
// Rendre la fonction accessible globalement
window.changeMonth = changeMonth;
