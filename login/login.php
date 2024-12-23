<?php
// -------------------- Connexion à la base de données
$serveur = "db";
$login = "user";
$pw = "userpass";
$dbname = "gestion_projet";

try {
    $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

/**
 * Eneleve certains caractères indésirables de l'entrée du formulaire
 * HTML (<>, /\,  , code js, ...)
 * Permet de sécuriser le formulaire
 * 
 * @param mixed $data une donnée du formulaire (ex : $_POST['name'])
 * @return string
 */
function checkEntry($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = strip_tags($data);
    return $data;
}

// -------------------- Traitement du formulaire d'inscription
// Récupération des données du formulaire
$email = checkEntry($_POST['email']);
$mdp = checkEntry($_POST['password']);
$hashed_mdp = hash('sha256', $mdp);  // Hashage du mdp avec sha-256

// Recherche de l'utilisateur dans la table 'login'
$stmt = $connexion->prepare("SELECT * FROM login WHERE EmailLogin = :email");
$stmt->bindParam(':email', $email);
$stmt->execute();
$loginData = $stmt->fetch(PDO::FETCH_ASSOC);

// Vérification du mot de passe 
if ($loginData && $hashed_mdp === $loginData['mdpLogin']) {
    // Si le mot de passe est correct, on récupère les informations de l'utilisateur depuis la table 'user'
    $stmt = $connexion->prepare("SELECT * FROM user WHERE IdUser = :IdUser");
    $stmt->bindParam(':IdUser', $loginData['IdUser']);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);


   
    session_start();
    
    // Après authentification réussie
    if ($user) {
        // Regénérer un ID de session sécurisé
        session_regenerate_id(true);
    
        // Stocker les informations utilisateur dans la session
        $_SESSION['user_id'] = $user['IdUser'];
        $_SESSION['name'] = $user['NomUser'];
        $_SESSION['surname'] = $user['PrenomUser'];
        $_SESSION['email'] = $user['EmailUser'];
        $_SESSION['role'] = $user['RoleUser'];
    
        // Crée un cookie pour rappeler l'ID de session (facultatif, mais sécurisé)
        setcookie(
            'session_user',
            session_id(),  // L'ID actuel de la session
            [
                'expires' => time() + 3600,
                'path' => '/',
                'secure' => true,   // Utiliser HTTPS
                'httponly' => true, // Empêcher l'accès via JavaScript
                'samesite' => 'Strict' // Protéger contre les attaques CSRF
            ]
        );
    
        // Rediriger vers le tableau de bord
        header("Location: /dashboard/dashboard.php");
        exit();
    } else {
        $error = "Email ou mot de passe incorrect.";
    }
    
 
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Login.php</title>
        <meta charset="utf-8"/>
        <script src="/js_class/user.js"></script>
    </head>
    <body>
        <?php if (!empty($error)): ?>
            <p><?php echo htmlspecialchars($error); ?></p>
        <?php endif; ?>
    </body>
</html>
