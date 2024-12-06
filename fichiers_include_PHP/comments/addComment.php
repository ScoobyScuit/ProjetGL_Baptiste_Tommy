<?php
session_start();

header('Content-Type: application/json');

// Vérifiez si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté.']);
    exit;
}

// Lire les données JSON de la requête POST
$input = json_decode(file_get_contents('php://input'), true);

// Valider les données envoyées
if (!isset($input['idUser']) || !isset($input['idTask']) || !isset($input['content']) || empty($input['content'])) {
    echo json_encode(['success' => false, 'error' => 'Données invalides.']);
    exit;
}

$idUser = intval($input['idUser']);
$idTask = intval($input['idTask']);
$content = htmlspecialchars($input['content'], ENT_QUOTES, 'UTF-8'); // Protection XSS
$date = isset($input['date']) ? $input['date'] : date('Y-m-d'); // Utiliser la date envoyée ou la date actuelle

$serveur = "db";
$login = "user";
$pw = "userpass";
$dbname = "gestion_projet";

try {
    $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Insérer le commentaire dans la table "comments"
    $stmt = $connexion->prepare("
        INSERT INTO comments (IdTask, IdUser, ContentCom, DateCom)
        VALUES (:IdTask, :IdUser, :ContentCom, :DateCom)
    ");
    $stmt->bindParam(':IdTask', $idTask, PDO::PARAM_INT);
    $stmt->bindParam(':IdUser', $idUser, PDO::PARAM_INT);
    $stmt->bindParam(':ContentCom', $content, PDO::PARAM_STR);
    $stmt->bindParam(':DateCom', $date, PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'insertion du commentaire.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Erreur de connexion : ' . $e->getMessage()]);
}
?>
