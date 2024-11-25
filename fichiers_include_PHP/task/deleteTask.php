<?php
session_start();

if (isset($_GET['id'])) {
    $taskId = $_GET['id'];
    $serveur = "db";
    $login = "user";
    $pw = "userpass";
    $dbname = "gestion_projet";

    try {
        $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $connexion->prepare("DELETE FROM task WHERE idTask = :id"); // Assurez-vous que c'est le bon nom de table et de colonne
        $stmt->bindParam(':id', $taskId);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Aucune tâche trouvée avec cet ID.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'ID de tâche non spécifié.']);
}
?>
