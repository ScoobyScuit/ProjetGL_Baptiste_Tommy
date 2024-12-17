-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 18 nov. 2024 à 13:44
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_projet`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `IdCom` int NOT NULL AUTO_INCREMENT,
  `IdTask` int NOT NULL,
  `IdUser` int NOT NULL,
  `ContentCom` varchar(500) NOT NULL,
  `DateCom` date NOT NULL,
  PRIMARY KEY (`IdCom`,`IdUser`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `login`
--

DROP TABLE IF EXISTS `login`;
CREATE TABLE IF NOT EXISTS `login` (
  `EmailLogin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mdpLogin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IdUser` int NOT NULL,
  PRIMARY KEY (`EmailLogin`,`mdpLogin`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `login`
--

INSERT INTO `login` (`EmailLogin`, `mdpLogin`, `IdUser`) VALUES
('tmy@gmail.com', '03042cf8100db386818cee4ff0f2972431a62ed78edbd09ac08accfabbefd818', 30),
('bminet08@gmail.com', '03042cf8100db386818cee4ff0f2972431a62ed78edbd09ac08accfabbefd818', 31);

-- --------------------------------------------------------

--
-- Structure de la table `project`
--

DROP TABLE IF EXISTS `project`;
CREATE TABLE IF NOT EXISTS `project` (
  `IdProject` int NOT NULL AUTO_INCREMENT,
  `NomProject` varchar(500) NOT NULL,
  `DescriptionProject` varchar(500) DEFAULT NULL,
  `DateDebProject` date DEFAULT NULL,
  `DateFinProject` date DEFAULT NULL,
  `IdChef` int NOT NULL,
  PRIMARY KEY (`IdProject`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `project`
--

INSERT INTO `project` (`IdProject`, `NomProject`, `DescriptionProject`, `DateDebProject`, `DateFinProject`, `IdChef`) VALUES
(1, 'Projet Test', 'Test de projet 01', '2024-09-04', '2024-09-28', 30),
(2, 'Projet Test bis', 'Test de projet 02', '2024-09-23', '2024-12-12', 30);

-- --------------------------------------------------------

--
-- Structure de la table `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `IdTask` int NOT NULL AUTO_INCREMENT,
  `TitreTask` varchar(200) NOT NULL,
  `DescriptionTask` varchar(500) NOT NULL,
  `StatutTask` enum('En cours','Terminée','En attente') NOT NULL,
  `PrioriteTask` int NOT NULL,
  `DateEchTask` date NOT NULL,
  `DateDebTask` date NOT NULL,
  `IdProject` int NOT NULL,
  `IdUser` int NOT NULL,
  PRIMARY KEY (`IdTask`,`IdProject`,`IdUser`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `task`
--

INSERT INTO `task` (`IdTask`, `TitreTask`, `DescriptionTask`, `StatutTask`, `PrioriteTask`, `DateDebTask`, `DateEchTask`, `IdProject`, `IdUser`) VALUES
(11, 'Finir calendar', 'Lier le calendrier et le js', 'En cours', 1, '2024-09-15', '2024-11-15', 1, 30),
(10, 'tache 2', 'sdsd', 'En attente', 2, '2024-09-15', '2024-09-29', 1, 31),
(7, 'sd', 'sd', 'En attente', 3, '2024-09-15', '2024-09-29', 2, 30),
(8, 'Tache 1', 'wlh ca marche', 'En cours', 1, '2024-09-15', '2024-09-30', 2, 30);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `IdUser` int NOT NULL AUTO_INCREMENT,
  `NomUser` varchar(200) NOT NULL,
  `PrenomUser` varchar(200) NOT NULL,
  `EmailUser` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RoleUser` enum('Administrateur','Chef de projet','Membre') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`IdUser`),
  UNIQUE KEY `EmailUser` (`EmailUser`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`IdUser`, `NomUser`, `PrenomUser`, `EmailUser`, `RoleUser`) VALUES
(30, 'CHOUANGMALA', 'Tommy', 'tmy@gmail.com', 'Chef de projet'),
(31, 'MINET', 'Baptiste', 'bminet08@gmail.com', 'Membre');

-- --------------------------------------------------------

COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
