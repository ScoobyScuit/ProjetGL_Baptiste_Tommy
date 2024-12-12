<?php

/**
 * @file getUserProjects.php
 * @brief Script pour récupérer tous les projets dans la base de données.
 * 
 * Ce fichier se connecte à la base de données et retourne tous les projets 
 * disponibles au format JSON.
 */

session_start();  // Démarre la session (utile si nécessaire pour la suite)

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
     * @brief Prépare et exécute une requête pour récupérer TOUS les projets.
     */
    $stmt = $connexion->prepare("SELECT * FROM project");
    $stmt->execute();

    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC); /**< Récupère tous les projets sous forme de tableau associatif. */

    /**
     * @brief Retourne les projets au format JSON.
     * Si aucun projet n'est trouvé, retourne un tableau vide.
     */
    echo json_encode($projects);
} catch (PDOException $e) {
    /**
     * @brief Gère les erreurs de connexion ou d'exécution de la requête SQL.
     * Retourne un message d'erreur au format JSON.
     */
    echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
}
?>
