<!DOCTYPE html>
<html>
    <head>
        <title>Register.php</title>
        <meta charset="utf-8"/>
    </head>
</html>

<body>
    <p>Page de création de compte</p>

    <?php
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

        // -------------------- Connexion à la base de données
        // Informations de connexion à la base de données
        $serveur = "localhost";
        $login = "root";
        $pw = "";
        $dbname = "gestion_projet";

        try {
            // Connexion à la base de données avec PDO (sans espace dans la chaîne de connexion)
            $connexion = new PDO("mysql:host=$serveur;dbname=$dbname", $login, $pw);
            $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "Connexion à la base de données : <b>" .$dbname. "</b> réussie<br>";
        } catch (PDOException $e) {
            die("Erreur de connexion : " . $e->getMessage());
        }

        // -------------------- Traitement du formulaire d'inscription
        // Récupération des données du formulaire HTML
        $nom = checkEntry($_POST['name']);
        $prenom = checkEntry($_POST['surname']);
        $email = checkEntry($_POST['email']);
        $mdp = $_POST['password'];
        $adminCode = checkEntry($_POST['adminCode']);
        $role = $_POST['roleSelect'];
        $codeAdmin = '010903';
        
        // Vérification des champs obligatoires
        if (!empty($nom) && !empty($prenom) && !empty($email) && !empty($mdp) && !empty($role)) {
            // Vérification du rôle et du code admin (si nécessaire)
            if ($role == "Administrateur" && $adminCode !== $codeAdmin) {
                echo "Le code d'administration est incorrect.";
                exit();
            }

            // -------------------- Insertion des données dans la table 'user' (sans IdUser car il est en AUTO_INCREMENT dans la table MySQL)
            $stmt = $connexion->prepare("INSERT INTO user (NomUser, PrenomUser, EmailUser, RoleUser) 
                                                VALUES (:name, :surname, :email, :role)");
            $stmt->bindParam(':name', $nom);
            $stmt->bindParam(':surname', $prenom);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':role', $role);
            
            if ($stmt->execute()) {
                // Récupérer l'ID auto-incrémenté du nouvel utilisateur
                $lastInsertId = $connexion->lastInsertId();
                
                // -------------------- Insérer les données de connexion dans la table 'login'
                $stmt = $connexion->prepare("INSERT INTO login (EmailLogin, mdpLogin, IdUser) 
                                            VALUES (:email, :password, :IdUser)");
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':password', $mdp);
                $stmt->bindParam(':IdUser', $lastInsertId);
                
                if ($stmt->execute()) {
                    // Renvoi un pop-up à l'utilisateur et redirige sur la page de login
                    echo "<script>
                            alert('Utilisateur enregistré avec succès ! Vous allez être redirigé vers la page de connexion.');
                            window.location.href = 'index.html';
                          </script>";
                } else {
                    echo "Erreur lors de l'enregistrement dans la table login.<br>";
                }
            } else {
                echo "Erreur lors de l'enregistrement dans la table user.<br>";
            }
        } else {
            echo "Tous les champs doivent être remplis.<br>";
        }
    ?>
</body>