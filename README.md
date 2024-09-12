# Résumé du sujet
Le projet consiste à concevoir et développer un outil de gestion de projet basé sur le web, destiné aux petites et moyennes équipes. Cet outil permettra de planifier, suivre et gérer des projets à travers des fonctionnalités telles que :

1) Gestion des utilisateurs (inscription, connexion, rôles)
2) Tableau de bord avec suivi des projets et des tâches.
3) Gestion de projets et de tâches (création, suivi, dépendances).
4) Collaboration d'équipe (messagerie interne).
5) Suivi du temps passé sur les tâches.
6) Notifications et alertes pour échéances et mises à jour.
7) Conception réactive pour divers appareils.
8) Déploiement et DevOps avec un pipeline CI/CD et conteneurisation.

**Le projet comporte plusieurs phases : collecte des exigences, conception système, développement, tests, déploiement et documentation.**

# Plan de Développement
### 1. Collecte des Exigences

* Identifier les besoins des utilisateurs finaux (administrateur, chef de projet, membre d'équipe).
* Rédiger le cahier des charges (SRS) comprenant les exigences fonctionnelles (comme la gestion des tâches) et non fonctionnelles (sécurité, performance).

**Identification des parties prenantes :**

* Administrateurs : Gèrent l’ensemble des projets et des utilisateurs.
* Chefs de projet : Supervisent les projets, attribuent des tâches et suivent leur progression.
* Membres d’équipe : Travaillent sur les tâches qui leur sont assignées, enregistrent leur temps et communiquent avec les autres membres.

**Rédaction des cas d'utilisation :**

* Authentification : Les utilisateurs doivent pouvoir s’inscrire, se connecter et gérer leur profil. L’administrateur peut gérer les rôles des utilisateurs.
* Gestion des tâches : Les utilisateurs doivent pouvoir créer des projets, ajouter des tâches, définir les priorités et les échéances, et assigner des tâches aux membres de l’équipe.
* Collaboration : Un système de messagerie/commentaires doit permettre la communication sur chaque tâche.
* Suivi du temps : Les membres de l’équipe doivent pouvoir enregistrer le temps passé sur chaque tâche et générer des rapports.

**Identification des exigences fonctionnelles et non fonctionnelles :**

**Fonctionnelles :**
* Système d’authentification basé sur les rôles.
* Gestion des projets et des tâches (CRUD).
* Collaboration via un système de commentaires.
* Notifications d’échéances et d’assignations.

**Non-fonctionnelles :**
* Sécurité : Authentification sécurisée avec gestion des rôles.
* Performance : Temps de réponse rapide pour la gestion des tâches.
* Accessibilité : Conception réactive pour mobile, tablette et desktop.

**Création du document de spécification des exigences logicielles (SRS) :**

* Le SRS doit détailler chaque exigence fonctionnelle et non fonctionnelle identifiée lors de l'ingénierie des exigences. Il inclut les cas d’utilisation, les contraintes techniques, ainsi que les critères d’acceptation des différentes fonctionnalités.

### 2. Conception du Système

* Architecture : Définir une architecture client-serveur. 
* Utilisation potentielle d'un framework ou développement d'une application web.
* UI/UX : Maquettes des principales pages (tableau de bord, gestion des tâches, suivi du temps), l'interface doit être responsive et intuitive.
* Base de données : Schéma relationnel pour gérer les utilisateurs, projets, tâches, et temps.

**Structure possible de la BDD**
* Table Utilisateurs :
    * ID
    * Nom
    * Email
    * Rôle (Admin, Chef de projet, Membre)

* Table Projets :
    * ID
    * Nom du projet
    * Description
    * Date de début et date de fin
    * ID du chef de projet

* Table Tâches :
    * ID
    * Titre
    * Description
    * Statut (En attente, En cours, Terminé)
    * Priorité
    * Date d’échéance
    * ID de projet
    * Assignée à (ID utilisateur)
    
* Table Suivi du Temps :
    * ID
    * ID de la tâche
    * ID de l’utilisateur
    * Temps enregistré

* Table Commentaires :
    * ID
    * ID de la tâche
    * ID de l’utilisateur
    * Contenu du commentaire
    * Date du commentaire

* API : Conception des endpoints pour la gestion des utilisateurs, projets et tâches (CRUD).

**Fonctionnalités possibles de l'API**
* Authentification et gestion des utilisateurs :
    * Inscription d’un utilisateur.
    * Connexion d’un utilisateur.
    * Récupérer les détails des utilisateurs (admin seulement).

* Gestion des projets :
    * Récupérer la liste des projets.
    * Créer un nouveau projet.
    * Mettre à jour les détails d’un projet.
    * Supprimer un projet.

* Gestion des tâches :
    * Récupérer la liste des tâches d’un projet.
    * Créer une nouvelle tâche.
    * Mettre à jour une tâche.
    * Supprimer une tâche.

* Suivi du temps :
    * Enregistrer le temps passé sur une tâche.
    * Générer un rapport du temps passé sur un projet.


### 3. Développement
* Backend : Implémentation des fonctionnalités de gestion des utilisateurs (inscription, connexion), gestion des projets/tâches et API.
* Frontend : Développement du tableau de bord, affichage des projets, tâches, et intégration des composants réactifs pour le suivi du temps et les notifications.
* Sécurité : Mise en place de l'authentification et autorisation basée sur les rôles.
* Collaboration : Implémentation du système de commentaires et de messagerie.

### 4. Tests
* Unitaires : Tests des composants individuels (API, gestion des tâches, etc.).
* Intégration : Assurer que les différents modules fonctionnent ensemble (ex. la gestion des tâches avec le suivi du temps).
* Systèmes : Test complet de l’application pour vérifier que tout fonctionne comme prévu.

### 5. Déploiement et CI/CD
* Mise en place du pipeline CI/CD pour automatiser les tests et le déploiement.
* Conteneurisation de l’application avec Docker et déploiement sur un cloud (AWS, Azure, ou Google Cloud).

### 6. Documentation et Présentation
* Documentation complète de l’architecture, conception, API, et code.
* Présentation des fonctionnalités principales avec démonstration de l’interface utilisateur et des processus backend.
