<?php

/**
 * @file getUserData.php
 * @brief Script pour récupérer toutes les données liées à l'utilisateur actuellement connecté.
 * 
 * Ce fichier vérifie si un utilisateur est connecté via la session active, 
 * se connecte à la base de données, récupère les informations de l'utilisateur 
 * et les retourne au format JSON.
 */

session_start();  // Démarrer la session pour accéder aux variables de session

// Vérifier si l'utilisateur est connecté
if (isset($_SESSION['user_id'])) {
    $serveur = "db";       /**< Nom du serveur de la base de données */
    $login = "user";       /**< Nom d'utilisateur pour la base de données */
    $pw = "userpass";      /**< Mot de passe pour la base de données */
    $dbname = "gestion_projet"; /**< Nom de la base de données */

    try {
        /**
         * @brief Création d'une connexion PDO à la base de données.
         * 
         * Utilise les informations de connexion définies ci-dessus pour établir une connexion sécurisée.
         */
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        /**
         * @brief Préparer et exécuter une requête pour récupérer les informations de l'utilisateur.
         * 
         * La requête utilise l'identifiant utilisateur stocké dans la session.
         */
        $stmt = $connexion->prepare("SELECT * FROM user WHERE IdUser = :IdUser");
        $stmt->bindParam(':IdUser', $_SESSION['user_id']);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode($user);  /**< Retourne les données utilisateur au format JSON */
        } else {
            echo json_encode(['error' => 'Utilisateur non trouvé.']);
        }
    } catch (PDOException $e) {
        /**
         * @brief Gestion des erreurs de connexion à la base de données.
         * Retourne un message d'erreur au format JSON.
         */
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    /**
     * @brief Gestion du cas où l'utilisateur n'est pas connecté.
     * Retourne un message d'erreur au format JSON.
     */
    echo json_encode(['error' => 'Utilisateur non connecté.']);
}
?>
