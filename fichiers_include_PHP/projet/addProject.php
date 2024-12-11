<?php
session_start();
header('Content-Type: application/json');

// Connexion à la base de données
$serveur = "db";
$login = "user";
$pw = "userpass";
$dbname = "gestion_projet";

try {
    // Connexion à la base de données avec PDO
    $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupérer les données envoyées via POST
    $projectData = json_decode(file_get_contents('php://input'), true);

    // Vérifier si toutes les données nécessaires sont présentes
    if (isset($projectData['NomProject'], $projectData['DescriptionProject'], $projectData['DateDebProject'], 
              $projectData['DateFinProject'], $projectData['IdChef'])) {

        // Préparer la requête SQL d'insertion
        $stmt = $connexion->prepare("
            INSERT INTO project (NomProject, DescriptionProject, DateDebProject, DateFinProject, IdChef) 
            VALUES (:NomProject, :DescriptionProject, :DateDebProject, :DateFinProject, :IdChef)
        ");

        // Liaison des paramètres
        $stmt->bindParam(':NomProject', $projectData['NomProject']);
        $stmt->bindParam(':DescriptionProject', $projectData['DescriptionProject']);
        $stmt->bindParam(':DateDebProject', $projectData['DateDebProject']);
        $stmt->bindParam(':DateFinProject', $projectData['DateFinProject']);
        $stmt->bindParam(':IdChef', $projectData['IdChef']);

        // Exécuter la requête
        $stmt->execute();

        // Récupérer l'ID du projet nouvellement inséré
        $lastInsertId = $connexion->lastInsertId();

        // Répondre avec succès et l'ID du projet
        echo json_encode([
            'success' => true,
            'idProject' => $lastInsertId
        ]);
    } else {
        // Si des données manquent, renvoyer une erreur
        echo json_encode([
            'success' => false,
            'error' => 'Données du projet incomplètes.'
        ]);
    }
} catch (PDOException $e) {
    // Gérer les erreurs de connexion ou d'exécution SQL
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de connexion : ' . $e->getMessage()
    ]);
}
?>
