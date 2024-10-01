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
            const response = await fetch('../../fichiers_include_PHP/task/getTaskData.php');
    
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
            const response = await fetch(`../../fichiers_include_PHP/task/getTaskByProject.php?projectId=${projectId}`);

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
     * @brief Supprime une tâche du serveur.
     * 
     * Cette méthode envoie une requête pour supprimer la tâche en fonction de son ID.
     * @return {Promise<boolean>} Renvoie true si la tâche a été supprimée avec succès, sinon false.
     */
    async deleteTask() {
        try {
            const response = await fetch(`../../fichiers_include_PHP/task/deleteTask.php?id=${this.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const result = await response.json();
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
            const response = await fetch('../../fichiers_include_PHP/task/addTask.php', {
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

            return true;  // Ajout réussi
        } catch (error) {
            console.error("Erreur lors de l'ajout de la tâche :", error);
            return false;
        }
    }

    assignTask(idUser) {
        // TODO
    }

    changeStatut(idUser, newStatut) {
        // TODO
    }
}