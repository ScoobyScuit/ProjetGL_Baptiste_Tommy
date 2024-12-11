/**
 * @file calendar.js
 * @brief Script pour la gestion du calendrier et de la timeline dans le tableau de bord.
 *
 * Ce script permet d'afficher un calendrier et une timeline des tâches
 * associées à un projet sélectionné, avec des filtres par priorité et statut.
 */

import { Task } from "/js_class/task.js";
import { User } from "/js_class/user.js";

let currentUser = null; /**< @brief Utilisateur actuel connecté. */
let tasks = []; /**< @brief Liste des tâches récupérées pour le projet sélectionné. */
let selectedDate = moment(); /**< @brief Date actuellement sélectionnée dans le calendrier. */

// ====================== INITIALISATION ======================

/**
 * @brief Point d'entrée principal qui initialise le script.
 *
 * Appelle les fonctions pour initialiser l'utilisateur, les onglets, les modals,
 * et les affichages du calendrier et de la timeline.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await initializeUser();
  initializeTabs();
  initializeModals();
  initializeTimeIndicator();

  createCalendar();
  createTimeline();
});

// ==================== INITIALISER UTILISATEUR ====================

/**
 * @brief Initialise les informations de l'utilisateur connecté et charge les tâches.
 *
 * En fonction du rôle de l'utilisateur (Admin ou Chef), toutes les tâches ou seulement
 * les tâches qui lui sont assignées sont récupérées.
 */
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
}

// ========================= ONGLET =========================

/**
 * @brief Initialise les boutons et le contenu des onglets (Calendrier/Timeline).
 *
 * Permet de basculer entre les vues Calendrier et Timeline.
 */
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabButtons.length === 0 || tabContents.length === 0) {
    console.warn("Les éléments pour les onglets n'existent pas dans le DOM.");
    return;
  }

  tabButtons.forEach((button) => {
    if (button.classList.contains("add-task-btn")) return; // Ignorer le bouton d'ajout de tâche

    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab");

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

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

/**
 * @brief Initialise les modals d'ajout et d'édition de tâche.
 *
 * Ajoute les gestionnaires d'événements pour fermer les modals.
 */
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

/**
 * @brief Crée et affiche le calendrier des tâches pour le mois sélectionné.
 */
function createCalendar() {
  const calendarElement = document.getElementById("calendar");
  const startOfMonth = moment(selectedDate).startOf("month");
  const daysInMonth = moment(selectedDate).daysInMonth();
  const currentDate = moment();
  const colorBank = ["#C0A0BD", "#94A7AE", "#64766A", "#FBE0C3", "#FFBB98"];

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  calendarElement.innerHTML = `
    <div class="scrollable-content">
      <div class="calendar-header">
        <button onclick="changeMonth(-1)"><i class="fa-solid fa-angles-left"></i> Précédent</button>
        <h2>${selectedDate.format("MMMM YYYY")}</h2>
        <button onclick="changeMonth(1)">Suivant <i class="fa-solid fa-angles-right"></i></button>
      </div>
      <div class="calendar-week-header">
        ${daysOfWeek.map((day) => `<div class="calendar-week-day">${day}</div>`).join("")}
      </div>
      <div class="calendar-grid">
        ${Array.from({ length: daysInMonth }, (_, i) => {
          const day = moment(startOfMonth).add(i, "days");
          const isActive = day.isSame(currentDate, "day");

          const tasksForDay = tasks.filter((task) =>
            day.isBetween(task.dateDebut, task.dateEcheance, null, "[]")
          );

          return `
            <div class="calendar-day${isActive ? " active" : ""}" 
                data-date="${day.format("YYYY-MM-DD")}">
              <div class="calendar-date">${day.format("D")}</div>
              ${tasksForDay
                .map((task) => `
                  <div class="calendar-task" style="background-color: ${
                    colorBank[task.id % colorBank.length]
                  };">${task.titre}</div>`)
                .join("")}
            </div>`;
        }).join("")}
      </div>
    </div>`;
}

// ========================= TIMELINE =========================

/**
 * @brief Crée et affiche la timeline des tâches pour la date sélectionnée.
 */
async function createTimeline() {
  const timelineContent = document.getElementById("timeline-content");

  const filteredTasks = tasks.filter((task) =>
    moment(selectedDate).isBetween(task.dateDebut, task.dateEcheance, null, "[]")
  );

  timelineContent.innerHTML = filteredTasks
    .map(
      (task) => `
        <div class="task-item">
          <h4>${task.titre}</h4>
          <p><strong>Statut :</strong> ${task.statut}</p>
          <p><strong>Priorité :</strong> ${task.priorite}</p>
        </div>`
    )
    .join("") || "<p>Aucune tâche pour cette date.</p>";
}

// ================== MISE À JOUR ==================

/**
 * @brief Met à jour les affichages du calendrier et de la timeline.
 */
export async function updateCalendarAndTimeline() {
  try {
    tasks = await Task.fetchTasksByProjectId(parseInt(localStorage.getItem("selectedProjectId")));
    createCalendar();
    createTimeline();
    console.log("Calendrier et timeline mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
}

// ====================== CHANGER DE MOIS =====================

/**
 * @brief Change le mois affiché dans le calendrier.
 * @param {number} delta - Nombre de mois à ajouter (positif ou négatif).
 */
function changeMonth(delta) {
  selectedDate.add(delta, "month");
  createCalendar();
  createTimeline();
}

// ====================== TEMPS ====================

/**
 * @brief Initialise l'indicateur de l'heure actuelle sur la timeline.
 */
function initializeTimeIndicator() {
  function updateIndicator() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const indicator = document.querySelector(".current-time-indicator");

    if (indicator) {
      indicator.style.left = `${
        ((currentHour * 60 + currentMinute) / (24 * 60)) * 100
      }%`;
    }
    setTimeout(updateIndicator, 60000);
  }
  updateIndicator();
}

// ================= EXPORT ====================
window.changeMonth = changeMonth;
