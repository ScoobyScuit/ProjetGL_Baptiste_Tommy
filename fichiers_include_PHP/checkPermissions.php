<?php
session_start();
require_once 'config.php'; // Charger la configuration

// Fonction de connexion à la base de données
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
 * Vérifie si l'utilisateur connecté a le rôle ou les permissions nécessaires.
 *
 * @param array|string $requiredRoles Rôle(s) requis (ex: ['admin', 'chef']).
 * @return bool Retourne true si l'utilisateur a les permissions, sinon false.
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

    $requiredRoles = (array) $requiredRoles; // S'assurer que c'est un tableau
    return in_array($userRole, $requiredRoles);
}

/**
 * Exemple : Vérifier les permissions pour modifier une liste de tâches.
 */
try {
    if (checkRole(['admin', 'chef'])) {
        // L'utilisateur a les permissions nécessaires
        echo json_encode([
            'status' => 'success',
            'message' => 'Vous pouvez modifier la liste des tâches.',
        ]);
    } else {
        // L'utilisateur n'a pas les permissions
        header("HTTP/1.1 403 Forbidden");
        echo json_encode([
            'status' => 'error',
            'message' => 'Accès refusé. Vous n\'avez pas les permissions nécessaires pour modifier cette liste.',
        ]);
    }
} catch (Exception $e) {
    error_log("Erreur : " . $e->getMessage());
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur interne du serveur.',
    ]);
    exit;
}
?>
