<?php
session_start();
header('Content-Type: application/json');

// Connexion à la base de données
$serveur = "db";
$login = "user";
$pw = "userpass";
$dbname = "gestion_projet";

try {
    // Connexion à la base de données
    $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Vérifier si l'ID du projet est passé en paramètre
    if (isset($_GET['id'])) {
        $idProject = intval($_GET['id']);

        // Préparer et exécuter la requête de suppression
        $stmt = $connexion->prepare("DELETE FROM project WHERE IdProject = :idProject");
        $stmt->bindParam(":idProject", $idProject, PDO::PARAM_INT);
        $stmt->execute();

        // Vérifier si une ligne a été supprimée
        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, "message" => "Projet supprimé avec succès."]);
        } else {
            echo json_encode(["success" => false, "error" => "Aucun projet trouvé avec cet ID."]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "ID du projet manquant."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Erreur SQL : " . $e->getMessage()]);
}
?>
