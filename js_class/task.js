/**
 * @class Task
 * @brief Classe représentant une tache dans le système.
 *
 * Cette classe gère les données des taches et toutes les opérations liées aux taches
 */
export class Task {
  colorBank = [
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

  constructor(
    titre,
    description,
    statut,
    priorite,
    dateDebut,
    dateEcheance,
    idProjet,
    idUser,
    id = null
  ) {
    if (
      !titre ||
      !description ||
      !statut ||
      !priorite ||
      !dateDebut ||
      !dateEcheance ||
      !idProjet ||
      !idUser
    ) {
      throw new Error("Données de tâche incomplètes.");
    }
    this.titre = titre;
    this.description = description;
    this.statut = statut;
    this.priorite = priorite;
    this.dateDebut = dateDebut;
    this.dateEcheance = dateEcheance;
    this.idProjet = idProjet;
    this.idUser = idUser;
    this.id = id; // L'ID peut être null lors de l'ajout
    this.color =
      this.colorBank[Math.floor(Math.random() * this.colorBank.length)];
  }

  /**
   * @brief Récupère les données des tâches depuis le serveur.
   *
   * Cette méthode envoie une requête pour obtenir la liste des tâches via une API PHP
   * et retourne un tableau d'instances de la classe Task.
   *
   * @return {Promise<Task[]>} Renvoie un tableau d'objets Task avec les données récupérées,
   * ou un tableau vide en cas d'erreur.
   */
  static async fetchTaskData() {
    try {
      const response = await fetch(
        "/fichiers_include_PHP/task/getTaskData.php"
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!Array.isArray(data)) {
        throw new Error("Données tâches incorrectes.");
      }

      return data.map(
        (taskData) =>
          new Task(
            taskData.TitreTask,
            taskData.DescriptionTask,
            taskData.StatutTask,
            taskData.PrioriteTask,
            taskData.DateDebTask, // Ajout du champ DateDebTask
            taskData.DateEchTask,
            taskData.IdProject,
            taskData.IdUser,
            taskData.IdTask
          )
      );
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des tâches :",
        error
      );
      return [];
    }
  }

  /**
   * @brief Ajoute une tâche au serveur.
   *
   * Cette méthode envoie les informations de la tâche pour l'ajouter dans la base de données.
   *
   * @return {Promise<boolean>} Renvoie true si la tâche a été ajoutée avec succès, sinon false.
   */
  async addTask() {
    try {
      const response = await fetch("/fichiers_include_PHP/task/addTask.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TitreTask: this.titre,
          DescriptionTask: this.description,
          StatutTask: this.statut,
          PrioriteTask: this.priorite,
          DateDebTask: this.dateDebut, // Mise à jour pour inclure DateDebTask
          DateEchTask: this.dateEcheance,
          IdProjet: this.idProjet,
          IdUser: this.idUser,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
      return false;
    }
  }

  /**
   * @brief Supprime une tâche du serveur.
   *
   * Cette méthode envoie une requête pour supprimer la tâche en fonction de son ID.
   *
   * @return {Promise<boolean>} Renvoie true si la tâche a été supprimée avec succès, sinon false.
   */
  async deleteTask() {
    try {
      console.log("Envoi de la requête DELETE pour la tâche :", this.id);

      // Appel API pour supprimer la tâche
      const response = await fetch(
        `/fichiers_include_PHP/task/deleteTask.php?id=${this.id}`,
        {
          method: "DELETE",
        }
      );

      // Vérification de la réponse HTTP
      if (!response.ok) {
        throw new Error(
          `Erreur HTTP : ${response.status} ${response.statusText}`
        );
      }

      // Récupération de la réponse JSON
      const result = await response.json(); // Utiliser response.json() pour récupérer le JSON

      // Vérifier si une erreur est retournée par le serveur
      if (result.error) {
        throw new Error(result.error);
      }

      console.log("Tâche supprimée avec succès :", this.id);
      return true; // Suppression réussie
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la tâche :",
        error.message
      );
      return false; // Échec de la suppression
    }
  }

  /**
   * @brief Met à jour les informations d'une tâche existante.
   *
   * Cette méthode envoie une requête pour mettre à jour les informations de la tâche spécifiée.
   *
   * @param {Object} updatedTaskData - Les nouvelles données de la tâche.
   * @return {Promise<boolean>} Renvoie true si la mise à jour a réussi, sinon false.
   */
  async updateTask(updatedTaskData) {
    try {
      const response = await fetch(
        "/fichiers_include_PHP/task/updateTask.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: this.id,
            TitreTask: updatedTaskData.titre || this.titre,
            DescriptionTask: updatedTaskData.description || this.description,
            StatutTask: updatedTaskData.statut || this.statut,
            PrioriteTask: updatedTaskData.priorite || this.priorite,
            DateDebTask: updatedTaskData.dateDebut || this.dateDebut, // Inclut DateDebTask
            DateEchTask: updatedTaskData.dateEcheance || this.dateEcheance,
            IdProjet: updatedTaskData.idProjet || this.idProjet,
            IdUser: updatedTaskData.idUser || this.idUser,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        return true;
      } else {
        console.error("Erreur dans la réponse du serveur :", result.error);
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
      return false;
    }
  }

  /**
   * @brief Met à jour le statut d'une tâche.
   *
   * Cette méthode permet de modifier uniquement le statut d'une tâche existante.
   *
   * @param {string} newStatus - Le nouveau statut de la tâche.
   * @return {Promise<boolean>} Renvoie true si le statut a été mis à jour avec succès, sinon false.
   */
  async updateStatus(newStatus) {
    try {
      const response = await fetch(
        `/fichiers_include_PHP/task/updateTaskStatus.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: this.id, // ID de la tâche
            statut: newStatus, // Nouveau statut avec la clé correcte
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        this.statut = newStatus; // Mettre à jour localement
        console.log(`Statut mis à jour en "${newStatus}"`);
        return true;
      } else {
        throw new Error(
          result.error || "Erreur inconnue lors de la mise à jour du statut."
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de la tâche :",
        error
      );
      return false;
    }
  }

  /**
   * @brief Récupère les tâches liées à un projet spécifique.
   *
   * Cette méthode envoie une requête pour obtenir les tâches associées à un projet.
   *
   * @param {number} projectId - L'ID du projet pour lequel les tâches doivent être récupérées.
   * @return {Promise<Task[]>} Renvoie un tableau d'objets Task avec les données récupérées,
   * ou un tableau vide en cas d'erreur.
   */
  static async fetchTasksByProjectId(projectId) {
    try {
      const response = await fetch(
        `/fichiers_include_PHP/task/getTaskByProjectAndUser.php?projectId=${projectId}`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.map(
        (taskData) =>
          new Task(
            taskData.TitreTask,
            taskData.DescriptionTask,
            taskData.StatutTask,
            taskData.PrioriteTask,
            taskData.DateDebTask, // Ajout du champ DateDebTask
            taskData.DateEchTask,
            taskData.IdProject,
            taskData.IdUser,
            taskData.IdTask
          )
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches :", error);
      return [];
    }
  }

  /**
   * @brief Récupère les tâches d'un projet sans information utilisateur.
   *
   * Cette méthode envoie une requête pour obtenir les tâches sans associer un utilisateur.
   *
   * @param {number} projectId - L'ID du projet pour lequel les tâches doivent être récupérées.
   * @return {Promise<Task[]>} Renvoie un tableau d'objets Task avec les données récupérées,
   * ou un tableau vide en cas d'erreur.
   */
  static async fetchTasksByProjectIdWithoutUser(projectId) {
    try {
      const response = await fetch(
        `/fichiers_include_PHP/task/getTaskByProject.php?projectId=${projectId}`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.map(
        (taskData) =>
          new Task(
            taskData.TitreTask,
            taskData.DescriptionTask,
            taskData.StatutTask,
            taskData.PrioriteTask,
            taskData.DateDebTask,
            taskData.DateEchTask,
            taskData.IdProject,
            taskData.IdUser,
            taskData.IdTask
          )
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches :", error);
      return [];
    }
  }

  /**
   * @brief Assigne un utilisateur à une tâche spécifique.
   *
   * Cette méthode permet d'assigner un utilisateur à une tâche via une requête au serveur.
   *
   * @param {number} taskId - L'ID de la tâche à assigner.
   * @param {number} userId - L'ID de l'utilisateur à assigner.
   * @return {Promise<boolean>} Renvoie true si l'assignation a réussi, sinon false.
   */
  static async assignUserToTask(taskId, userId) {
    try {
      const response = await fetch(
        "/fichiers_include_PHP/task/assignUser.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, userId }),
        }
      );
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Erreur lors de l'assignation de la tâche :", error);
      return false;
    }
  }

  /**
   * @brief Affiche toutes les tâches stockées dans la console.
   *
   * Cette méthode permet d'afficher les informations de toutes les tâches dans un tableau.
   *
   * @param {Task[]} tasks - Tableau des tâches à afficher.
   */
  static displayTasks(tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      console.log("Aucune tâche à afficher.");
      return;
    }

    console.log("Liste des tâches :");
    tasks.forEach((task, index) => {
      console.log(`Tâche ${index + 1} :`);
      console.log(`- ID : ${task.id || "Non défini"}`);
      console.log(`- Titre : ${task.titre}`);
      console.log(`- Description : ${task.description}`);
      console.log(`- Statut : ${task.statut}`);
      console.log(`- Priorité : ${task.priorite}`);
      console.log(`- Date de début : ${task.dateDebut}`);
      console.log(`- Date d'échéance : ${task.dateEcheance}`);
      console.log(`- Projet ID : ${task.idProjet}`);
      console.log(`- Utilisateur ID : ${task.idUser}`);
    });
  }
}
