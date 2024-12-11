/**
 * @class Comments
 * @brief Classe représentant un commentaire lié à une tâche.
 *
 * Cette classe permet de récupérer, ajouter et gérer des commentaires
 * pour une tâche spécifique dans une base de données.
 */
export class Comments {
  constructor(id, idTask, idUser, contenu, date) {
    this.id = id;
    this.idTask = idTask;
    this.idUser = idUser;
    this.contenu = contenu;
    this.date = date;
  }

  /**
   * @brief Récupère les commentaires pour une tâche spécifique.
   *
   * Cette méthode effectue une requête asynchrone vers un script PHP
   * pour récupérer les commentaires d'une tâche donnée.
   *
   * @param {number} taskId - L'identifiant de la tâche.
   * @return {Promise<Array<Comments>>} Une promesse contenant un tableau d'objets Comments.
   */
  static async fetchCommentsByTaskId(taskId) {
    try {
      console.log(
        "Demande de récupération des commentaires pour la tâche :",
        taskId
      );

      const response = await fetch(
        `/fichiers_include_PHP/comments/getCommentsByTask.php?taskId=${taskId}`
      );

      console.log("Réponse brute reçue (fetch) :", response);

      const data = await response.json();

      console.log("Données JSON parsées :", data);

      if (response.ok) {
        return data.map(
          (comment) =>
            new Comments(
              comment.IdCom,
              comment.IdTask,
              comment.IdUser,
              comment.ContentCom,
              comment.DateCom
            )
        );
      } else {
        console.error(
          "Erreur lors de la récupération des commentaires :",
          data
        );
        return [];
      }
    } catch (error) {
      console.error(
        "Erreur lors de la requête pour récupérer les commentaires :",
        error
      );
      return [];
    }
  }

  /**
   * @brief Ajoute un commentaire pour une tâche spécifique.
   *
   * Cette méthode envoie un commentaire vers la base de données
   * via un script PHP. La date est automatiquement ajoutée au format AAAA-MM-JJ.
   *
   * @param {number} idUser - L'identifiant de l'utilisateur qui ajoute le commentaire.
   * @param {number} idTask - L'identifiant de la tâche associée au commentaire.
   * @param {string} comment - Le contenu du commentaire.
   * @return {Promise<boolean>} Une promesse retournant `true` si l'ajout a réussi, sinon `false`.
   */
  static async addComment(idUser, idTask, comment) {
    try {
      // Obtenez la date d'aujourd'hui au format ISO
      const currentDate = new Date().toISOString().slice(0, 10); // Format : AAAA-MM-JJ

      // Construire la requête pour envoyer le commentaire
      const response = await fetch(
        `/fichiers_include_PHP/comments/addComment.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idUser,
            idTask,
            content: comment,
            date: currentDate,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Commentaire ajouté avec succès :", data);
        return true;
      } else {
        console.error("Erreur lors de l'ajout du commentaire :", data);
        return false;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la requête pour ajouter un commentaire :",
        error
      );
      return false;
    }
  }
}
