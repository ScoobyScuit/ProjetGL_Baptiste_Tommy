/**
 * @class Project
 * @brief Classe représentant un projet dans le système.
 *
 * Cette classe gère les données d'un projet, y compris son identifiant, nom, description, date de début, date de fin, et l'identifiant du chef de projet.
 */
export class Project {
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
  constructor(
    id,
    nom,
    description,
    dateDebut,
    dateFin,
    idChef,
    isSelected = null
  ) {
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
      const response = await fetch("/fichiers_include_PHP/getProjectData.php");

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

      const projects = data.map(
        (projet) =>
          new Project(
            projet.IdProject,
            projet.NomProject,
            projet.DescriptionProject,
            projet.DateDebProject,
            projet.DateFinProject,
            projet.IdChef
          )
      );

      return projects;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données projet :",
        error
      );
      return [];
    }
  }

  /**
   * @brief Récupère les données de tous projets depuis le serveur.
   *
   * Cette méthode envoie une requête pour obtenir la liste des projets via une API PHP et retourne un tableau d'instances de la classe Project.
   * @return {Promise<Project[]>} Renvoie un tableau d'objets Project avec les données récupérées, ou un tableau vide en cas d'erreur.
   */

  static async fetchAllProjectData() {
    const apiUrl = "/fichiers_include_PHP/getAllProjectData.php"; // URL de l'API
    try {
      const response = await fetch(apiUrl);

      // Vérification de la réponse HTTP
      if (!response.ok) {
        throw new Error(
          `Erreur HTTP : ${response.status} ${response.statusText}`
        );
      }

      // Conversion en JSON
      const data = await response.json();

      // Vérification des erreurs retournées par l'API
      if (data.error) {
        throw new Error(`Erreur API : ${data.error}`);
      }

      // Vérification que les données sont un tableau
      if (!Array.isArray(data)) {
        throw new Error(
          "Format de données inattendu : les données ne sont pas un tableau."
        );
      }

      // Vérification et mapping des données
      const projects = data.map((projet) => {
        if (
          !projet.IdProject ||
          !projet.NomProject ||
          !projet.DescriptionProject ||
          !projet.DateDebProject ||
          !projet.DateFinProject ||
          !projet.IdChef
        ) {
          console.warn("Données incomplètes pour un projet :", projet);
          return null; // Exclure les projets mal formatés
        }

        return new Project(
          projet.IdProject,
          projet.NomProject,
          projet.DescriptionProject,
          projet.DateDebProject,
          projet.DateFinProject,
          projet.IdChef
        );
      });

      // Filtrer les valeurs nulles résultant des données incomplètes
      return projects.filter((project) => project !== null);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des projets :",
        error.message
      );
      return []; // Retourner un tableau vide en cas d'erreur
    }
  }

  /**
   * @brief Ajoute un projet au système.
   *
   * Cette méthode envoie une requête POST pour ajouter un projet à la base de données via un script PHP.
   * @return {Promise<boolean>} Renvoie true si le projet a été ajouté avec succès, sinon false.
   */
  async addProject() {
    try {
      const response = await fetch(
        "/fichiers_include_PHP/projet/addProject.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            NomProject: this.nom,
            DescriptionProject: this.description,
            DateDebProject: this.dateDebut,
            DateFinProject: this.dateFin,
            IdChef: this.idChef,
          }),
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        console.log("Projet ajouté avec succès :", result);
        return true;
      } else {
        throw new Error(result.error || "Erreur lors de l'ajout du projet.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet :", error);
      return false;
    }
  }

  /**
   * @brief Supprime un projet du système.
   *
   * Cette méthode est à implémenter pour supprimer un projet de la base de données.
   */
  async deleteProject() {
    try {
      const response = await fetch(
        `/fichiers_include_PHP/projet/deleteProject.php?id=${this.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
      return false;
    }
  }
}
