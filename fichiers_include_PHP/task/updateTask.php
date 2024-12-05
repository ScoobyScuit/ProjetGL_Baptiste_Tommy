<?php
session_start();

header('Content-Type: application/json');

// Vérifier que l'utilisateur est authentifié
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non authentifié.']);
    exit;
}

// Connexion à la base de données
$dbHost = "db";
$dbUser = "user";
$dbPass = "userpass";
$dbName = "gestion_projet";

try {
    $connexion = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['id'], $data['titre'], $data['description'], $data['statut'], $data['priorite'], $data['dateEcheance'], $data['idProjet'], $data['idUser'])) {
        // Mettre à jour la tâche existante
        $stmt = $connexion->prepare("UPDATE task SET 
            TitreTask = :titre, 
            DescriptionTask = :description, 
            StatutTask = :statut, 
            PrioriteTask = :priorite, 
            DateEchTask = :dateEcheance, 
            IdProject = :idProjet, 
            IdUser = :idUser 
            WHERE IdTask = :id");

        $stmt->bindParam(':titre', $data['titre']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':statut', $data['statut']);
        $stmt->bindParam(':priorite', $data['priorite']);
        $stmt->bindParam(':dateEcheance', $data['dateEcheance']);
        $stmt->bindParam(':idProjet', $data['idProjet']);
        $stmt->bindParam(':idUser', $data['idUser']);
        $stmt->bindParam(':id', $data['id']);
        $stmt->execute();

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Données manquantes.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
