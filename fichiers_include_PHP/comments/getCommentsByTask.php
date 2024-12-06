<?php
session_start();  // Démarrer la session pour accéder aux variables de session

// Vérifier si l'utilisateur est connecté
if (isset($_SESSION['user_id'])) {
    $serveur = "db";
    $login = "user";
    $pw = "userpass";
    $dbname = "gestion_projet";

    try {
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Récupérer l'ID de la tâche à partir de la requête
        $taskId = isset($_GET['taskId']) ? intval($_GET['taskId']) : 0;

        if ($taskId > 0) {
            // Récupérer les commentaires liés à la tâche
            $stmt = $connexion->prepare("
                SELECT IdCom, IdTask, IdUser, ContentCom, DateCom 
                FROM comments 
                WHERE IdTask = :IdTask
                ORDER BY DateCom ASC
            ");
            $stmt->bindParam(':IdTask', $taskId, PDO::PARAM_INT);
            $stmt->execute();
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($comments);  // Retourner les commentaires au format JSON
        } else {
            echo json_encode(['error' => 'ID de tâche invalide.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Utilisateur non connecté.']);
}
?>
