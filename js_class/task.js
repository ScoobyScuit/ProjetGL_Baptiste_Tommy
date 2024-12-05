export class Task {
    constructor(titre, description, statut, priorite, dateEcheance, idProjet, idUser, id = null) {  
        if (!titre || !description || !statut || !priorite || !dateEcheance || !idProjet || !idUser) {
            throw new Error('Données de tâche incomplètes.');   
        }   
        this.titre = titre;
        this.description = description;
        this.statut = statut;
        this.priorite = priorite;
        this.dateEcheance = dateEcheance;
        this.idProjet = idProjet;
        this.idUser = idUser;
        this.id = id; // L'ID peut être null lors de l'ajout
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
    
            // Transformer les données reçues en instances de la classe Task
            const tasks = data.map(taskData => {
                // Vérifier que toutes les données nécessaires sont présentes
                if (!taskData.TitreTask || !taskData.DescriptionTask || !taskData.StatutTask || 
                    !taskData.PrioriteTask || !taskData.DateEchTask || !taskData.IdProject || 
                    !taskData.IdUser) {
                    console.error("Données de tâche incomplètes :", taskData);
                    throw new Error('Données de tâche incomplètes.');
                }
    
                // Créer une nouvelle instance de Task avec l'ID (IdTask) en tant que paramètre optionnel
                return new Task(
                    taskData.TitreTask,
                    taskData.DescriptionTask,
                    taskData.StatutTask,
                    taskData.PrioriteTask,
                    taskData.DateEchTask,
                    taskData.IdProject,
                    taskData.IdUser,
                    taskData.IdTask // Passer l'ID optionnel ici
                );
            });
    
            return tasks;
        } catch (error) {
            console.error("Erreur lors de la récupération des données des tâches :", error);
            return [];
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
            const response = await fetch(`/fichiers_include_PHP/task/getTaskByProject.php?projectId=${projectId}`);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Tâches reçues du backend :", data);
    
            if (data.error) {
                throw new Error(data.error);
            }
    
            return data.map(taskData => new Task(
                taskData.TitreTask,
                taskData.DescriptionTask,
                taskData.StatutTask,
                taskData.PrioriteTask,
                taskData.DateEchTask,
                taskData.IdProject,
                taskData.IdUser,
                taskData.IdTask // Assigner l'ID ici
            ));
        } catch (error) {
            console.error("Erreur lors de la récupération des tâches :", error);
            return [];
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
            const response = await fetch(`/fichiers_include_PHP/task/deleteTask.php?id=${this.id}`, {
                method: 'DELETE',
            });            
    
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
    
            // Lire une seule fois le corps de la réponse
            const rawData = await response.text(); // Lire la réponse brute
            console.log("Données reçues (brutes) :", rawData);
    
            const result = JSON.parse(rawData); // Analyser le JSON
            if (result.error) {
                throw new Error(result.error);
            }
    
            return true;  // Suppression réussie
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche :", error);
            return false;
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

            console.log("Données envoyées :", {
                Id : this.id,
                TitreTask: this.titre,
                DescriptionTask: this.description,
                StatutTask: this.statut,
                PrioriteTask: this.priorite,
                DateEchTask: this.dateEcheance,
                IdProjet: this.idProjet,
                IdUser: this.idUser
            });

            console.log("Réponse reçue :", result);

            

            return true;  // Ajout réussi
        } catch (error) {
            console.error("Erreur lors de l'ajout de la tâche :", error);
            return false;
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
              id: this.id, // Utiliser l'ID de la tâche existante
              ...updatedTaskData,
            }),
          });
      
          if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
          }
      
          const result = await response.json();
          if (result.success) {
            return true; // Mise à jour réussie
          } else {
            console.error("Erreur dans la réponse du serveur :", result.error);
            return false;
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la tâche :", error);
          return false;
        }
      }
      
      

    assignTask(idUser) {
        // TODO
    }

    async updateStatus(newStatus) {
        try {
            console.log(`Mise à jour du statut de la tâche ${this.id} vers '${newStatus}'.`);
    
            // Envoyer la requête POST
            const response = await fetch(`/fichiers_include_PHP/task/updateTaskStatus.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: this.id,
                    statut: newStatus,
                }),
            });
    
            // Vérifier le statut HTTP
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
    
            // Lire la réponse brute pour debug
            const rawResponse = await response.text();
            console.log("Réponse brute du serveur :", rawResponse);
    
            // Tenter de parser la réponse JSON
            try {
                const result = JSON.parse(rawResponse);
                console.log("Réponse parsée :", result);
    
                if (result.success) {
                    return true; // Mise à jour réussie
                } else {
                    console.error("Erreur dans la réponse du serveur :", result.error);
                    return false;
                }
            } catch (parseError) {
                console.error("Erreur de parsing JSON :", parseError, "Réponse brute :", rawResponse);
                return false;
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut :", error);
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
            console.log(`- Date d'échéance : ${task.dateEcheance}`);
            console.log(`- Projet ID : ${task.idProjet}`);
            console.log(`- Utilisateur ID : ${task.idUser}`);
        });
    }
}