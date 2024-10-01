<!DOCTYPE html>
<html>
    <head>
        <title>Login.php</title>
        <meta charset="utf-8"/>
        <script src="../../js_class/user.js"></script>
    </head>
</html>

<body>
    <p>Page de login</p>

    <?php
        // -------------------- Connexion à la base de données
        $serveur = "localhost";
        $login = "root";
        $pw = "";
        $dbname = "gestion_projet";

        try {
            $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
            $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "Connexion à la base de données : <b>" .$dbname. "</b> réussie<br>";
        } catch (PDOException $e) {
            die("Erreur de connexion : " . $e->getMessage());
        }

        /**
         * Eneleve certains caractères indésirables de l'entrée du formulaire
         * HTML (<>, /\,  , code js, ...)
         * Permet de sécuriser le formulaie
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
        $hashed_mdp = hash('sha256',$mdp);  // Haschage du mdp avec sha-256


        // Recherche de l'utilisateur dans la table 'login'
        $stmt = $connexion->prepare("SELECT * FROM login WHERE EmailLogin = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $loginData = $stmt->fetch(PDO::FETCH_ASSOC);     

        $test = strlen($hashed_mdp);

        // Vérification du mot de passe 
        if ($loginData && $hashed_mdp === $loginData['mdpLogin']) {

            // Si le mot de passe est correct, on récupère les informations de l'utilisateur depuis la table 'user'
            $stmt = $connexion->prepare("SELECT * FROM user WHERE IdUser = :IdUser");
            $stmt->bindParam(':IdUser', $loginData['IdUser']);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                session_start();

                // Stocker les informations de l'utilisateur dans la session
                $_SESSION['user_id'] = $user['IdUser'];
                $_SESSION['name'] = $user['NomUser'];
                $_SESSION['surname'] = $user['PrenomUser'];
                $_SESSION['email'] = $user['EmailUser'];
                $_SESSION['role'] = $user['RoleUser'];

                // Renvoi un pop-up à l'utilisateur et redirige sur la page de dashboard.php
                echo "<script>
                        window.location.href = '../dashboard/dashboard.html';
                    </script>";

            } else {
                echo "Erreur lors de la récupération des informations utilisateur.";
            }
        } else {
            echo "Email ou mot de passe incorrect.";
        }
    ?>
</body>