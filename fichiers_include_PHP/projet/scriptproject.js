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

  const projectsListDiv = document.getElementById("projects-list"); // Conteneur des projets

  // Récupérer les données utilisateur
  currentUser = await User.fetchUserData();

  // Afficher les boutons si l'utilisateur est Administrateur ou Chef de projet
  if (
    currentUser.role === "Administrateur" ||
    currentUser.role === "Chef de projet"
  ) {
    addProjectButton.classList.remove("hidden");
    deleteProjectButton.classList.remove("hidden");
  }

  /**
   * @brief Fonction pour afficher les projets en fonction du rôle utilisateur.
   */
  async function displayProjects() {
    let projects = [];

    // Vérifier le rôle pour choisir la méthode de récupération
    if (currentUser.role === "Administrateur") {
      projects = await Project.fetchAllProjectData();
    } else {
      projects = await Project.fetchProjectData();
    }

    // Afficher les projets dans le DOM
    if (projects.length > 0) {
      projectsListDiv.innerHTML = ""; // Nettoyer le conteneur

      projects.forEach((project) => {
        const projectDiv = document.createElement("div");
        projectDiv.className = "project-item";

        projectDiv.innerHTML = `
          <strong>ID du projet:</strong> ${project.id} <br>
          <strong>Nom du projet:</strong> ${project.nom} <br>
          <strong>Description:</strong> ${project.description} <br>
          <strong>Date de début:</strong> ${project.dateDebut} <br>
          <strong>Date de fin:</strong> ${project.dateFin} <br>
          <strong>ID du chef:</strong> ${project.idChef} <br>
        `;

        projectsListDiv.appendChild(projectDiv);
      });
    } else {
      projectsListDiv.innerHTML = "<p>Aucun projet trouvé.</p>";
    }
  }

  // Appeler l'affichage des projets après récupération des données utilisateur
  displayProjects();

  /**
   * @brief Fonction pour obtenir la date actuelle au format YYYY-MM-DD.
   */
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * @brief Gestionnaire d'événement pour ouvrir le formulaire d'ajout de projet.
   */
  addProjectButton.addEventListener("click", () => {
    addProjectModal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="closeProjectModal">&times;</span>
      <h2>Ajouter un projet</h2>
      <form id="project-form">
        <label for="project-name">Nom du projet</label>
        <input type="text" id="project-name" required>

        <label for="project-description">Description</label>
        <textarea id="project-description" required></textarea>

        <label for="project-start-date">Date de début</label>
        <input type="date" id="project-start-date" value="${getCurrentDate()}" required>

        <label for="project-end-date">Date de fin</label>
        <input type="date" id="project-end-date" value="${getCurrentDate()}" required>

        <label for="project-id-chief">ID du chef du projet</label>
        <input type="number" id="project-id-chief" value="${
          currentUser.id
        }" required>

        <button type="submit">Ajouter le projet</button>
      </form>
    </div>
  `;
    addProjectModal.style.display = "block";

    // Fermer le modal
    document
      .getElementById("closeProjectModal")
      .addEventListener("click", () => {
        addProjectModal.style.display = "none";
      });

    // Variable pour stocker l'ID du chef
    let selectedProjectChiefId = currentUser.id;

    // Écouteur pour détecter les changements dans le champ ID du chef de projet
    const projectIdChiefInput = document.getElementById("project-id-chief");
    projectIdChiefInput.addEventListener("input", (event) => {
      selectedProjectChiefId = event.target.value;
      console.log(
        `Nouvelle valeur de l'ID du chef : ${selectedProjectChiefId}`
      );
    });

    // Soumission du formulaire
    document
      .getElementById("project-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const projectName = document.getElementById("project-name").value;
        const projectDescription = document.getElementById(
          "project-description"
        ).value;
        const projectStartDate =
          document.getElementById("project-start-date").value;
        const projectEndDate =
          document.getElementById("project-end-date").value;

        // Utiliser la valeur mise à jour pour l'ID du chef
        const newProject = new Project(
          null,
          projectName,
          projectDescription,
          projectStartDate,
          projectEndDate,
          selectedProjectChiefId // Valeur dynamique
        );

        const success = await newProject.addProject();

        if (success) {
          addProjectModal.style.display = "none";
          location.reload();
        } else {
          alert("Erreur lors de l'ajout du projet.");
        }
      });
  });
});
