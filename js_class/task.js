export class Task {
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
    }

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
                taskData.DateDebutTask, // Ajout de dateDebut
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
