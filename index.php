<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Site Web Simple</title>
</head>
<body>
    <header>
        <h1>Bienvenue sur mon site web simple</h1>
    </header>

    <?php        
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

            // // Test requête pour insérer une personne
            // $requete = $connexion->prepare("
            //     INSERT INTO personnes (Id, Nom, Prenom)
            //     VALUES (1, 'MINET', 'Baptiste')
            // ");
            // $requete->execute();
            // echo "Données insérées avec succès dans la table personnes <br>";

            // Test requête pour insérer une personne
            // $requete = $connexion->prepare("
            //     SELECT * FROM personnes
            // ");
            // $requete->execute();
            // echo "Données insérées avec succès dans la table personnes <br>";


            // $requete = $connexion->prepare("
            //     SELECT * FROM User
            // ");
            // $requete->execute();

            // $res = $requete->fetchAll();
            // echo"<pre>";
            // print_r(($res));
            // echo"<pre>";

        } catch (PDOException $e) {
            echo "Échec de la connexion : " . $e->getMessage();
        }
    ?>

</body>
</html>
