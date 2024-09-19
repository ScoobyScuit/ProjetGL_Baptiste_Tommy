<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profil Utilisateur</title>
    <link rel="stylesheet" href="./css/style.css">
</head>
<body>

    <div class="profile-container">
        <h1>Profil Utilisateur</h1>

        <?php
            session_start(); // Démarre la session

            // Vérifie si l'utilisateur est connecté
            if (isset($_SESSION['user_id'])) {
                // Récupérer les informations de l'utilisateur depuis la session
                $user_id = $_SESSION['user_id'];
                $name = $_SESSION['name'] ?? '';        // Passe la valeur vide en valeur par défaut
                $surname = $_SESSION['surname'] ?? '';  // Passe la valeur vide en valeur par défaut
                $email = $_SESSION['email'] ?? '';      // Passe la valeur vide en valeur par défaut
                $role = $_SESSION['role'] ?? '';        // Passe la valeur vide en valeur par défaut

                echo "<div class='profile-info'><strong>Nom :</strong> " . htmlspecialchars(string: $name) . "</div>";
                echo "<div class='profile-info'><strong>Prénom :</strong> " . htmlspecialchars(string: $surname) . "</div>";
                echo "<div class='profile-info'><strong>Email :</strong> " . htmlspecialchars(string: $email) . "</div>";
                echo "<div class='profile-info'><strong>Rôle :</strong> " . htmlspecialchars($role) . "</div>";
            } else {
                // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
                header("Location: ../login/login.php");
                exit();
            }
        ?>

        <button class="logout-btn" onclick="window.location.href = '../../logout/logout.php';">Déconnexion</button>
    </div>

</body>
</html>
