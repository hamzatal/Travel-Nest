-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 21, 2025 at 03:58 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jobest`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `last_login`, `avatar`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@gmail.com', NULL, 'iYyoWzmoEsDrXXJUyRHSEO8m6XMYV4jng5QVkCwg.png', '$2y$10$y.it5V30.Ss9vhIK8NW1muS256YwmDyg.5vnl5FKLYlhifbdaNL.K', 'tRrSUJ0PlCfcIXStLEdkIaOAOV0o9CiytTByiTdPhhsp9Vb2SD1buXbksvR6', '2025-01-16 13:57:56', '2025-04-16 17:31:30');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `created_at`, `updated_at`) VALUES
(1, 'Bert Randolph', 'hamza.talllll@gmail.com', 'Sunt mollit vel sin', 'Ipsum consequatur ve', '2025-03-16 14:11:16', '2025-03-16 14:11:16');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `movie_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `favorites_user_id_foreign` (`user_id`),
  KEY `favorites_movie_id_foreign` (`movie_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(7, 'default', '{\"uuid\":\"4aca82d5-ff9d-41fc-abc3-47d23d7e899f\",\"displayName\":\"App\\\\Jobs\\\\DeleteUnverifiedUser\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\DeleteUnverifiedUser\",\"command\":\"O:29:\\\"App\\\\Jobs\\\\DeleteUnverifiedUser\\\":2:{s:9:\\\"\\u0000*\\u0000userId\\\";i:13;s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2024-12-05 07:08:22.150138\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"}}', 0, NULL, 1733382502, 1733378902),
(9, 'default', '{\"uuid\":\"76ea53ce-8cde-4dcf-bf36-bc76cba66e38\",\"displayName\":\"App\\\\Jobs\\\\DeleteUnverifiedUser\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\DeleteUnverifiedUser\",\"command\":\"O:29:\\\"App\\\\Jobs\\\\DeleteUnverifiedUser\\\":2:{s:9:\\\"\\u0000*\\u0000userId\\\";i:15;s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2024-12-05 07:11:01.753219\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"}}', 0, NULL, 1733382661, 1733379061);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2024_12_04_103855_create_movies_table', 1),
(6, '2024_12_04_103904_create_categories_table', 1),
(7, '2024_12_04_103933_create_favorites_table', 1),
(8, '2024_12_04_104048_create_contacts_table', 1),
(9, '2024_12_04_104116_create_reviews_table', 1),
(10, '2024_12_04_165252_create_jobs_table', 2),
(11, '2024_12_07_161707_add_columns_to_movies_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
CREATE TABLE IF NOT EXISTS `movies` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `genre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `release_date` date NOT NULL,
  `rating` decimal(3,1) NOT NULL,
  `popularity` int NOT NULL DEFAULT '0',
  `duration` int DEFAULT NULL,
  `language` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poster_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `trailer_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cast` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movies_category_id_foreign` (`category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `category_id`, `genre`, `description`, `release_date`, `rating`, `popularity`, `duration`, `language`, `poster_url`, `trailer_url`, `director`, `cast`, `is_featured`, `created_at`, `updated_at`) VALUES
(2, 'The Dark Knight', 1, 'Action', 'A thrilling action movie about the battle between Batman and the Joker.', '2008-07-18', 9.0, 95, 152, 'English', 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 'Christopher Nolan', 'Christian Bale, Heath Ledger, Aaron Eckhart', 1, '2024-12-05 09:40:57', '2024-12-05 09:40:57'),
(3, 'Inception', 1, 'Sci-Fi', 'A mind-bending journey into the world of dreams.', '2010-07-16', 8.8, 90, 148, 'English', 'https://m.media-amazon.com/images/I/61gz2gcfkAL._AC_UF894,1000_QL80_.jpg', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'Christopher Nolan', 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page', 1, '2024-12-05 09:40:57', '2024-12-05 09:40:57'),
(5, 'Avengers: Endgame', 1, 'Action', 'The Avengers assemble once more to reverse the damage caused by Thanos.', '2019-04-26', 8.4, 100, 181, 'English', 'https://m.media-amazon.com/images/I/81ai6zx6eXL._AC_SL1304_.jpg', 'https://www.youtube.com/watch?v=TcMBFSGVi1c', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans, Mark Ruffalo', 1, '2024-12-05 09:40:57', '2024-12-05 09:40:57'),
(6, 'Titanic', 2, 'Romantic', 'A love story on the ill-fated Titanic.', '1997-12-19', 7.8, 80, 195, 'English', 'https://c8.alamy.com/comp/DMBAPR/titanic-poster-for-1997-twentieth-century-fox-film-with-leonardo-di-DMBAPR.jpg', 'https://www.youtube.com/watch?v=kVrqfYjkTdQ', 'James Cameron', 'Leonardo DiCaprio, Kate Winslet, Billy Zane', 1, '2024-12-05 09:40:57', '2024-12-05 09:40:57'),
(7, 'The Shawshank Redemption', 3, 'Drama', 'Two imprisoned men bond over years.', '1994-09-23', 9.3, 95, 142, 'English', 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'https://www.youtube.com/watch?v=6hB3S9bIaco', 'Frank Darabont', 'Tim Robbins, Morgan Freeman, Bob Gunton', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(8, 'Forrest Gump', 3, 'Drama', 'The story of a man with a low IQ who achieves great things.', '1994-07-06', 8.8, 90, 142, 'English', 'https://static0.srcdn.com/wordpress/wp-content/uploads/2023/05/forrest-gump-movie-poster.jpg', 'https://www.youtube.com/watch?v=bLvqoHBptjg', 'Robert Zemeckis', 'Tom Hanks, Robin Wright, Gary Sinise', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(9, 'The Pursuit of Happyness', 3, 'Drama', 'A man faces adversity to achieve his dreams.', '2006-12-15', 8.0, 85, 117, 'English', 'https://i.ebayimg.com/images/g/XLEAAOSw-ktf4ISy/s-l1200.jpg', 'https://www.youtube.com/watch?v=89Kq8SDyvfg', 'Gabriele Muccino', 'Will Smith, Jaden Smith, Thandiwe Newton', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(10, 'Good Will Hunting', 3, 'Drama', 'A young genius struggles with personal issues.', '1997-12-05', 8.3, 85, 126, 'English', 'https://cdn11.bigcommerce.com/s-yzgoj/images/stencil/1280x1280/products/2925195/5959161/MOVAD2997__95909.1679602654.jpg?c=2', 'https://www.youtube.com/watch?v=PaZVjZEFkRs', 'Gus Van Sant', 'Matt Damon, Robin Williams, Ben Affleck', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(11, 'The Green Mile', 3, 'Drama', 'A story of a death-row corrections officer.', '1999-12-10', 8.6, 90, 189, 'English', 'https://myhotposters.com/cdn/shop/products/HP2489_cd47eaad-dce7-4f52-96c5-0f270cc76406_1024x1024.jpg?v=1571444853', 'https://www.youtube.com/watch?v=ctRK-4Vt7dA', 'Frank Darabont', 'Tom Hanks, Michael Clarke Duncan, David Morse', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(12, 'Schindler\'s List', 3, 'Drama', 'A businessman saves the lives of Jews during WWII.', '1993-12-15', 9.0, 90, 195, 'English', 'https://m.media-amazon.com/images/M/MV5BNjM1ZDQxYWUtMzQyZS00MTE1LWJmZGYtNGUyNTdlYjM3ZmVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'https://youtu.be/mxphAlJID9U?si=9Vmn_uX_F-WTrOLo', 'Steven Spielberg', 'Liam Neeson, Ben Kingsley, Ralph Fiennes', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(13, '12 Angry Men', 3, 'Drama', 'A jury deliberates the fate of a young defendant.', '1957-04-10', 8.9, 80, 96, 'English', 'https://m.media-amazon.com/images/M/MV5BYjE4NzdmOTYtYjc5Yi00YzBiLWEzNDEtNTgxZGQ2MWVkN2NiXkEyXkFqcGc@._V1_.jpg', 'https://youtu.be/TUzp2XUhskY?si=y8816dx4obJbS_5B', 'Sidney Lumet', 'Henry Fonda, Lee J. Cobb, Martin Balsam', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(14, 'A Beautiful Mind', 3, 'Drama', 'The life of a brilliant mathematician with schizophrenia.', '2001-12-21', 8.2, 85, 135, 'English', 'https://images.squarespace-cdn.com/content/v1/5c27df4a372b96a62fef2e22/1577163839182-448CPF7VEXL7HJ6SLWHO/ddsa78dtsad', 'https://youtu.be/EajIlG_OCvw?si=vpmL7dL0mqnPUUcK', 'Ron Howard', 'Russell Crowe, Ed Harris, Jennifer Connelly', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(15, 'The Fault in Our Stars', 3, 'Drama', 'A love story between two cancer patients.', '2014-06-06', 7.7, 80, 125, 'English', 'https://static.posters.cz/image/750/23563.jpg', 'https://www.youtube.com/watch?v=9ItBvH5J6ss', 'Josh Boone', 'Shailene Woodley, Ansel Elgort, Nat Wolff', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(16, 'The Pianist', 3, 'Drama', 'A pianist survives the Holocaust in Nazi-occupied Poland.', '2002-02-24', 8.5, 85, 150, 'English', 'https://image.tmdb.org/t/p/original/gGzlyG6SWKHG8SbIvUtl6rkHoTA.jpg', 'https://youtu.be/BFwGqLa_oAo?si=uKGA9l9S_uIZ955H', 'Roman Polanski', 'Adrien Brody, Thomas Kretschmann, Frank Finlay', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(17, 'The Notebook', 2, 'Romantic', 'A couple shares a lifetime of love.', '2004-06-25', 7.9, 85, 123, 'English', 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/006ae697376913.5ec3cd65d7c56.jpg', 'https://www.youtube.com/watch?v=yDJIcYE32NU', 'Nick Cassavetes', 'Ryan Gosling, Rachel McAdams, James Garner', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(18, 'Pride & Prejudice', 2, 'Romantic', 'A love story in 19th century England.', '2005-11-11', 8.1, 80, 129, 'English', 'https://m.media-amazon.com/images/I/51d5M05dlWL._AC_UF894,1000_QL80_.jpg', 'https://www.youtube.com/watch?v=1dYv5u6v55Y', 'Joe Wright', 'Keira Knightley, Matthew Macfadyen, Brenda Blethyn', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(19, 'La La Land', 2, 'Romantic', 'A musician and actress fall in love.', '2016-12-09', 8.0, 85, 128, 'English', 'https://i5.walmartimages.com/seo/La-La-Land-Movie-Poster-Poster-Print-24-x-36_20f02811-01b4-4aea-9bb2-a79942bd2642_1.856c035d66f8fd216f6d933259bc3dfb.jpeg', 'https://www.youtube.com/watch?v=0pdqf4P9MB8', 'Damien Chazelle', 'Ryan Gosling, Emma Stone, John Legend', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(20, '500 Days of Summer', 2, 'Romantic', 'A story about love and heartbreak.', '2009-07-17', 7.7, 75, 95, 'English', 'https://media.themoviedb.org/t/p/w500/f9mbM0YMLpYemcWx6o2WeiYQLDP.jpg', 'https://www.youtube.com/watch?v=PsD0NpFSADM', 'Marc Webb', 'Joseph Gordon-Levitt, Zooey Deschanel, Geoffrey Arend', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(21, 'Notting Hill', 2, 'Romantic', 'A famous actor and a common woman fall in love.', '1999-05-21', 7.9, 80, 124, 'English', 'https://www.masoncityposters.com/cdn/shop/products/Notting_Hill_Movie_Poster_27x40_large.jpg?v=1452679410', 'https://youtu.be/4RI0QvaGoiI?si=kvnYpXfFN7h4JQyB', 'Roger Michell', 'Julia Roberts, Hugh Grant, Richard McCabe', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(22, 'A Walk to Remember', 2, 'Romantic', 'A young couple experiences love, tragedy, and growth.', '2002-01-25', 7.4, 80, 101, 'English', 'https://i.pinimg.com/474x/2d/cc/8a/2dcc8a8b1cb8ad7350fcceabb8039601.jpg', 'https://youtu.be/Sht8Ok-Peuc?si=5o7gJoxG8e4C-AgY', 'Adam Shankman', 'Mandy Moore, Shane West, Peter Coyote', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(23, 'Me Before You', 2, 'Romantic', 'A young woman develops a romantic relationship with a quadriplegic man.', '2016-06-03', 7.4, 75, 110, 'English', 'https://m.media-amazon.com/images/M/MV5BZTFjMTAzZmYtM2JiNi00ZDlhLWFiMmMtMWMzM2U4NzkxMjE5XkEyXkFqcGc@._V1_.jpg', 'https://youtu.be/Eh993__rOxA?si=5eNOQtcDFu08qkHF', 'Thea Sharrock', 'Emilia Clarke, Sam Claflin, Janet McTeer', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(24, 'Crazy, Stupid, Love', 2, 'Romantic', 'A man learns life lessons after his wife leaves him.', '2011-07-29', 7.4, 70, 118, 'English', 'https://image.tmdb.org/t/p/original/p4RafgAPk558muOjnBMHhMArjS2.jpg', 'https://youtu.be/TfQkO58OY6E?si=8Sd4W5bWudKMrFek', 'Glenn Ficarra, John Requa', 'Steve Carell, Ryan Gosling, Julianne Moore', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(25, 'Love Actually', 2, 'Romantic', 'A British romantic comedy about love in different forms.', '2003-11-14', 7.6, 80, 135, 'English', 'https://pictures.abebooks.com/isbn/9781405882262-uk.jpg', 'https://youtu.be/AgrFGATOcjk?si=BOyoXMIoiLGjpoaP', 'Richard Curtis', 'Hugh Grant, Martine McCutcheon, Liam Neeson', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(28, 'Mad Max: Fury Road', 1, 'Action', 'A high-octane action film in a post-apocalyptic world.', '2015-05-15', 8.1, 90, 120, 'English', 'https://m.media-amazon.com/images/I/817J4ESrRdL._AC_SL1500_.jpg', 'https://www.youtube.com/watch?v=hEJnMQG9ev8', 'George Miller', 'Tom Hardy, Charlize Theron, Nicholas Hoult', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(29, 'Die Hard', 1, 'Action', 'A New York cop battles terrorists in a skyscraper.', '1988-07-20', 8.2, 85, 132, 'English', 'https://s3.amazonaws.com/nightjarprod/content/uploads/sites/192/2022/11/08124742/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg', 'https://youtu.be/jaJuwKCmJbY?si=tjIgtVwowFvEOdbQ', 'John McTiernan', 'Bruce Willis, Alan Rickman, Bonnie Bedelia', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(30, 'John Wick', 1, 'Action', 'A retired hitman seeks revenge for the death of his dog.', '2014-10-24', 7.4, 75, 101, 'English', 'https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg', 'https://www.youtube.com/watch?v=2AUmvWm5ZDQ', 'Chad Stahelski', 'Keanu Reeves, Michael Nyqvist, Alfie Allen', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(31, 'Gladiator', 1, 'Action', 'A betrayed general seeks revenge against the Roman emperor.', '2000-05-05', 8.5, 80, 155, 'English', 'https://m.media-amazon.com/images/I/61O9+6+NxYL._AC_UF894,1000_QL80_.jpg', 'https://youtu.be/P5ieIbInFpg?si=_a_L08eSePYS6JU5', 'Martin Scorsese', 'Leonardo DiCaprio, Jack Nicholson, Matt Damon', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(33, 'Spider-Man: No Way Home', 1, 'Action', 'Spider-Man teams up with his allies to fight against villains from other universes.', '2021-12-17', 8.3, 95, 148, 'English', 'https://m.media-amazon.com/images/I/81Fd1jD8DAL._AC_UF894,1000_QL80_.jpg', 'https://youtu.be/JfVOs4VSpmA?si=bkFRRO937wSmkoub', 'David Fincher', 'Edward Norton, Brad Pitt, Helena Bonham Carter', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(35, 'Iron Man', 1, 'Action', 'A wealthy businessman becomes a superhero.', '2008-05-02', 7.9, 85, 126, 'English', 'https://m.media-amazon.com/images/I/81JaeDQa6rS._AC_SL1319_.jpg', 'https://youtu.be/cfVY9wLKltA?si=lUR7Rsca3auB8Gy3', 'Denis Villeneuve', 'Harrison Ford, Ryan Gosling, Ana de Armas', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(36, 'Mission: Impossible - Fallout', 1, 'Action', 'A secret agent faces dangerous missions to save the world.', '2018-07-27', 7.7, 80, 147, 'English', 'https://fiu-original.b-cdn.net/fontsinuse.com/use-images/81/81650/81650.jpeg?filename=mission_impossible__fallout_ver16_xlg.jpg', 'https://www.youtube.com/watch?v=wb49-oV0F78', 'Wes Anderson', 'Edward Norton, Bill Murray, Bruce Willis', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(37, 'The Conjuring', 4, 'Horror', 'Paranormal investigators confront a dark force.', '2013-07-19', 7.5, 80, 112, 'English', 'https://m.media-amazon.com/images/I/81yAfVk+7UL._AC_UF1000,1000_QL80_.jpg', 'https://www.youtube.com/watch?v=k10ETZ41q5o', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(39, 'The Exorcist', 4, 'Horror', 'A young girl is possessed by a demon, and a priest must save her.', '1973-12-26', 8.0, 85, 122, 'English', 'https://media.posterlounge.com/img/products/770000/767647/767647_poster.jpg', 'https://youtu.be/BU2eYAO31Cc?si=Pu8Eth8SRqFqLnIs', 'Martin Scorsese', 'Leonardo DiCaprio, Tom Hanks, Mark Wahlberg', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(40, 'It', 4, 'Horror', 'A group of children must face their fears to defeat a shape-shifting entity.', '2017-09-08', 7.4, 85, 135, 'English', 'https://m.media-amazon.com/images/I/51NB383CKkL._AC_SL1200_.jpg', 'https://youtu.be/FnCdOQsX5kc?si=QatqqqefLc0-kDPm', 'George Lucas', 'Mark Hamill, Harrison Ford, Carrie Fisher', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(41, 'Hereditary', 4, 'Horror', 'A family unravels terrifying secrets about their ancestors.', '2018-06-08', 7.3, 80, 127, 'English', 'https://m.media-amazon.com/images/M/MV5BNTEyZGQwODctYWJjZi00NjFmLTg3YmEtMzlhNjljOGZhMWMyXkEyXkFqcGc@._V1_.jpg', 'https://youtu.be/V6wWKNij_1M?si=sqUI6XqVHXt8Trjo', 'James Cameron', 'Arnold Schwarzenegger, Linda Hamilton, Edward Furlong', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(42, 'Get Out', 4, 'Horror', 'A man uncovers dark secrets about his girlfriend\'s family.', '2017-02-24', 7.7, 85, 104, 'English', 'https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_.jpg', 'https://www.youtube.com/watch?v=sRfnevzM9kQ', 'Ridley Scott', 'Sigourney Weaver, Tom Skerritt, John Hurt', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(43, 'The Witch', 4, 'Horror', 'A family in 1630s New England faces supernatural horrors.', '2015-02-19', 6.9, 75, 92, 'English', 'https://ew.com/thmb/ofbMQtqQkCAew4KBVnsJ7z43zqQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-witch-b832e10e9b904a2e80e4b6d8be2b07b9.jpg', 'https://youtu.be/iQXmlf3Sefg?si=Z8WhapdWuKcWsRO-', 'Steven Spielberg', 'Richard Dreyfuss, Roy Scheider, Robert Shaw', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(44, 'The Shining', 4, 'Horror', 'A man descends into madness while guarding a remote hotel.', '1980-05-23', 8.4, 90, 146, 'English', 'https://media.posterlounge.com/img/products/710000/705435/705435_poster.jpg', 'https://www.youtube.com/watch?v=5Cb3ik6zP2I', 'Peter Jackson', 'Elijah Wood, Ian McKellen, Viggo Mortensen', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(45, 'Insidious', 4, 'Horror', 'A family is haunted by supernatural forces.', '2010-04-01', 6.8, 70, 103, 'English', 'https://m.media-amazon.com/images/M/MV5BMTYyOTAxMDA0OF5BMl5BanBnXkFtZTcwNzgwNTc1NA@@._V1_.jpg', 'https://youtu.be/zuZnRUcoWos?si=4cFIYi-a0sT7tPYc', 'Peter Jackson', 'Elijah Wood, Ian McKellen, Orlando Bloom', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(46, 'The Babadook', 4, 'Horror', 'A woman and her son are terrorized by a mysterious force.', '2014-05-22', 6.8, 70, 93, 'English', 'https://m.media-amazon.com/images/M/MV5BMTk0NzMzODc2NF5BMl5BanBnXkFtZTgwOTYzNTM1MzE@._V1_FMjpg_UX1000_.jpg', 'https://youtu.be/RT1PmPG0UlY?si=7pNq_pXTlh0mD5Q8', 'David Fincher', 'Brad Pitt, Morgan Freeman, Gwyneth Paltrow', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(49, 'The Matrix', 5, 'Sci-Fi', 'A computer hacker discovers the truth about reality.', '1999-03-31', 8.7, 90, 136, 'English', 'https://m.media-amazon.com/images/I/71PfZFFz9yL._AC_UF894,1000_QL80_.jpg', 'https://www.youtube.com/watch?v=vKQi3bBA1y8', 'Tim Burton', 'Johnny Depp, Helena Bonham Carter, Alan Rickman', 1, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(50, 'Blade Runner 2049', 5, 'Sci-Fi', 'A young blade runner uncovers a long-buried secret.', '2017-10-06', 8.0, 85, 163, 'English', 'https://m.media-amazon.com/images/I/71NPmBOdq7L._AC_UF894,1000_QL80_.jpg', 'https://www.youtube.com/watch?v=gCcx85zbxz4', 'Christopher Nolan', 'Christian Bale, Tom Hardy, Anne Hathaway', 0, '2024-12-07 06:00:00', '2024-12-07 06:00:00'),
(65, 'The Lord of the Rings: The Fellowship of the Ring', 1, 'Fantasy', 'A young hobbit must join a group of heroes to destroy a powerful ring that could bring about the end of the world.', '2001-12-19', 8.8, 100, 178, 'English', 'https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_.jpg', 'https://www.youtube.com/watch?v=V75dMMIW2B4', 'Peter Jackson', 'Elijah Wood, Ian McKellen, Viggo Mortensen', 1, '2024-12-08 07:20:00', '2024-12-08 07:20:00'),
(66, 'The Lord of the Rings: The Two Towers', 1, 'Fantasy', 'The Fellowship has broken, and new alliances must be forged to fight the dark forces threatening Middle-Earth.', '2002-12-18', 8.7, 95, 179, 'English', 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS1UDtoHBLXDUAvSgmzclpxyGDOccSL8Cm5s40mfka4g5CUL_Hk', 'https://youtu.be/ZvxEWRpzSlA?si=-rWe6hnD4EPwk7f0', 'Peter Jackson', 'Elijah Wood, Ian McKellen, Viggo Mortensen', 1, '2024-12-08 07:20:00', '2024-12-08 07:20:00'),
(67, 'The Lord of the Rings: The Return of the King', 1, 'Fantasy', 'The final battle for Middle-Earth begins, as the forces of darkness clash with the free peoples of Middle-Earth.', '2003-12-17', 8.9, 100, 201, 'English', 'https://resizing.flixster.com/dgQlkMOdYHaHzqo50dRRr8oPuv8=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzZkYzRlODUzLWUwMmItNDI5Ny1iYTZjLTU4NzQ4NmU5ODIwZi5qcGc=', 'https://www.youtube.com/watch?v=r5X-hFf6Bwo', 'Peter Jackson', 'Elijah Wood, Ian McKellen, Viggo Mortensen', 1, '2024-12-08 07:20:00', '2024-12-08 07:20:00'),
(73, 'Star Wars: A New Hope', 1, 'Sci-Fi', 'Luke Skywalker joins forces with the Rebel Alliance to fight the tyrannical Galactic Empire and rescue Princess Leia.', '1977-05-25', 8.6, 100, 121, 'English', 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSBBTGgVQq5SADx7QduQTcJZnNO2I9qHUD0iTavGzrb5Piy9PyOig0xSBuHGhBsgIT8xNs_sw', 'https://www.youtube.com/watch?v=1g3_CFmnU7k', 'George Lucas', 'Mark Hamill, Harrison Ford, Carrie Fisher', 1, '2024-12-08 07:20:00', '2024-12-08 07:20:00'),
(75, 'Star Wars: Return of the Jedi', 1, 'Sci-Fi', 'Luke Skywalker confronts Darth Vader and the Emperor, leading to a final battle to determine the fate of the galaxy.', '1983-05-25', 8.3, 90, 131, 'English', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTn3_WWnedq7QR4lHDrTZj0t2TzC7gLAIt-btmy9C1ywhqsoB0-FHPVlII9Znd8Gyl4QNaIfg', 'https://youtu.be/xPZigWFyK2o?si=TviVENBdJBaaLFE7', 'Richard Marquand', 'Mark Hamill, Harrison Ford, Carrie Fisher', 1, '2024-12-08 07:20:00', '2024-12-08 07:20:00'),
(76, 'Jurassic Park', 1, 'Sci-Fi', 'Scientists clone dinosaurs for a theme park, but chaos erupts when the creatures escape.', '1993-06-11', 8.1, 95, 127, 'English', 'https://mir-s3-cdn-cf.behance.net/project_modules/hd/f00bf346385235.58520f9022451.jpg', 'https://youtu.be/8uaNYpe5LJ0?si=wrKKSXa4L5xUG54p', 'Steven Spielberg', 'Sam Neill, Laura Dern, Jeff Goldblum', 1, '2024-12-08 07:20:00', '2024-12-08 07:20:00'),
(77, 'Avatar', 1, 'Sci-Fi', 'A paraplegic former Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.', '2009-12-18', 7.8, 90, 162, 'English', 'https://i5.walmartimages.com/seo/Avatar-2-The-Way-of-Water-Movie-Poster-Frameless-Gift-12-x-18-inch-30cm-x-46cm_5cc20bd6-a76f-46eb-acee-db59c72017f6.8bf70075e93dbb5317238e85464d655c.jpeg', 'https://www.youtube.com/watch?v=5PSNL1qE6VY', 'James Cameron', 'Sam Worthington, Zoe Saldana, Sigourney Weaver', 1, '2024-12-08 07:20:00', '2024-12-08 07:20:00'),
(79, 'Guardians of the Galaxy', 1, 'Action', 'A group of misfits join together to stop an evil villain from taking control of the universe.', '2014-08-01', 8.0, 90, 121, 'English', 'https://m.media-amazon.com/images/M/MV5BM2ZmNjQ2MzAtNDlhNi00MmQyLWJhZDMtNmJiMjFlOWY4MzcxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'https://www.youtube.com/watch?v=d96cjJhvlMA', 'James Gunn', 'Chris Pratt, Zoe Saldana, Dave Bautista', 1, '2024-12-08 07:20:00', '2024-12-08 07:20:00'),
(80, 'Black Panther', 1, 'Action', 'T’Challa, the King of Wakanda, must step up to the throne and defend his nation from a dangerous enemy.', '2018-02-16', 7.3, 90, 134, 'English', 'https://m.media-amazon.com/images/I/71uUHp9a3bL._AC_SL1000_.jpg', 'https://www.youtube.com/watch?v=xjDjIWPwcPU', 'Ryan Coogler', 'Chadwick Boseman, Michael B. Jordan, Lupita Nyong\'o', 1, '2024-12-08 07:20:00', '2024-12-08 07:20:00'),
(86, 'Pulp Fiction', 1, 'Crime', 'The lives of two mob hitmen, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', '1994-10-14', 8.9, 96, 154, 'English', 'https://images-cdn.ubuy.co.in/634d181a42c2c35c26582a9f-pulp-fiction-poster-standard-size-18-24.jpg', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', 'Quentin Tarantino', 'John Travolta, Uma Thurman, Samuel L. Jackson', 1, '2024-12-10 05:30:00', '2024-12-10 05:30:00'),
(90, 'The Godfather: Part II', 1, 'Crime', 'The early life and career of Vito Corleone are portrayed, as well as his son Michael\'s attempt to expand the family business to the United States west coast and Cuba.', '1974-12-20', 9.0, 94, 202, 'English', 'https://m.media-amazon.com/images/M/MV5BNzc1OWY5MjktZDllMi00ZDEzLWEwMGItYjk1YmRhYjBjNTVlXkEyXkFqcGc@._V1_.jpg', 'https://www.youtube.com/watch?v=9O1Iy9od7-A', 'Francis Ford Coppola', 'Al Pacino, Robert De Niro, Diane Keaton', 1, '2024-12-10 05:30:00', '2024-12-10 05:30:00'),
(91, 'Star Wars: Episode IV - A New Hope', 1, 'Sci-Fi', 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee, and two droids to save the galaxy from the Empire\'s world-destroying battle station, while also attempting to rescue Princess Leia.', '1977-05-25', 8.6, 94, 121, 'English', 'https://m.media-amazon.com/images/M/MV5BOGUwMDk0Y2MtNjBlNi00NmRiLTk2MWYtMGMyMDlhYmI4ZDBjXkEyXkFqcGc@._V1_.jpg', 'https://www.youtube.com/watch?v=1g3_CFmnU7o', 'George Lucas', 'Mark Hamill, Harrison Ford, Carrie Fisher', 1, '2024-12-10 05:30:00', '2024-12-10 05:30:00'),
(92, 'The Silence of the Lambs', 1, 'Thriller', 'A young FBI cadet must confide in an incarcerated and manipulative killer to receive his help on catching another serial killer who skins his victims.', '1991-02-14', 8.6, 92, 118, 'English', 'https://m.media-amazon.com/images/M/MV5BNDdhOGJhYzctYzYwZC00YmI2LWI0MjctYjg4ODdlMDExYjBlXkEyXkFqcGc@._V1_.jpg', 'https://www.youtube.com/watch?v=5YpPjDtwXiM', 'Jonathan Demme', 'Jodie Foster, Anthony Hopkins, Lawrence A. Bonney', 1, '2024-12-10 05:30:00', '2024-12-10 05:30:00'),
(93, 'Se7en', 1, 'Crime', 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his modus operandi.', '1995-09-22', 8.6, 92, 127, 'English', 'https://www.panicposters.com/cdn/shop/files/PP35253-seven-movie-poster.jpg?v=1687112216', 'https://www.youtube.com/watch?v=znmZoVkCjpI', 'David Fincher', 'Brad Pitt, Morgan Freeman, Gwyneth Paltrow', 1, '2024-12-10 05:30:00', '2024-12-10 05:30:00'),
(96, 'The Departed', 1, 'Crime', 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.', '2006-10-06', 8.5, 91, 151, 'English', 'https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_FMjpg_UX1000_.jpg', 'https://www.youtube.com/watch?v=zoHbT8vR9q8', 'Martin Scorsese', 'Leonardo DiCaprio, Matt Damon, Jack Nicholson', 1, '2024-12-10 05:30:00', '2024-12-10 05:30:00'),
(98, 'Fight Club', 1, 'Drama', 'An insomniac office worker and a soap salesman form an underground fight club that evolves into something much, much more.', '1999-10-15', 8.8, 95, 139, 'English', 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg', 'https://www.youtube.com/watch?v=SUXWAEX2jlg', 'David Fincher', 'Brad Pitt, Edward Norton, Helena Bonham Carter', 1, '2024-12-10 05:30:00', '2024-12-10 05:30:00'),
(99, 'The Prestige', 1, 'Drama', 'Two magicians engage in a bitter rivalry, each trying to best the other with increasingly dangerous tricks.', '2006-10-20', 8.5, 90, 130, 'English', 'https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_.jpg', 'https://www.youtube.com/watch?v=o4gHCmTQDVI', 'Christopher Nolan', 'Christian Bale, Hugh Jackman, Scarlett Johansson', 1, '2024-12-10 05:30:00', '2024-12-10 05:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 17, 'API Token', 'cdcd97181485f8e340bb4c271732250f99506c674c2722a47cc1535f688bbfdd', '[\"*\"]', NULL, NULL, '2024-12-05 14:32:58', '2024-12-05 14:32:58');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `movie_id` bigint UNSIGNED NOT NULL,
  `rating` tinyint UNSIGNED NOT NULL,
  `review` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_user_id_foreign` (`user_id`),
  KEY `reviews_movie_id_foreign` (`movie_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `features` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_devices` int NOT NULL,
  `video_quality` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `has_ads` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `deactivated_at` timestamp NULL DEFAULT NULL,
  `deactivation_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `last_login`, `password`, `remember_token`, `is_active`, `deactivated_at`, `deactivation_reason`, `created_at`, `updated_at`, `bio`, `avatar`) VALUES
(1, 'user', 'user@gmail.com', NULL, NULL, '2025-04-09 15:47:02', '$2y$10$1yr5urs2pXTZDcENrOT70.yurgYUl/bVFesWegmrqcMCiz1AnL.4i', '73WoSFu79HQYcOW3pwTN2YSehUDaHr45lWTuxdRMPWWeygGNv2s30cgKyccQ', 1, NULL, NULL, '2025-01-30 16:16:02', '2025-04-15 12:58:14', '555', NULL),
(2, 'hamza', 'hamza.talllll@gmail.com', '0772372187', '2025-04-15 14:26:23', '2025-04-16 11:02:39', '$2y$10$Jq4jkYxbF648t0UEyYjVse4Wq0sc5dijOs7I1cP.AByIpAom9H0.O', 'PVQWybguYgiJK2TcorCjR6h2qfCmWszUKIHHX6DLPVK9B0jYroVZoPVi1NiG', 1, '2025-04-16 14:42:42', NULL, '2025-04-15 13:09:08', '2025-04-16 14:42:42', 'fixed', 'avatars/rA3kxo0rpvfly5Z86oR7oDZeNGtgD0kgGDJ8tUhJ.png');

-- --------------------------------------------------------

--
-- Table structure for table `watched_movies`
--

DROP TABLE IF EXISTS `watched_movies`;
CREATE TABLE IF NOT EXISTS `watched_movies` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `movie_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `movie_id` (`movie_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
