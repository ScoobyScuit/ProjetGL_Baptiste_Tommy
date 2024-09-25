export class Task {
    constructor(id, titre, description, statut, priorite, dateEcheance, idProjet, idUser) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.statut = statut;
        this.priorite = priorite;
        this.dateEcheance = dateEcheance;
        this.idProjet = idProjet;
        this.idUser = idUser;
    }

    /**
     * @brief Récupère les données des tâches depuis le serveur.
     * 
     * Cette méthode envoie une requête pour obtenir la liste des tâches via une API PHP et retourne un tableau d'instances de la classe Task.
     * @return {Promise<Task[]} Renvoie un tableau d'objets Task avec les données récupérées, ou un tableau vide en cas d'erreur.
     */
    static async fetchTaskData() {
        try {
            const response = await fetch('../../fichiers_include_PHP/getTaskData.php');

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
            const tasks = data.map(tache => new Task(
                tache.IdTask,
                tache.TitreTask,
                tache.DescriptionTask,
                tache.StatutTask,
                tache.PrioriteTask,
                tache.DateEchTask,
                tache.IdProjet,
                tache.IdUser
            ));

            return tasks;
        } catch (error) {
            console.error("Erreur lors de la récupération des données des tâches :", error);
            return [];
        }
    }

    createTask() {
        // TODO
    }

    assignTask(idUser) {
        // TODO
    }

    changeStatut(idUser, newStatut) {
        // TODO
    }
}