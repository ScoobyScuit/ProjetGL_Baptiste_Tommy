<?php
session_start();  // Démarrer la session pour accéder aux variables de session

/**
 * Fichier pour récupérer toutes les tâches liées à 
 *    l'utilisateur actuellement connecté 
 */

// Vérifier si l'utilisateur est connecté
if (isset($_SESSION['user_id'])) {
    $serveur = "db";
    $login = "user";
    $pw = "userpass";
    $dbname = "gestion_projet";

    try {
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Requête pour récupérer toutes les tâches liées à l'utilisateur
        $stmt = $connexion->prepare("
            SELECT t.*
            FROM task t
            WHERE t.IdUser = :IdUser
        ");
        $stmt->bindParam(':IdUser', $_SESSION['user_id']);
        $stmt->execute();
        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);  // Récupérer toutes les tâches

        // Retourner les tâches au format JSON
        header('Content-Type: application/json'); // Définir le header JSON
        echo json_encode($tasks);
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Utilisateur non connecté.']);
}
?>
