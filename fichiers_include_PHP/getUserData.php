<?php
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

        // Récupérer les informations de l'utilisateur
        $stmt = $connexion->prepare("SELECT * FROM user WHERE IdUser = :IdUser");
        $stmt->bindParam(':IdUser', $_SESSION['user_id']);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode($user);  // Retourner les données utilisateur au format JSON
        } else {
            echo json_encode(['error' => 'Utilisateur non trouvé.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Erreur de connexion : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Utilisateur non connecté.']);
}
?>
