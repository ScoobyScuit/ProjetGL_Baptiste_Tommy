<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion de Projet</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="indicator.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
    <body>
        <div class="dashboard">

            <!-- Start Navbar -->
            <?php
                // Inlcude le fichier php contenant la navbar pour ne pas la ré-écrire dans chaque fichier
                include "../fichiers_include_PHP/navbar.php";
            ?>
            <!-- End Navbar -->

            <!-- Start Dashboard container -->
            <div class="main-dashboard">
                <div class="all-progress">
                    <div class="indicator-progress">
                        <div class="title-indicator-progress">
                            <h2>Progress Projet</h2>
                        </div> 
                        <div class="progress-container">
                            <svg width="100%" height="100%" viewBox="0 0 400 220">
                                <path class="progress-background" d="M80 190 A120 120 0 0 1 320 190" />
                                <path class="progress-bar" d="M80 190 A120 120 0 0 1 320 190" id="progressBar" />
                                <circle class="start-point" cx="80" cy="190" r="4%" id="startPoint" />
                                <text class="progress-text" x="200" y="190" text-anchor="middle" id="progressText">0%</text>
                            </svg>
                        </div>
                        
                    </div>
                </div>
                <div class="calendar-progress">

                </div>
            </div>
            <!-- End Dashboard container -->
             
            <script src="script.js"></script>
            <script src="https://kit.fontawesome.com/cd0d448035.js" crossorigin="anonymous"></script>
        </div>
    </body>
</html>
