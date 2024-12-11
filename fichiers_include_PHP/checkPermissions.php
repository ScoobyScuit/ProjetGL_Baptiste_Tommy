<?php

/**
 * @file checkPermissions.php
 * @brief Script pour gérer les autorisations des utilisateurs en fonction de leurs rôles.
 * 
 * Ce script vérifie si un utilisateur connecté dispose des permissions nécessaires pour accéder
 * à une ressource ou effectuer une action. Il utilise une fonction pour vérifier les rôles
 * et une autre pour établir une connexion à la base de données.
 */

session_start();
require_once 'config.php'; // Charger la configuration contenant les détails de connexion à la base de données

/**
 * @brief Établit une connexion à la base de données.
 * 
 * Utilise les informations de configuration pour créer une instance PDO.
 * 
 * @return PDO Instance de connexion à la base de données.
 * @throws Exception Si la connexion échoue.
 */
function db_connect() {
    global $dbHost, $dbName, $dbUser, $dbPass;

    try {
        $connexion = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $connexion;
    } catch (PDOException $e) {
        error_log('Erreur de connexion à la base de données : ' . $e->getMessage());
        throw new Exception('Erreur de connexion à la base de données.');
    }
}

/**
 * @brief Vérifie si un utilisateur a le ou les rôles requis pour accéder à une ressource.
 * 
 * @param array|string $requiredRoles Rôle(s) requis, ex: ['admin', 'chef'].
 * @return bool Retourne true si l'utilisateur a les permissions, false sinon.
 */
function checkRole($requiredRoles) {
    if (!isset($_SESSION['user_id'])) {
        header("Location: /login");
        exit;
    }

    // Connexion à la base de données
    $conn = db_connect();

    // Récupérer le rôle de l'utilisateur connecté
    $user_id = $_SESSION['user_id'];
    $query = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $query->execute([$user_id]);
    $userRole = $query->fetchColumn();

    if (!$userRole) {
        header("Location: /login");
        exit;
    }

    $requiredRoles = (array) $requiredRoles; // Convertir en tableau si nécessaire
    return in_array($userRole, $requiredRoles);
}

/**
 * @brief Vérifie les permissions et retourne une réponse JSON selon les résultats.
 * 
 * Si l'utilisateur a les permissions nécessaires, un message de succès est retourné.
 * Sinon, un message d'erreur est envoyé avec le statut HTTP approprié.
 */
try {
    if (checkRole(['admin', 'chef'])) {
        // L'utilisateur a les permissions nécessaires
        echo json_encode([
            'status' => 'success',
            'message' => 'Vous pouvez modifier la liste des tâches.',
        ]);
    } else {
        // L'utilisateur n'a pas les permissions nécessaires
        header("HTTP/1.1 403 Forbidden");
        echo json_encode([
            'status' => 'error',
            'message' => 'Accès refusé. Vous n\'avez pas les permissions nécessaires pour modifier cette liste.',
        ]);
    }
} catch (Exception $e) {
    /**
     * @brief Gère les erreurs internes du serveur.
     * 
     * Enregistre l'erreur dans les logs et retourne un message d'erreur générique.
     */
    error_log("Erreur : " . $e->getMessage());
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur interne du serveur.',
    ]);
    exit;
}
?>
