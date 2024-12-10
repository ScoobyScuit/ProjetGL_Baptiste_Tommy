<?php
header('Content-Type: application/json');
session_start(); // Démarre la session pour vérifier les autorisations

// Vérification de l'authentification de l'utilisateur
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "Utilisateur non connecté."]);
    exit;
}

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

    // Vérifier si les paramètres requis sont présents
    if (!isset($input['taskId'], $input['userId'])) {
        echo json_encode(["success" => false, "error" => "Paramètres manquants."]);
        exit;
    }

    $taskId = $input['taskId'];
    $userId = $input['userId'];

    // Vérifier si la tâche existe
    $taskStmt = $connexion->prepare("SELECT * FROM task WHERE IdTask = :taskId");
    $taskStmt->bindParam(':taskId', $taskId, PDO::PARAM_INT);
    $taskStmt->execute();

    if ($taskStmt->rowCount() === 0) {
        echo json_encode(["success" => false, "error" => "Tâche non trouvée."]);
        exit;
    }

    // Vérifier si l'utilisateur existe
    $userStmt = $connexion->prepare("SELECT * FROM user WHERE IdUser = :userId");
    $userStmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $userStmt->execute();

    if ($userStmt->rowCount() === 0) {
        echo json_encode(["success" => false, "error" => "Utilisateur non trouvé."]);
        exit;
    }

    // Mettre à jour la tâche pour assigner l'utilisateur
    $updateStmt = $connexion->prepare("
        UPDATE task 
        SET IdUser = :userId 
        WHERE IdTask = :taskId
    ");
    $updateStmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $updateStmt->bindParam(':taskId', $taskId, PDO::PARAM_INT);
    $updateStmt->execute();

    // Vérification de la mise à jour
    if ($updateStmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Utilisateur assigné avec succès à la tâche."]);
    } else {
        echo json_encode(["success" => false, "error" => "Aucune mise à jour effectuée."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Erreur de connexion : " . $e->getMessage()]);
    error_log("Erreur PDO : " . $e->getMessage());
}
?>
