<?php
header('Content-Type: application/json');
session_start(); // Démarre la session pour la vérification des autorisations

// Connexion à la base de données
$serveur = "db";
$login = "user";
$pw = "userpass";
$dbname = "gestion_projet";

try {
    $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Lire les données JSON reçues
    $input = json_decode(file_get_contents("php://input"), true);

    // Vérifier les paramètres requis
    if (!isset($input['id'], $input['role'])) {
        echo json_encode(["success" => false, "error" => "Paramètres manquants."]);
        exit;
    }

    $userId = $input['id'];
    $newRole = $input['role'];

    // Vérifier si le rôle est valide
    $rolesValides = ['Membre', 'Chef de projet', 'Administrateur'];
    if (!in_array($newRole, $rolesValides)) {
        echo json_encode(["success" => false, "error" => "Rôle invalide."]);
        exit;
    }

    // Vérifier si l'utilisateur existe
    $stmt = $connexion->prepare("SELECT * FROM user WHERE IdUser = :userId");
    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode(["success" => false, "error" => "Utilisateur non trouvé."]);
        exit;
    }

    // Mettre à jour le rôle de l'utilisateur
    $updateStmt = $connexion->prepare("
        UPDATE user 
        SET RoleUser = :newRole 
        WHERE IdUser = :userId
    ");
    $updateStmt->bindParam(':newRole', $newRole, PDO::PARAM_STR);
    $updateStmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $updateStmt->execute();

    // Vérifier si la mise à jour a réussi
    if ($updateStmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Rôle mis à jour avec succès."]);
    } else {
        echo json_encode(["success" => false, "error" => "Aucune mise à jour effectuée."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Erreur de connexion : " . $e->getMessage()]);
    error_log("Erreur PDO : " . $e->getMessage());
}
?>
