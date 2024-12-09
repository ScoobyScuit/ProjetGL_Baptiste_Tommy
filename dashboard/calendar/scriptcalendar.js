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
    console.error("Aucun utilisateur connecté ou erreur lors de la récupération des données.");
  }

  const selectedProjectId = localStorage.getItem("selectedProjectId");
  console.log("selectedProjectId (calendar.js) : " + selectedProjectId);

  if (currentUser.role === "Administrateur" || currentUser.role === "Chef de projet") {
    tasks = await Task.fetchTasksByProjectIdWithoutUser(parseInt(selectedProjectId));
  } else {
    tasks = await Task.fetchTasksByProjectId(parseInt(selectedProjectId));
  }
  console.log("========== Calendar.js");
  Task.displayTasks(tasks);
}

  /**
   * @brief Récupère le nom d'utilisateur à partir de son ID.
   * @param userId L'ID de l'utilisateur.
   * @return Le nom complet de l'utilisateur ou "Inconnu" s'il n'existe pas.
   */
  async function getUserNameById(userId) {
    // Exemple d'une fonction pour récupérer le nom d'utilisateur
    const user = await User.fetchUserById(userId); // Remplacez par votre propre méthode
    console.log("User : " + Object.keys(user));
    return user?.NomUser + " " + user?.PrenomUser || "Inconnu";
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

  document.querySelectorAll(".close").forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
      if (addTaskModal) addTaskModal.style.display = "none";
      if (editTaskModal) editTaskModal.style.display = "none";
    });
  });
}

// ======================= CALENDRIER ========================
function createCalendar() {
  const calendarElement = document.getElementById("calendar");
  const startOfMonth = moment(selectedDate).startOf("month");
  const daysInMonth = moment(selectedDate).daysInMonth();
  const currentDate = moment();

  calendarElement.innerHTML = `
  <div class="scrollable-content">
    <div class="calendar-header">
      <button onclick="changeMonth(-1)"><i class="fa-solid fa-angles-left"></i> Précédent</button>
      <h2>${selectedDate.format("MMMM YYYY")}</h2>
      <button onclick="changeMonth(1)">Suivant <i class="fa-solid fa-angles-right"></i></button>
    </div>
    <div class="calendar-grid">
      ${Array.from({ length: daysInMonth }, (_, i) => {
        const day = moment(startOfMonth).add(i, "days");
        const isActive = day.isSame(currentDate, "day");
        const tasksForDay = tasks.filter(task => moment(day).isBetween(task.startDate, task.endDate, null, "[]"));

        return `
          <div class="calendar-day${isActive ? " active" : ""}" data-date="${day.format("YYYY-MM-DD")}">
            ${day.format("D")}
            ${tasksForDay.map(task => `<div class="calendar-task">${task.name}</div>`).join("")}
          </div>`;
      }).join("")}
    </div>
    </div>`;
}

// ========================= TIMELINE =========================
let filterPriority = ""; // Variable pour stocker la priorité sélectionnée

async function createTimeline() {
  const timelineContent = document.getElementById("timeline-content");
  const today = selectedDate.format("YYYY-MM-DD");

  // Filtrer les tâches pour la date sélectionnée ET la priorité sélectionnée
  const filteredTasks = tasks.filter(task => {
    const taskDate = moment(task.DateEchTask).format("YYYY-MM-DD");
    return taskDate === today && (filterPriority === "" || task.priorite == filterPriority);
  });

  // Fonction pour définir la couleur de la pastille
  const getPriorityClass = (priority) => {
    if (priority == 1) return "priority-1";
    if (priority == 2) return "priority-2";
    if (priority == 3) return "priority-3";
    return "";
  };

  // Ajouter le filtre de priorité et les tâches
  timelineContent.innerHTML = `
    <div class="day-header">
      <h3>${selectedDate.format("dddd, DD MMMM YYYY")}</h3>
      <div>
        <label for="filter-priority">Filtrer par priorité :</label>
        <select id="filter-priority">
          <option value="">Toutes</option>
          <option value="1" ${filterPriority === "1" ? "selected" : ""}>1 - Haute</option>
          <option value="2" ${filterPriority === "2" ? "selected" : ""}>2 - Moyenne</option>
          <option value="3" ${filterPriority === "3" ? "selected" : ""}>3 - Basse</option>
        </select>
      </div>
    </div>
    <div class="task-list">
      ${
        filteredTasks.length > 0
          ? filteredTasks
              .map(
                task => `
                  <div class="task-item">
                    <div class="task-details">
                      <h4>
                        ${task.titre}
                        <span class="priority-indicator ${getPriorityClass(task.priorite)}"></span>
                      </h4>
                      <p>${task.description}</p>
                      <p><strong>Statut :</strong> ${task.statut}</p>
                      <p><strong>Priorité :</strong> ${task.priorite}</p>
                      <p><strong>Date de création :</strong> ${task.dateDebut}</p>
                      <p><strong>Date d'échéance :</strong> ${task.dateEcheance}</p>
                    </div>
                  </div>
                `
              )
              .join("")
          : "<p>Aucune tâche pour ce jour.</p>"
      }
    </div>`;

  // Ajouter l'écouteur d'événement pour le filtre
  document.getElementById("filter-priority").addEventListener("change", (e) => {
    filterPriority = e.target.value;
    createTimeline(); // Rafraîchir la timeline
  });
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

      indicator.style.left = `${(currentHour * 60 + currentMinute) / (24 * 60) * 100}%`;
      setTimeout(updateIndicator, 60000);
    }
  }
  updateIndicator();
}






// Affiche et ferme la fenetre d'ajout de taches
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

