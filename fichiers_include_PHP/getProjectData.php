<?php

/**
 * Fichier pour récupérer tous les projets liés à 
 *    l'utilisateur actuellement connecté 
 */

session_start();  // Démarrer la session pour accéder aux variables de session

// Vérifier si l'utilisateur est connecté
if (isset($_SESSION['user_id'])) {
    $serveur = "localhost";
    $login = "root";
    $pw = "";
    $dbname = "gestion_projet";

    try {
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Récupérer les projets liés à l'utilisateur
        $stmt = $connexion->prepare("
            SELECT DISTINCT p.*
            FROM project p
            LEFT JOIN task t ON t.IdProject = p.IdProject
            WHERE p.IdChef = :IdUser OR t.IdUser = :IdUser;");
        $stmt->bindParam(':IdUser', $_SESSION['user_id']);
        $stmt->execute();
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);  // Récupérer tous les projets

        if ($projects) {
            echo json_encode($projects);  // Retourner les projets au format JSON
        } else {
            echo json_encode([]);  // Retourner un tableau vide si aucun projet n'est trouvé
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Utilisateur non connecté.']);
}
?>
