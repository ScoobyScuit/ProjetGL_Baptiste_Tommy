class Task {
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