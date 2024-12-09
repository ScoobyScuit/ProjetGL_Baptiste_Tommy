/**
 * @file script.js
 * @brief Script principal pour la gestion des tâches et des commentaires dans un projet.
 */

import { Task } from "/js_class/task.js";
import { User } from "/js_class/user.js";
import { Comments } from "/js_class/comments.js";
import { sendProgress } from '/dashboard/indicateur/scriptindicator.js';

let currentUser = null;
let isEditing = false; // Variable pour suivre l'état du formulaire (ajout ou modification)
let editingTask = null; // Stocke la tâche actuellement modifiée

document.addEventListener("DOMContentLoaded", async () => {
  const taskList = document.getElementById("task-list");
  const filterOptions = document.getElementById("filter-options");
  const closeModalBtn = document.getElementById("close-modal-btn");

  // Récupérer les données utilisateur
  currentUser = await User.fetchUserData();

  if (currentUser) {
    console.log("Utilisateur connecté :");
    currentUser.displayInfo();
    createTaskFormModal(currentUser);
  } else {
    console.error(
      "Aucun utilisateur connecté ou erreur lors de la récupération des données."
    );
  }

  // Récupérer l'ID du projet sélectionné depuis le localStorage
  const selectedProjectId = localStorage.getItem("selectedProjectId");
  console.log("selectedProjectId : " + selectedProjectId);

  // Vérifier si l'utilisateur est un administrateur ou un chef de projet
  let tasks = [];
  if (currentUser.role === "Administrateur" || currentUser.role === "Chef de projet") {
    // Si l'utilisateur est admin ou chef de projet, récupérer toutes les tâches du projet
    tasks = await Task.fetchTasksByProjectIdWithoutUser(parseInt(selectedProjectId));
  } else {
    // Sinon, récupérer uniquement les tâches assignées à l'utilisateur
    tasks = await Task.fetchTasksByProjectId(parseInt(selectedProjectId));
  }

  calculateTaskProgress();

  let currentFilter = "all";

  /**
   * @brief Gère l'ajout d'un commentaire à une tâche.
   * @param taskId L'ID de la tâche à laquelle le commentaire doit être ajouté.
   */
  async function handleAddComment(taskId) {
    const newCommentInput = document.getElementById("new-comment");
    const commentContent = newCommentInput.value.trim();

    if (!commentContent) {
      alert("Le commentaire ne peut pas être vide.");
      return;
    }

    try {
      // Utilisez la méthode `addComment` pour ajouter le commentaire
      const success = await Comments.addComment(
        currentUser.id,
        taskId,
        commentContent
      );

      if (success) {
        console.log("Commentaire ajouté avec succès.");

        // Effacer le champ de saisie
        newCommentInput.value = "";

        // Rechargez les commentaires dans le modal
        await displayTaskCommentsInModal(taskId);
      } else {
        console.error("Erreur lors de l'ajout du commentaire.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
    }
  }

  /**
   * @brief Ajoute un gestionnaire d'événements pour le bouton "Ajouter un commentaire".
   */
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "add-comment-button") {
      const modalContent = document.getElementById("task-info-modal-content");
      const taskId = parseInt(modalContent.dataset.taskId);
      console.log("Récupération de l'ID de la tâche :", taskId);

      if (!isNaN(taskId)) {
        handleAddComment(taskId);
      } else {
        console.error("Impossible de trouver l'ID de la tâche.");
      }
    }
  });

  /**
   * @brief Affiche les informations d'une tâche dans un modal.
   * @param task La tâche à afficher.
   */
  function showTaskInfo(task) {
    const modal = document.getElementById("taskInfoModal");
    const modalContent = document.getElementById("task-info-modal-content");

    // Injecter les informations de la tâche dans le modal
    modalContent.innerHTML = `
    <div class="scrollable-content">
      <h3>Détails de la tâche</h3>
      <div id="contentDetail"  >
        <p><strong>Titre :</strong> ${task.titre}</p>
        <p><strong>Description :</strong> ${task.description}</p>
        <p><strong>Statut :</strong> ${task.statut}</p>
        <p><strong>Priorité :</strong> ${task.priorite}</p>
        <p><strong>Date de création :</strong> ${task.dateDebut}</p>
        <p><strong>Date d'échéance :</strong> ${task.dateEcheance}</p>
        <p><strong>ID Projet :</strong> ${task.idProjet}</p>
        <p><strong>ID Utilisateur :</strong> ${task.idUser}</p><br>
      </div>
      <h3>Commentaires</h3>
      <div id="contentComments">
        <ul id="comments-list-modal"></ul>
      </div>
      <textarea id="new-comment" placeholder="Ajoutez un commentaire..."></textarea>
      <button id="add-comment-button">Ajouter</button>
    </div>
  `;

    // Définir l'ID de la tâche dans un attribut dataset
    modalContent.dataset.taskId = task.id;

    // Charger et afficher les commentaires
    displayTaskCommentsInModal(task.id);

    // Afficher le modal
    modal.style.display = "block";
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

  /**
   * @brief Affiche les commentaires d'une tâche dans le modal.
   * @param taskId L'ID de la tâche.
   */
  async function displayTaskCommentsInModal(taskId) {
    const comments = await Comments.fetchCommentsByTaskId(taskId); // Récupère les commentaires
    const commentsList = document.getElementById("comments-list-modal");

    commentsList.innerHTML = ""; // Réinitialiser la liste des commentaires

    for (const comment of comments) {
      // Récupérer le nom d'utilisateur à partir de l'ID utilisateur
      const userName = await getUserNameById(comment.idUser);

      // Créer un élément de liste pour afficher le commentaire
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>Utilisateur ${comment.idUser || "Inconnu"} (${
        userName || "Inconnu"
      }) :</strong> 
        ${comment.contenu || "Pas de contenu"}
      `;
      commentsList.appendChild(li);
    }
  }

  /**
   * @brief Crée un élément de liste représentant une tâche.
   * @param task La tâche à afficher.
   * @param index L'index de la tâche dans la liste.
   * @return L'élément de liste créé.
   */
  function createTaskItem(task, index) {
    const li = document.createElement("li");
    li.innerHTML = `
          <span class="task-text ${
            task.statut === "Terminée" ? "Terminée" : ""
          }">
              ${task.titre}
          </span>
          <div class="task-actions">
              ${
                currentUser.role === "Administrateur" ||
                currentUser.role === "Chef de projet"
                  ? `
              <button class="edit-btn" data-index="${index}"> <!-- Edit -->
                  <i class="fa-solid fa-pen-to-square"></i>
              </button>`
                  : ""
              }
              <button class="completed-btn" data-index="${index}"> <!-- Completed -->
                  <i class="fa-solid fa-check"></i>
              </button>
              ${
                currentUser.role === "Administrateur" ||
                currentUser.role === "Chef de projet"
                  ? `
              <button class="delete-btn" data-index="${index}"> <!-- Delete -->
                  <i class="fa-regular fa-trash-can"></i>
              </button>`
                  : ""
              }
          </div>
      `;

    // Attacher un gestionnaire pour afficher les infos de la tâche
    li.addEventListener("click", () => showTaskInfo(task, li));

        // Attacher un gestionnaire de clic pour le bouton "delete"
        const deleteBtn = li.querySelector(".delete-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", async (e) => {
            e.stopPropagation(); // Empêcher le clic sur le <li>
    
            console.log("Bouton cliqué. Tâche en cours de suppression :", task);
    
            try {
              const success = await task.deleteTask();
              console.log("Résultat de task.deleteTask():", success);
    
              if (success) {
                tasks.splice(index, 1);
                renderTasks();

                // Calcul du pourcentage d'avancement des taches
                calculateTaskProgress();

                console.log(
                  "Tâche supprimée avec succès. Liste des tâches mise à jour."
                );
              } else {
                console.error("Échec de la suppression de la tâche.");
              }
            } catch (error) {
              console.error("Erreur lors du clic sur le bouton supprimer :", error);
            }
          });
        }

    // Attacher un gestionnaire de clic pour le bouton "completed"
    const completedBtn = li.querySelector(".completed-btn");
    if (completedBtn) {
      completedBtn.addEventListener("click", async (e) => {
        e.stopPropagation(); // Empêcher le clic sur le <li>

        console.log("Bouton cliqué. Tâche en cours de modification :", task);

        try {
          // Mettre à jour le statut de la tâche en "Terminée"
          const success = await task.updateStatus("Terminée");
          console.log("Résultat de task.updateStatus():", success);

          if (success) {
            task.statut = "Terminée"; // Mettre à jour localement l'état de la tâche
            renderTasks(); // Actualiser la liste des tâches
            
            // Calcul du pourcentage d'avancement des taches
            calculateTaskProgress();

            console.log("Statut de la tâche mis à jour en 'Terminée'.");
          } else {
            console.error("Échec de la mise à jour du statut de la tâche.");
          }
        } catch (error) {
          console.error(
            "Erreur lors du clic sur le bouton 'Terminée' :",
            error
          );
        }
      });
    }

    // Attacher un gestionnaire de clic pour le bouton "edit"
    const editBtn = li.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêcher le clic sur le <li>

        console.log("Bouton cliqué. Tâche en cours d'édition :", task);

        // Ouvrir le formulaire de modification et pré-remplir les champs avec les données existantes
        openEditTaskModal(task);
      });
    }

    return li;
  }


  function calculateTaskProgress() {
    // Calcul du pourcentage d'avancement des taches
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.statut === "Terminée").length;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
    console.log(`Progression du projet : ${progressPercentage}`);
    // envoyer au webSocket
    sendProgress(progressPercentage);
  }

  /**
   * @brief Ouvre le formulaire pour ajouter une nouvelle tâche.
   * @param currentUser L'utilisateur actuellement connecté.
   */
  function createTaskFormModal(currentUser) {
    const modal = document.getElementById("addTaskModal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeAddTaskModal()">&times;</span>
            <h2>Ajouter une nouvelle tâche</h2>
            <form id="task-form">
                <label for="TitreTask">Titre de la tâche</label>
                <input type="text" id="TitreTask" name="TitreTask" required>

                <label for="DescriptionTask">Description</label>
                <textarea id="DescriptionTask" name="DescriptionTask" required></textarea>

                <label for="StatutTask">Statut</label>
                <select id="StatutTask" name="StatutTask" required>
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminée">Terminée</option>
                </select>

                <label for="PrioriteTask">Priorité</label>
                <select id="PrioriteTask" name="PrioriteTask" required>
                    <option value="3">Faible</option>
                    <option value="2">Moyenne</option>
                    <option value="1">Haute</option>
                </select>

                <label for="DateDebTask">Date de création</label>
                <input type="date" id="DateDebTask" name="DateDebTask" required>

                <label for="DateEchTask">Date d'échéance</label>
                <input type="date" id="DateEchTask" name="DateEchTask" required>

                <label for="IdProjet">Id du projet associé</label>
                <input type="number" id="IdProjet" name="IdProjet" value="${
                  localStorage.getItem("selectedProjectId") || ""
                }" required>

                <label for="IdUser">Id de l'utilisateur assigné</label>
                <input type="number" id="IdUser" name="IdUser" value="${
                  currentUser.id
                }" readonly>

                <button type="submit">Ajouter la tâche</button>
            </form>
        </div>
    `;
  }

  /**
   * Ouvre le formulaire pour éditer une tâche existante.
   * @param {Task} task La tâche à modifier.
   */
  function openEditTaskModal(task) {
    const modal = document.getElementById("addTaskModal");
    modal.style.display = "block";

    // Pré-remplir le formulaire avec les données existantes
    document.getElementById("TitreTask").value = task.titre;
    document.getElementById("DescriptionTask").value = task.description;
    document.getElementById("StatutTask").value = task.statut;
    document.getElementById("PrioriteTask").value = task.priorite;
    document.getElementById("DateDebTask").value = task.dateDebut;
    document.getElementById("DateEchTask").value = task.dateEcheance;
    document.getElementById("IdProjet").value = task.idProjet;
    document.getElementById("IdUser").value = task.idUser;

    // Modifier le texte du bouton pour refléter une modification
    const submitButton = document.querySelector(
      "#task-form button[type='submit']"
    );
    submitButton.textContent = "Modifier la tâche";

    // Activer le mode édition
    isEditing = true;
    editingTask = task; // Associe la tâche modifiée
  }

  /*
   * Ferme le modal de formulaire d'ajout/modification de tâche.
   */
  function closeAddTaskModal() {
    const modal = document.getElementById("addTaskModal");
    modal.style.display = "none";

    // Réinitialiser le formulaire et le texte du bouton
    document.getElementById("task-form").reset();
    const submitButton = document.querySelector(
      "#task-form button[type='submit']"
    );
    submitButton.textContent = "Ajouter la tâche";

    // Réinitialiser le mode édition
    isEditing = false;
    editingTask = null;
  }

  /**
   * Fonction pour rendre les tâches visibles dans la liste  
   */ 
  function renderTasks() {
    taskList.innerHTML = ""; // Réinitialiser la liste des tâches
    // Supprime les doublons par ID (si ID est unique pour chaque tâche)
    tasks = Array.from(new Set(tasks.map((task) => task.id))).map((id) =>
      tasks.find((task) => task.id === id)
    );
    tasks.forEach((task, index) => {
      if (
        currentFilter === "all" ||
        (currentFilter === "active" && task.statut === "En cours") ||
        (currentFilter === "completed" && task.statut === "Terminée")
      ) {
        const li = createTaskItem(task, index); // Créer l'élément <li>
        taskList.appendChild(li); // Ajouter à la liste
      }
    });
  }

  /**
   * Gérer l'ajout de tâche
   */
  document.getElementById("task-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collecte des valeurs du formulaire
    const titre = document.getElementById("TitreTask").value;
    const description = document.getElementById("DescriptionTask").value;
    const statut = document.getElementById("StatutTask").value;
    const priorite = document.getElementById("PrioriteTask").value;
    const dateDeb = document.getElementById("DateDebTask").value;
    const dateEch = document.getElementById("DateEchTask").value;
    const idProjet = document.getElementById("IdProjet").value;
    const idUser = document.getElementById("IdUser").value;

    if (isEditing && editingTask) {
      // Mode édition
      const updatedTaskData = {
        titre,
        description,
        statut,
        priorite,
        dateDebut: dateDeb,
        dateEcheance: dateEch,
        idProjet,
        idUser,
      };

      try {
        const success = await editingTask.updateTask(updatedTaskData);

        if (success) {
          console.log("Tâche mise à jour avec succès :", updatedTaskData);
          Object.assign(editingTask, updatedTaskData); // Mettre à jour localement la tâche
          renderTasks(); // Actualiser la liste des tâches
          closeAddTaskModal(); // Fermer la modal
        } else {
          console.error("Échec de la mise à jour de la tâche.");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche :", error);
      }

      // Réinitialiser le mode édition
      isEditing = false;
      editingTask = null;
    } else {
      // Mode ajout
      const newTask = new Task(
        titre,
        description,
        statut,
        priorite,
        dateDeb,
        dateEch,
        idProjet,
        idUser
      );

      const success = await newTask.addTask();

      if (success) {
        // Ajouter la tâche à la liste
        tasks.push(newTask);
        console.log("Tâche ajoutée avec succès :", newTask);

        // Actualiser la liste des tâches
        renderTasks();

        // Fermer la modal
        closeAddTaskModal();
      } else {
        alert("Erreur lors de l'ajout de la tâche");
      }
    }
  });

  /** 
   * Gérer le filtrage des tâches
   */
  filterOptions.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      currentFilter = e.target.dataset.filter;
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      renderTasks();
    }
  });

  /**
   * Ajouter l'événement pour la fermeture du modal avec la croix
   */
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      console.log("Fermeture du modal via la croix.");
      taskInfoModal.style.display = "none";
    });
  } else {
    console.error("Bouton de fermeture introuvable.");
  }

  /**
   * Fermer le modal si on clique en dehors de celui-ci
   */
  window.addEventListener("click", (event) => {
    if (event.target === taskInfoModal) {
      console.log("Fermeture du modal via un clic en dehors.");
      taskInfoModal.style.display = "none";
    }
  });

  // Premier rendu des tâches
  renderTasks();
});
