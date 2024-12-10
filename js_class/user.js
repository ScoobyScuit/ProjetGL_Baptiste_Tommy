/**
 * @class User
 * @brief Classe représentant un utilisateur du système.
 * 
 * Cette classe gère les données d'un utilisateur, notamment son ID, nom, prénom, email, mot de passe et rôle.
 */
export class User {
    
    /**
     * @brief Constructeur de la classe User.
     * 
     * @param id Identifiant unique de l'utilisateur.
     * @param nom Nom de l'utilisateur.
     * @param prenom Prénom de l'utilisateur.
     * @param email Adresse email de l'utilisateur.
     * @param password Mot de passe de l'utilisateur.
     * @param role Rôle de l'utilisateur (Admin, Chef, Membre, etc.).
     */
    constructor(id, nom, prenom, email, password, role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    
    /**
     * @brief Récupère les données utilisateur depuis le serveur.
     * 
     * Cette fonction envoie une requête pour obtenir les informations de l'utilisateur via une API PHP.
     * @return {Promise<User|null>} Renvoie une instance de la classe User avec les données récupérées ou null en cas d'erreur.
     */
    static async fetchUserData() {
        try {
            const response = await fetch('/fichiers_include_PHP/getUserData.php');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données utilisateur.');
            }
            const userData = await response.json();
            if (userData.error) {
                console.error(userData.error);
                return null;
            }
            return new User(userData.IdUser, userData.NomUser, userData.PrenomUser, userData.EmailUser, '', userData.RoleUser);
        } catch (error) {
            console.error(error);
        }
    }

    static async fetchUserById(id) {
        try {
            const response = await fetch(`/fichiers_include_PHP/getUserById.php?id=${id}`); // Ajouter l'ID comme paramètre GET
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            const data = await response.json();
            return data; // Suppose que l'API retourne un objet utilisateur avec { id, name }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            return null; // En cas d'erreur, retournez null
        }
    }

    static async fetchAllUsers() {
        try {
            const response = await fetch('/fichiers_include_PHP/getAllUser.php'); // Appel à l'API
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
    
            if (Array.isArray(data)) {
                return data; // Retourner les utilisateurs si les données sont un tableau
            } else if (data.error) {
                console.error("Erreur du serveur :", data.error);
                return null; // Gestion des erreurs renvoyées par le serveur
            } else {
                throw new Error("Données inattendues reçues du serveur.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            return null; // En cas d'erreur, retournez null
        }
    }

    static async updateUserRole(userId, newRole) {
        try {
          const response = await fetch("/fichiers_include_PHP/profil/updateRole.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId, role: newRole }),
          });

          const result = await response.json();
          return result.success;
        } catch (error) {
          console.error("Erreur lors de la mise à jour du rôle :", error);
          return false;
        }
      }
      

    /**
     * @brief Affiche les informations de l'utilisateur dans la console.
     * 
     * Cette méthode affiche les informations de base de l'utilisateur : ID, nom, prénom, email et rôle.
     */
    displayInfo() {
        console.log(`Id: ${this.id}, Nom: ${this.nom}, Prénom: ${this.prenom}, Email: ${this.email}, Rôle: ${this.role}`);
    }
}
