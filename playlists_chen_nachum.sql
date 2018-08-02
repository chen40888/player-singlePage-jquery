-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 21, 2018 at 01:35 PM
-- Server version: 5.7.19
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `playlist`
--

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
CREATE TABLE IF NOT EXISTS `playlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET hp8 COLLATE hp8_bin NOT NULL,
  `image` varchar(1000) CHARACTER SET hp8 COLLATE hp8_bin NOT NULL,
  `songs` text CHARACTER SET hp8 COLLATE hp8_bin NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `playlists`
--

INSERT INTO `playlists` (`id`, `name`, `image`, `songs`) VALUES
(1, 'chen n', 'http://stories4kid.com/313667_196.jpg', '[{\"name\":\"chek\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"},{\"name\":\"if it\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"},{\"name\":\"work\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"},{\"name\":\"finish project\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"}]'),
(2, 'chen .n.', 'http://stories4kid.com/313667_196.jpg', '[{\"name\":\"yeaa\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"},{\"name\":\"its\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"},{\"name\":\"work\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"}]'),
(3, 'yam tihoni', 'http://kb4images.com/images/image/36466818-image.jpg', '[{\"name\":\"one\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"},{\"name\":\"eyal golan\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"},{\"name\":\"kobi kobi\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"}]'),
(5, 'pop', 'http://stories4kid.com/313667_196.jpg', '[{\"name\":\"myplaylist\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"},{\"name\":\"songs\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"},{\"name\":\"chen nachum\",\"url\":\"https:\\/\\/rovimusic.rovicorp.com\\/playback.mp3?c=CwSAzLPjg8DiZlTq1a2ibf3pqi0RS20pHqZddGAWQOA=&f=J\"}]');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
