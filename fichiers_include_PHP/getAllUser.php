<?php

/**
 * Fichier pour récupérer toutes les données des utilisateurs dans la base de données
 */

session_start();  // Démarrer la session pour accéder aux variables de session

// Vérifier si l'utilisateur est connecté et autorisé
if (isset($_SESSION['user_id'])) {
    $serveur = "db";
    $login = "user";
    $pw = "userpass";
    $dbname = "gestion_projet";

    try {
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Récupérer tous les utilisateurs
        $stmt = $connexion->prepare("SELECT * FROM user");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($users) {
            echo json_encode($users);  // Retourner les données des utilisateurs au format JSON
        } else {
            echo json_encode(['error' => 'Aucun utilisateur trouvé.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Utilisateur non connecté.']);
}
?>
