class User {
    constructor(id, nom, prenom, email, password, role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    
    static async fetchUserData() {
        try {
            const response = await fetch('../../fichiers_include_PHP/getUserData.php');
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

    handleProfil() {
        // TODO
    }

    displayInfo() {
        console.log(`Id: ${this.id}, Nom: ${this.nom}, Prénom: ${this.prenom}, Email: ${this.email}, Rôle: ${this.role}`);
    }
}
