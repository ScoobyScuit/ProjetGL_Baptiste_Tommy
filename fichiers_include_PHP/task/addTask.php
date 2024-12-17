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
    $taskData = json_decode(file_get_contents('php://input'), true);

    // Vérifier si toutes les données nécessaires sont présentes
    if (isset($taskData['TitreTask'], $taskData['DescriptionTask'], $taskData['StatutTask'], 
              $taskData['PrioriteTask'], $taskData['DateDebTask'], $taskData['DateEchTask'], 
              $taskData['IdProjet'], $taskData['IdUser'])) {

        // Préparer la requête SQL d'insertion
        $stmt = $connexion->prepare("
            INSERT INTO task (TitreTask, DescriptionTask, StatutTask, PrioriteTask, DateDebTask, DateEchTask, IdProject, IdUser) 
            VALUES (:TitreTask, :DescriptionTask, :StatutTask, :PrioriteTask, :DateDebTask, :DateEchTask, :IdProject, :IdUser)
        ");

        // Liaison des paramètres
        $stmt->bindParam(':TitreTask', $taskData['TitreTask']);
        $stmt->bindParam(':DescriptionTask', $taskData['DescriptionTask']);
        $stmt->bindParam(':StatutTask', $taskData['StatutTask']);
        $stmt->bindParam(':PrioriteTask', $taskData['PrioriteTask']);
        $stmt->bindParam(':DateDebTask', $taskData['DateDebTask']); // Liaison de la date de début
        $stmt->bindParam(':DateEchTask', $taskData['DateEchTask']);
        $stmt->bindParam(':IdProject', $taskData['IdProjet']);
        $stmt->bindParam(':IdUser', $taskData['IdUser']);

        // Exécuter la requête
        $stmt->execute();

        // Récupérer l'ID de la tâche nouvellement insérée
        $lastInsertId = $connexion->lastInsertId();

        // Répondre avec succès et l'ID de la tâche
        echo json_encode([
            'success' => true,
            'idTask' => $lastInsertId
        ]);
    } else {
        // Si des données manquent, renvoyer une erreur
        echo json_encode([
            'success' => false,
            'error' => 'Données de tâche incomplètes.'
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