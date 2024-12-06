export class Comments {
  constructor(id, idTask, idUser, contenu, date) {
    this.id = id;
    this.idTask = idTask;
    this.idUser = idUser;
    this.contenu = contenu;
    this.date = date;
  }

  /**
   * Récupère les commentaires pour une tâche spécifique depuis la base de données.
   * @param {number} taskId L'identifiant de la tâche.
   * @returns {Promise<Array<Comments>>} Une promesse qui retourne une liste d'objets Comments.
   */
  static async fetchCommentsByTaskId(taskId) {
    try {
      console.log("Demande de récupération des commentaires pour la tâche :", taskId);

      const response = await fetch(`/fichiers_include_PHP/comments/getCommentsByTask.php?taskId=${taskId}`);
      
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
        console.error("Erreur lors de la récupération des commentaires :", data);
        return [];
      }
    } catch (error) {
      console.error("Erreur lors de la requête pour récupérer les commentaires :", error);
      return [];
    }
  }

  /**
/**
 * Ajoute un commentaire pour une tâche spécifique.
 * @param {number} idUser L'identifiant de l'utilisateur.
 * @param {number} idTask L'identifiant de la tâche.
 * @param {string} comment Le contenu du commentaire.
 * @returns {Promise<boolean>} True si l'ajout est réussi, sinon False.
 */
static async addComment(idUser, idTask, comment) {
  try {
    // Obtenez la date d'aujourd'hui au format ISO
    const currentDate = new Date().toISOString().slice(0, 10); // Format : AAAA-MM-JJ

    // Construire la requête pour envoyer le commentaire
    const response = await fetch(`/fichiers_include_PHP/comments/addComment.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idUser, idTask, content: comment, date: currentDate }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log("Commentaire ajouté avec succès :", data);
      return true;
    } else {
      console.error("Erreur lors de l'ajout du commentaire :", data);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la requête pour ajouter un commentaire :", error);
    return false;
  }
}


  // Autres méthodes : modifyComment et deleteComment peuvent être ajoutées ici.
}
