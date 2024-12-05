<?php
session_start();

// Définir l'en-tête JSON
header('Content-Type: application/json');

// Vérifier que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non authentifié.']);
    exit;
}

// Informations de connexion à la base de données
$dbHost = "db"; // Nom d'hôte de la base de données
$dbUser = "user"; // Nom d'utilisateur de la base de données
$dbPass = "userpass"; // Mot de passe de la base de données
$dbName = "gestion_projet"; // Nom de la base de données

try {
    // Connexion à la base de données
    $connexion = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Vérifier que la requête est de type POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'error' => 'Requête invalide.']);
        exit;
    }

    // Lire les données JSON envoyées
    $data = json_decode(file_get_contents("php://input"), true);

    // Vérifier que les données nécessaires sont présentes
    if (isset($data['id'], $data['statut']) && is_numeric($data['id']) && is_string($data['statut'])) {
        // Préparer et exécuter la requête de mise à jour
        $stmt = $connexion->prepare("UPDATE task SET StatutTask = :statut WHERE IdTask = :id");
        $stmt->bindParam(':statut', $data['statut'], PDO::PARAM_STR);
        $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
        $stmt->execute();

        // Répondre avec succès
        echo json_encode(['success' => true]);
    } else {
        // Répondre avec une erreur si les données sont manquantes ou invalides
        echo json_encode(['success' => false, 'error' => 'Données manquantes ou invalides.']);
    }
} catch (PDOException $e) {
    // Gérer les erreurs de la base de données
    echo json_encode(['success' => false, 'error' => 'Erreur de la base de données : ' . $e->getMessage()]);
    exit;
}
