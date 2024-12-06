<?php

session_start(); // Démarrer la session pour vérifier l'utilisateur connecté

// Vérifier si l'utilisateur est connecté
if (isset($_SESSION['user_id'])) {
    // Connexion à la base de données
    $serveur = "db";
    $login = "user";
    $pw = "userpass";
    $dbname = "gestion_projet";

    try {
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Récupérer l'ID de la tâche depuis les paramètres GET
        if (isset($_GET['taskId'])) {
            $taskId = $_GET['taskId'];

            // Préparer la requête pour récupérer les commentaires liés à la tâche
            $stmt = $connexion->prepare("
                SELECT c.ContentCom AS contenu, c.DateCom AS date, u.Name AS utilisateur
                FROM comments c
                LEFT JOIN users u ON c.IdUser = u.IdUser
                WHERE c.IdTask = :IdTask
                ORDER BY c.DateCom DESC
            ");
            $stmt->bindParam(':IdTask', $taskId, PDO::PARAM_INT);
            $stmt->execute();

            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC); // Récupérer tous les commentaires

            if ($comments) {
                echo json_encode($comments); // Retourner les commentaires au format JSON
            } else {
                echo json_encode([]); // Retourner un tableau vide si aucun commentaire n'est trouvé
            }
        } else {
            echo json_encode(['error' => 'ID de la tâche manquant.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Utilisateur non connecté.']);
}
?>
