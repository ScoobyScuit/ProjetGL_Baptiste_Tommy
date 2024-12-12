import { Project } from "/js_class/project.js";
import { User } from "/js_class/user.js";

let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
  const addProjectButton = document.getElementById("openAddProjectModal");
  const deleteProjectButton = document.getElementById("deleteProjectModal");
  const addProjectModal = document.getElementById("addProjectModal");
  const deleteProjectModal = document.createElement("div");
  deleteProjectModal.id = "deleteProjectModalContent";
  document.body.appendChild(deleteProjectModal);

  const projectsListDiv = document.getElementById("projects-list");

  // Récupérer les données utilisateur
  try {
    currentUser = await User.fetchUserData();
    console.log("Utilisateur courant récupéré :", currentUser);

    // Afficher les boutons si l'utilisateur est Administrateur ou Chef de projet
    if (
      currentUser.role === "Administrateur" ||
      currentUser.role === "Chef de projet"
    ) {
      addProjectButton.classList.remove("hidden");
      if (deleteProjectButton) deleteProjectButton.classList.remove("hidden");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données utilisateur :",
      error
    );
    return;
  }

  /**
   * @brief Fonction pour afficher les projets.
   */
  async function displayProjects() {
    const projects =
      currentUser.role === "Administrateur"
        ? await Project.fetchAllProjectData()
        : await Project.fetchProjectData();

    // Récupérer l'ID du projet sélectionné depuis localStorage
    const selectedProjectId = localStorage.getItem("selectedProjectId");

    projectsListDiv.innerHTML = projects.length
      ? projects
          .map(
            (p) => `
        <div class="project-item ${
          selectedProjectId == p.id ? "selected" : ""
        }" data-project-id="${p.id}">
          <div class="project-icon">
            <i class="fa-solid fa-folder"></i>
          </div>
          <h3>${p.nom}</h3>
          <p>${p.description}</p>
          <strong>ID Chef:</strong> ${p.idChef}
          <button class="delete-project-btn" data-project-id="${p.id}">
            <i class="fa-solid fa-trash"></i> Supprimer
          </button>
        </div>
`
          )
          .join("")
      : "<p>Aucun projet trouvé.</p>";

    // Gestion de la sélection des projets
    document.querySelectorAll(".project-item").forEach((projectDiv) => {
      projectDiv.addEventListener("click", () => {
        const projectId = projectDiv.getAttribute("data-project-id");

        // Désélectionner tous les projets
        document
          .querySelectorAll(".project-item")
          .forEach((item) => item.classList.remove("selected"));

        // Ajouter la classe "selected" au projet sélectionné
        projectDiv.classList.add("selected");

        // Sauvegarder l'ID du projet dans localStorage
        localStorage.setItem("selectedProjectId", projectId);
        console.log(`Projet sélectionné : ${projectId}`);
      });
    });

    // Gestion des boutons de suppression
    document.querySelectorAll(".delete-project-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.stopPropagation(); // Empêcher le clic de sélectionner le projet
        const projectId = button.getAttribute("data-project-id");
        if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
          const projectToDelete = new Project(projectId);
          const success = await projectToDelete.deleteProject();
          if (success) {
            alert("Projet supprimé avec succès !");
            displayProjects();
          } else {
            alert("Erreur lors de la suppression du projet.");
          }
        }
      });
    });
  }


  /**
   * @brief Fonction pour obtenir la date actuelle au format YYYY-MM-DD 
   */
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Ajoute un zéro pour les mois < 10
    const day = String(today.getDate()).padStart(2, "0"); // Ajoute un zéro pour les jours < 10
    return `${year}-${month}-${day}`;
  }

  /**
   * @brief Gestionnaire d'événement pour ouvrir le formulaire d'ajout de projet.
   */
  addProjectButton.addEventListener("click", () => {
    addProjectModal.innerHTML = `
        <div class="modal-content flat-card">
          <span class="close" id="closeProjectModal">&times;</span>
          <h2 class="modal-title">Ajouter un projet</h2>
          <form id="project-form" class="flat-form">
            <label>Nom</label>
            <input type="text" id="project-name" required>
            
            <label>Description</label>
            <textarea id="project-description" required></textarea>
            
            <label>Date de début</label>
            <input type="date" id="project-start-date" 
            value="${getCurrentDate()}" required>
            
            <label>Date de fin</label>
            <input type="date" id="project-end-date" 
            value="${getCurrentDate()}" required>
            
            <label>ID Chef</label>
            <input type="number" id="project-id-chief" value="${
              currentUser.id
            }" required>
            
            <button type="submit" class="flat-button">Ajouter</button>
          </form>
        </div>
         `;

    addProjectModal.style.display = "block";
    document.body.classList.add("modal-open");

    document
      .getElementById("closeProjectModal")
      .addEventListener("click", () => {
        addProjectModal.style.display = "none";
        document.body.classList.remove("modal-open");
      });

    document
      .getElementById("project-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const newProject = new Project(
          null,
          document.getElementById("project-name").value,
          document.getElementById("project-description").value,
          document.getElementById("project-start-date").value,
          document.getElementById("project-end-date").value,
          document.getElementById("project-id-chief").value
        );

        const success = await newProject.addProject();
        if (success) {
          alert("Projet ajouté avec succès !");
          addProjectModal.style.display = "none";
          document.body.classList.remove("modal-open");
          displayProjects();
        } else {
          alert("Erreur lors de l'ajout du projet.");
        }
      });
  });

  // Initialisation des projets
  await displayProjects();
});
