<?php

/**
 * @file getUserById.php
 * @brief Script pour récupérer les informations d'un utilisateur par son ID.
 * 
 * Ce fichier reçoit un ID utilisateur via l'URL (paramètre GET), 
 * se connecte à la base de données pour récupérer les informations de cet utilisateur, 
 * et les retourne au format JSON.
 */

session_start();  // Démarrer la session si nécessaire

/**
 * @brief Vérifie si l'ID utilisateur est fourni via l'URL.
 * 
 * Si l'ID est absent ou vide, retourne une erreur au format JSON.
 */
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $userId = intval($_GET['id']); /**< Sécurise l'ID utilisateur en le convertissant en entier. */
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
         * @brief Prépare et exécute une requête pour récupérer les informations d'un utilisateur par ID.
         * 
         * La requête récupère les colonnes : `IdUser`, `NomUser`, `PrenomUser`, `EmailUser`, `RoleUser`.
         */
        $stmt = $connexion->prepare("SELECT IdUser, NomUser, PrenomUser, EmailUser, RoleUser FROM user WHERE IdUser = :IdUser");
        $stmt->bindParam(':IdUser', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC); /**< Récupère les résultats sous forme de tableau associatif. */

        if ($user) {
            echo json_encode($user);  /**< Retourne les informations utilisateur au format JSON. */
        } else {
            /**
             * @brief Gère le cas où aucun utilisateur n'est trouvé pour l'ID donné.
             */
            echo json_encode(['error' => 'Utilisateur non trouvé.']);
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
     * @brief Gère le cas où l'ID utilisateur n'est pas fourni via l'URL.
     * Retourne un message d'erreur au format JSON.
     */
    echo json_encode(['error' => 'ID utilisateur non fourni.']);
}
?>
