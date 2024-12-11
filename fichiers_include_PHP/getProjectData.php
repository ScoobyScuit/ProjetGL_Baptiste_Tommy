<?php

/**
 * @file getUserProjects.php
 * @brief Script pour récupérer tous les projets liés à l'utilisateur actuellement connecté.
 * 
 * Ce fichier vérifie si un utilisateur est connecté via la session active, 
 * se connecte à la base de données, récupère les projets dont il est chef ou auxquels il est assigné, 
 * et les retourne au format JSON.
 */

session_start();  // Démarrer la session pour accéder aux variables de session

/**
 * @brief Vérifie si l'utilisateur est connecté via la session.
 * 
 * Si l'utilisateur est connecté, utilise son ID pour récupérer les projets liés.
 */
if (isset($_SESSION['user_id'])) {
    $serveur = "db";       /**< Nom du serveur de la base de données. */
    $login = "user";       /**< Nom d'utilisateur pour la base de données. */
    $pw = "userpass";      /**< Mot de passe pour la base de données. */
    $dbname = "gestion_projet"; /**< Nom de la base de données. */

    try {
        /**
         * @brief Initialise une connexion PDO à la base de données.
         * Configure le mode des erreurs pour lever des exceptions en cas de problème.
         */
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        /**
         * @brief Prépare et exécute une requête pour récupérer les projets liés à l'utilisateur.
         * 
         * La requête retourne les projets où l'utilisateur est chef de projet ou assigné à une tâche.
         */
        $stmt = $connexion->prepare("
            SELECT DISTINCT p.*
            FROM project p
            LEFT JOIN task t ON t.IdProject = p.IdProject
            WHERE p.IdChef = :IdUser OR t.IdUser = :IdUser;");
        $stmt->bindParam(':IdUser', $_SESSION['user_id']);
        $stmt->execute();
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC); /**< Récupère tous les projets sous forme de tableau associatif. */

        if ($projects) {
            echo json_encode($projects);  /**< Retourne les projets au format JSON. */
        } else {
            /**
             * @brief Gère le cas où aucun projet n'est trouvé.
             * Retourne un tableau vide au format JSON.
             */
            echo json_encode([]);
        }
    } catch (PDOException $e) {
        /**
         * @brief Gère les erreurs de connexion ou d'exécution de la requête SQL.
         * Retourne un message d'erreur au format JSON.
         */
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    /**
     * @brief Gère le cas où l'utilisateur n'est pas connecté.
     * Retourne un message d'erreur au format JSON.
     */
    echo json_encode(['error' => 'Utilisateur non connecté.']);
}
?>
