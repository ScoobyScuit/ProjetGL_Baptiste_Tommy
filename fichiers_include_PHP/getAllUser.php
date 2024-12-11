<?php

/**
 * @file getAllUsers.php
 * @brief Script pour récupérer toutes les données des utilisateurs dans la base de données.
 * 
 * Ce fichier vérifie si un utilisateur est connecté via la session active, 
 * se connecte à la base de données, récupère toutes les informations des utilisateurs, 
 * et les retourne au format JSON.
 */

session_start();  // Démarrer la session pour accéder aux variables de session

/**
 * @brief Vérifie si l'utilisateur est connecté via la session.
 * 
 * Si l'utilisateur est connecté, récupère la liste complète des utilisateurs dans la base de données.
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
         * @brief Prépare et exécute une requête pour récupérer tous les utilisateurs.
         * 
         * La requête sélectionne toutes les colonnes de la table `user`.
         */
        $stmt = $connexion->prepare("SELECT * FROM user");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC); /**< Récupère tous les utilisateurs sous forme de tableau associatif. */

        if ($users) {
            echo json_encode($users);  /**< Retourne les utilisateurs au format JSON. */
        } else {
            /**
             * @brief Gère le cas où aucun utilisateur n'est trouvé.
             * Retourne un message d'erreur au format JSON.
             */
            echo json_encode(['error' => 'Aucun utilisateur trouvé.']);
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
