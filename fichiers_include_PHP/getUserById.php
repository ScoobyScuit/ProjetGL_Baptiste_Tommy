<?php

/**
 * Fichier pour récupérer les informations d'un utilisateur par ID
 */

session_start();  // Démarrer la session si nécessaire

// Vérifiez si l'ID utilisateur est fourni dans l'URL
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $userId = intval($_GET['id']); // Sécuriser l'ID utilisateur
    $serveur = "db";
    $login = "user";
    $pw = "userpass";
    $dbname = "gestion_projet";

    try {
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Préparer et exécuter la requête pour récupérer l'utilisateur par ID
        $stmt = $connexion->prepare("SELECT IdUser, NomUser, PrenomUser, EmailUser, RoleUser FROM user WHERE IdUser = :IdUser");
        $stmt->bindParam(':IdUser', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC); // Récupérer un seul utilisateur

        if ($user) {
            echo json_encode($user);  // Retourner l'utilisateur au format JSON
        } else {
            echo json_encode(['error' => 'Utilisateur non trouvé.']);  // Si aucun utilisateur n'est trouvé
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'ID utilisateur non fourni.']); // Retourner une erreur si l'ID est manquant
}
?>
