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
      ]

    constructor(titre, description, statut, priorite, dateDebut, dateEcheance, idProjet, idUser, id = null) {
        if (!titre || !description || !statut || !priorite || !dateEcheance || !idProjet || !idUser) {
            throw new Error('Données de tâche incomplètes.');
        }
        this.titre = titre;
        this.description = description;
        this.statut = statut;
        this.priorite = priorite;
        this.dateDebut = dateDebut || new Date().toISOString().split('T')[0]; // Date actuelle par défaut
        this.dateEcheance = dateEcheance;
        this.idProjet = idProjet;
        this.idUser = idUser;
        this.id = id; // L'ID peut être null lors de l'ajout
        this.color = this.colorBank[Math.floor(Math.random() * this.colorBank.length)];
    }

    /**
     * @brief Récupère les données des tâches depuis le serveur.
     * 
     * Cette méthode envoie une requête pour obtenir la liste des tâches via une API PHP et retourne un tableau d'instances de la classe Task.
     * @return {Promise<Task[]} Renvoie un tableau d'objets Task avec les données récupérées, ou un tableau vide en cas d'erreur.
     */
    static async fetchTaskData() {
        try {
            const response = await fetch('/fichiers_include_PHP/task/getTaskData.php');

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

            return data.map(taskData => new Task(
                taskData.TitreTask,
                taskData.DescriptionTask,
                taskData.StatutTask,
                taskData.PrioriteTask,
                taskData.DateDebutTask,
                taskData.DateEchTask,
                taskData.IdProject,
                taskData.IdUser,
                taskData.IdTask
            ));
        } catch (error) {
            console.error("Erreur lors de la récupération des données des tâches :", error);
            return [];
        }
    }

    async addTask() {
        try {
            const response = await fetch('/fichiers_include_PHP/task/addTask.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    TitreTask: this.titre,
                    DescriptionTask: this.description,
                    StatutTask: this.statut,
                    PrioriteTask: this.priorite,
                    DateDebutTask: this.dateDebut, // Ajout de dateDebut
                    DateEchTask: this.dateEcheance,
                    IdProjet: this.idProjet,
                    IdUser: this.idUser
                })
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
     * @return {Promise<boolean>} Renvoie true si la tâche a été supprimée avec succès, sinon false.
     */
    async deleteTask() {
        try {
            console.log("Envoi de la requête DELETE pour la tâche :", this.id);
    
            // Appel API pour supprimer la tâche
            const response = await fetch(`/fichiers_include_PHP/task/deleteTask.php?id=${this.id}`, {
                method: 'DELETE',
            });
    
            // Vérification de la réponse HTTP
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
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
            console.error("Erreur lors de la suppression de la tâche :", error.message);
            return false; // Échec de la suppression
        }
    }
    
    
    async updateTask(updatedTaskData) {
        try {
            const response = await fetch(`/fichiers_include_PHP/task/updateTask.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: this.id,
                    DateDebutTask: this.dateDebut, // Assurer la mise à jour de dateDebut
                    ...updatedTaskData,
                }),
            });

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

    async updateStatus(newStatus) {
        try {
            const response = await fetch(`/fichiers_include_PHP/task/updateTaskStatus.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: this.id,       // ID de la tâche
                    statut: newStatus // Nouveau statut avec la clé correcte
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
    
            const result = await response.json();
            if (result.success) {
                this.statut = newStatus; // Mettre à jour localement
                console.log(`Statut mis à jour en "${newStatus}"`);
                return true;
            } else {
                throw new Error(result.error || "Erreur inconnue lors de la mise à jour du statut.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut de la tâche :", error);
            return false;
        }
    }
    
    /**
     * @brief Récupère les tâches liées à un projet spécifique.
     * 
     * Cette méthode envoie une requête au serveur pour obtenir les tâches associées à un projet via une API PHP et retourne un tableau d'instances de la classe Task.
     * @param {number} projectId L'ID du projet pour lequel les tâches doivent être récupérées.
     * @return {Promise<Task[]>} Renvoie un tableau d'objets Task avec les données récupérées, ou un tableau vide en cas d'erreur.
     */
    static async fetchTasksByProjectId(projectId) {
        try {
            const response = await fetch(`/fichiers_include_PHP/task/getTaskByProjectAndUser.php?projectId=${projectId}`);

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            return data.map(taskData => new Task(
                taskData.TitreTask,
                taskData.DescriptionTask,
                taskData.StatutTask,
                taskData.PrioriteTask,
                taskData.DateDebutTask, 
                taskData.DateEchTask,
                taskData.IdProject,
                taskData.IdUser,
                taskData.IdTask
            ));
        } catch (error) {
            console.error("Erreur lors de la récupération des tâches :", error);
            return [];
        }
    }

    static async fetchTasksByProjectIdWithoutUser(projectId) {
        try {
            const response = await fetch(`/fichiers_include_PHP/task/getTaskByProject.php?projectId=${projectId}`);

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            return data.map(taskData => new Task(
                taskData.TitreTask,
                taskData.DescriptionTask,
                taskData.StatutTask,
                taskData.PrioriteTask,
                taskData.DateDebutTask,
                taskData.DateEchTask,
                taskData.IdProject,
                taskData.IdUser,
                taskData.IdTask
            ));
        } catch (error) {
            console.error("Erreur lors de la récupération des tâches :", error);
            return [];
        }
    }

    static async assignUserToTask(taskId, userId) {
        try {
          const response = await fetch("/fichiers_include_PHP/task/assignUser.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId, userId }),
          });
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
     * Cette méthode suppose qu'un tableau de tâches est passé en paramètre.
     * @param {Task[]} tasks Tableau des tâches à afficher.
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
