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

  // Récupérer les données utilisateur
  currentUser = await User.fetchUserData();

  // Afficher les boutons si l'utilisateur est Administrateur ou Chef de projet
  if (currentUser.role === "Administrateur" || currentUser.role === "Chef de projet") {
    addProjectButton.classList.remove("hidden");
    deleteProjectButton.classList.remove("hidden");
  }

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
          <input type="number" id="project-id-chief" value="${currentUser.id}" readonly>

          <button type="submit">Ajouter le projet</button>
        </form>
      </div>
    `;
    addProjectModal.style.display = "block";

    // Fermer le modal
    document.getElementById("closeProjectModal").addEventListener("click", () => {
      addProjectModal.style.display = "none";
    });

    // Soumission du formulaire
    document.getElementById("project-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const projectName = document.getElementById("project-name").value;
      const projectDescription = document.getElementById("project-description").value;
      const projectStartDate = document.getElementById("project-start-date").value;
      const projectEndDate = document.getElementById("project-end-date").value;

      const newProject = new Project(null, projectName, projectDescription, projectStartDate, projectEndDate, currentUser.id);
      const success = await newProject.addProject();

      if (success) {
        addProjectModal.style.display = "none";
        location.reload();
      } else {
        alert("Erreur lors de l'ajout du projet.");
      }
    });
  });

  /**
   * @brief Gestionnaire d'événement pour ouvrir le modal de suppression d'un projet.
   */
  deleteProjectButton.addEventListener("click", () => {
    deleteProjectModal.innerHTML = `
      <div class="modal-content">
        <span class="close" id="closeDeleteModal">&times;</span>
        <h2>Supprimer un projet</h2>
        <form id="delete-project-form">
          <label for="project-id-delete">ID du projet à supprimer</label>
          <input type="number" id="project-id-delete" required>
          <button type="submit">Supprimer le projet</button>
        </form>
      </div>
    `;
    deleteProjectModal.className = "modal";
    deleteProjectModal.style.display = "block";

    // Fermer le modal
    document.getElementById("closeDeleteModal").addEventListener("click", () => {
      deleteProjectModal.style.display = "none";
    });

    // Gestion de la soumission pour suppression
    document.getElementById("delete-project-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const projectId = document.getElementById("project-id-delete").value;

      if (projectId) {
        const projectToDelete = new Project(projectId);
        const success = await projectToDelete.deleteProject();

        if (success) {
          alert("Projet supprimé avec succès !");
          deleteProjectModal.style.display = "none";
          location.reload();
        } else {
          alert("Erreur lors de la suppression du projet.");
        }
      }
    });
  });
});
