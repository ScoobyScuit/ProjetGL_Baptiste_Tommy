/**
 * @class Project
 * @brief Classe représentant un projet dans le système.
 * 
 * Cette classe gère les données d'un projet, y compris son identifiant, nom, description, date de début, date de fin, et l'identifiant du chef de projet.
 */
class Project {

    /**
     * @brief Constructeur de la classe Project.
     * 
     * @param id Identifiant unique du projet.
     * @param nom Nom du projet.
     * @param description Description du projet.
     * @param dateDebut Date de début du projet.
     * @param dateFin Date de fin du projet.
     * @param idChef Identifiant du chef de projet.
     * @param isSelected Booleen qui dit si le projet est selectionné ou pas
     */
    constructor(id, nom, description, dateDebut, dateFin, idChef, isSelected = null) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.idChef = idChef;
        this.isSelected = isSelected;
    }

    /**
     * @brief Récupère les données des projets depuis le serveur.
     * 
     * Cette méthode envoie une requête pour obtenir la liste des projets via une API PHP et retourne un tableau d'instances de la classe Project.
     * @return {Promise<Project[]>} Renvoie un tableau d'objets Project avec les données récupérées, ou un tableau vide en cas d'erreur.
     */
    static async fetchProjectData() {
        try {
            const response = await fetch('../../fichiers_include_PHP/getProjectData.php');
    
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
    
            const data = await response.json();
    
            if (data.error) {
                throw new Error(data.error);
            }
    
            if (!Array.isArray(data)) {
                throw new Error("Données projets incorrectes.");
            }
    
            const projects = data.map(projet => new Project(
                projet.IdProject,
                projet.NomProject,
                projet.DescriptionProject,
                projet.DateDebProject,
                projet.DateFinProject,
                projet.IdChef    
            ));
    
            return projects;
        } catch (error) {
            console.error("Erreur lors de la récupération des données projet :", error);
            return [];
        }
    }

    /**
     * @brief Crée un nouveau projet.
     * 
     * Cette méthode est à implémenter pour permettre la création d'un nouveau projet.
     */
    createProject() {
        // TODO
    }

    /**
     * @brief Ajoute un projet au système.
     * 
     * Cette méthode est à implémenter pour ajouter un projet à la base de données.
     */
    addProject() {
        // TODO
    }

    /**
     * @brief Supprime un projet du système.
     * 
     * Cette méthode est à implémenter pour supprimer un projet de la base de données.
     */
    deleteProject() {
        // TODO
    }

    /**
     * @brief Ajoute un membre à un projet.
     * 
     * Cette méthode est à implémenter pour ajouter un utilisateur au projet en fonction de son identifiant.
     * @param idUser Identifiant de l'utilisateur à ajouter au projet.
     */
    addMember(idUser) {
        // TODO
    }

    /**
     * @brief Supprime un membre d'un projet.
     * 
     * Cette méthode est à implémenter pour retirer un utilisateur du projet en fonction de son identifiant.
     * @param idUser Identifiant de l'utilisateur à retirer du projet.
     */
    deleteMembre(idUser) {
        // TODO
    }
}
