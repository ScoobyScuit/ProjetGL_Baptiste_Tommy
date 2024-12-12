MINET Baptiste et CHOUANGMALA Tommy - M1 TI

# Gestion de Projet - Documentation

## Vue d'ensemble
Cette application web permet de gérer des projets, d'organiser les tâches associées, et de suivre leur progression. Elle inclut une gestion des utilisateurs avec différents rôles (Admin, Chef, Membre) et des fonctionnalités comme la création, la modification et la suppression de projets et tâches.

## Fonctionnalités principales
- **Gestion des utilisateurs** : Gestion des différents rôles et permissions (Admin, Chef, Membre).
- **Gestion de projets** : Création, édition et suppression de projets.
- **Gestion des tâches** : Ajout de nouvelles tâches avec des champs comme le titre, la description, la priorité et la date limite.
- **Interface intuitive** : Navigation claire et accès rapide à toutes les fonctionnalités importantes.

## Prérequis
Pour exécuter ce projet, vous aurez besoin de :
- Un serveur web (par exemple : Apache ou Nginx).
- PHP 7.4 ou plus.
- Une base de données MySQL.
- Node.js (si le projet inclut un backend JavaScript).

Normalement docker installe toutes les dépendances cependant veuillez à les vérifier en cas de soucis au lancement.

## Installation
### Configuration des dépendances/initialisations
1. **Cloner le projet**
   ```bash
   git clone <URL_DU_DEPOT>
   cd Projet
   ```

2. **Configurer docker**
    - Allez dans le dossier `docker` puis lancer la configuration docker:
    ```bash
    cd docker
    docker-compose up --build
    ```
    Attention si c'est la première fois l'installation peut prendre plusieurs minutes

3. **Installer les dépendance du webSocket**
   - Allez dans le ficher `indicateur` :
    ```bash
    cd dashboard/indicateur
    ```
    - Puis installer les dépendances :
    ```bash
    npm install
    ```
4. **Installer les dépendance des tests**
   - Allez à la racine du projet :
    ```bash
    cd ../..
    ```
    - Puis installer les dépendances :
    ```bash
    npm install
    ```
    
### Lancer le projet
 - Dans le terminal où vous avez lancé cette commande :
```bash
cd docker
docker-compose up --build
```
Vérifiez si la commande est bien finie puis ouvrez votre navigateur et accédez à `http://localhost:1234` ou l'URL configurée dans le fichier `docker-compose.yml`.

### Lancer les tests
- Mettez vous à la racine du projet et lancez la commande
```bash
npm test
```

## Utilisation
- **Se connecter** : Utilisez vos identifiants pour accéder à l'application.
- **Naviguer dans le tableau de bord** : Gérez vos projets et tâches directement depuis l'interface.
- **Ajouter une tâche** : Cliquez sur le bouton « Ajouter une tâche » et remplissez les champs requis.

## Structure des dossiers
```bash
C:.
│   .gitignore
│   babel.config.js
│   gestion_projet.sql
│   jest.config.js
│   package-lock.json
│   package.json
│
├───dashboard
│   │   dashboard.php
│   │   permissions.js
│   │
│   ├───calendar
│   │   │   scriptcalendar.js
│   │   │
│   │   └───css
│   │           stylecalendar.css
│   │           styleDayCalendar.css      
│   │           styletimeline.css
│   │
│   ├───css
│   │       board.css
│   │
│   ├───indicateur
│   │       indicator.css     
│   │       package-lock.json 
│   │       package.json      
│   │       scriptindicator.js
│   │       server.js
│   │
│   └───todolist
│       │   scripttodolist.js 
│       │
│       └───css
│               addTask.css
│               checkbox.css
│               styletodolist.css
│
├───docker
│       apache.conf
│       docker-compose.yml
│       Dockerfile
│
├───Documentation
│   │   Documentation du projet.pdf
│   │   Projet Génie Logiciel 2024_2025 M1 TI Collecte des exigences.pdf
│   │   README.md
│   │   README2.md
│   │
│   └───Diagrammes UML
│           Diagramme de cas d'utilisation UML.pdf      
│           Diagramme de classe UML.pdf
│
├───fichiers_include_PHP
│   │   checkPermissions.php
│   │   config.php
│   │   getAllProjectData.php
│   │   getAllUser.php
│   │   getProjectData.php
│   │   getUserById.php
│   │   getUserData.php
│   │
│   ├───comments
│   │       addComment.php
│   │       getCommentsByTask.php
│   │       getCommentsData.php
│   │
│   ├───parametre
│   │   │   settings.html
│   │   │
│   │   ├───css
│   │   │       settings.css
│   │   │
│   │   └───js
│   │           settings.js
│   │
│   ├───profil
│   │   │   profil.html
│   │   │   updateRole.php
│   │   │
│   │   └───css
│   │           profil.css
│   │
│   ├───projet
│   │   │   addProject.php
│   │   │   deleteProject.php
│   │   │   projet.html
│   │   │   scriptproject.js
│   │   │
│   │   └───css
│   │           projet.css
│   │
│   └───task
│           addTask.php
│           assignUser.php
│           deleteTask.php
│           getTaskByProject.php
│           getTaskByProjectAndUser.php
│           getTaskData.php
│           updateTask.php
│           updateTaskStatus.php
│
├───js_class
│       comments.js
│       project.js
│       task.js
│       user.js
│
├───login
│   │   index.html
│   │   login.php
│   │   register.php
│   │
│   ├───css
│   │       style.css
│   │
│   └───js
│           script.js
│
├───logout
│       logout.php
│
└───test
        integration.test.js
        projets.test.js
        users.test.js
```
Chaque dossier correspond à une page/fonctionnalité du projet, à la racine du projet il y a les fichiers de configuration du projet (`package-lock.json et package.json`) et des test (`babel.config.js et jest.config.js`).
Le fichier base de données est `gestion_projet.sql`.

