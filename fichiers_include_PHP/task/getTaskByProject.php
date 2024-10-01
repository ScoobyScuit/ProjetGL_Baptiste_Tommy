<?php
/**
 * Fichier pour récupérer toutes les tâches liées à 
 * l'utilisateur actuellement connecté et à un projet spécifique.
 */

session_start();  // Démarrer la session pour accéder aux variables de session

// Vérifier si l'utilisateur est connecté
if (isset($_SESSION['user_id'])) {
    $serveur = "localhost";
    $login = "root";
    $pw = "";
    $dbname = "gestion_projet";

    try {
        // Connexion à la base de données
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Vérifier si l'ID du projet est passé en paramètre
        if (isset($_GET['projectId']) && !empty($_GET['projectId'])) {
            $projectId = intval($_GET['projectId']);  // Récupérer et sécuriser l'ID du projet
            
            // Requête pour récupérer les tâches liées à l'utilisateur et au projet spécifié
            $stmt = $connexion->prepare("
                SELECT t.*
                FROM task t
                WHERE t.IdUser = :IdUser AND t.IdProject = :IdProjet
            ");
            $stmt->bindParam(':IdUser', $_SESSION['user_id'], PDO::PARAM_INT);
            $stmt->bindParam(':IdProjet', $projectId, PDO::PARAM_INT);
            $stmt->execute();

            $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);  // Récupérer toutes les tâches

            // Retourner les tâches au format JSON
            if ($tasks) {
                echo json_encode($tasks);
            } else {
                echo json_encode([]);  // Retourner un tableau vide si aucune tâche n'est trouvée
            }
        } else {
            // Si l'ID du projet n'est pas spécifié ou est invalide
            echo json_encode(['error' => 'ID de projet manquant ou invalide.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Utilisateur non connecté.']);
}
?>
