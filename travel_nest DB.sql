-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 22, 2025 at 04:05 PM
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
-- Database: `travel_nest`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `avatar`, `last_login`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@travelnest.com', '$2y$10$apdMWrESkdI/KAsdzNgJ1esEK9FCtwAznm7OTNqBc1Qpmo.7PMp1y', 'avatars/VQtC62WKFgInrsKW8aR5p3lvNL1W8aTsY8dwvayr.jpg', '2025-05-31 07:19:32', 'Aluur9U4a1ICUhegWfn5F89l6y5jFWGs5Ke9vTmaUeYDRpKNSuUZF9QjhBQj', '2025-05-17 12:00:00', '2025-05-31 07:19:32');

-- --------------------------------------------------------

--
-- Table structure for table `checkout`
--

DROP TABLE IF EXISTS `checkout`;
CREATE TABLE IF NOT EXISTS `checkout` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `company_id` bigint UNSIGNED DEFAULT NULL,
  `destination_id` bigint UNSIGNED DEFAULT NULL,
  `package_id` bigint UNSIGNED DEFAULT NULL,
  `offer_id` bigint UNSIGNED DEFAULT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `guests` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
  `confirmation_code` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `confirmation_code` (`confirmation_code`),
  KEY `idx_bookings_user_id` (`user_id`),
  KEY `idx_bookings_status` (`status`),
  KEY `idx_bookings_check_in` (`check_in`),
  KEY `company_id` (`company_id`),
  KEY `destination_id` (`destination_id`),
  KEY `package_id` (`package_id`),
  KEY `offer_id` (`offer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `checkout`
--

INSERT INTO `checkout` (`id`, `user_id`, `company_id`, `destination_id`, `package_id`, `offer_id`, `check_in`, `check_out`, `guests`, `total_price`, `status`, `payment_method`, `confirmation_code`, `notes`, `created_at`, `updated_at`) VALUES
(16, 5, 1, 1, NULL, 3, '2025-06-20', '2025-06-25', 6, 3000.00, 'cancelled', 'cash', 'AOvZXVwlkye8', 'Quidem sunt aut voluptas officiis molestias aliquam ipsum hic pariatur Aut nesciunt', '2025-06-13 18:18:20', '2025-06-14 16:01:39'),
(17, 5, 1, 1, NULL, NULL, '2025-06-20', '2025-06-25', 1, 900.00, 'cancelled', 'cash', 'o9cKnS1K5aQe', 'Enim quos quas voluptas dolor delectus duis sit voluptates perspiciatis vero', '2025-06-14 14:55:37', '2025-06-14 16:01:58');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `companies_email_unique` (`email`),
  UNIQUE KEY `companies_license_number_unique` (`license_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `company_name`, `license_number`, `email`, `email_verified_at`, `password`, `company_logo`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Dalas Travel', 'Dalas Travel Co.', 'TRV1234', 'dalas@travelnest.com', '2025-05-17 12:00:00', '$2y$10$moR1p0zAXbkN18.XIrOmKuDy4.5c3Kc/urUmJkmhaWs18Z9Cj/CQi', 'company_logos/dIPriPxXJ2zjm616skJFupjyg4mWkaL1vf4t35Hy.jpg', 1, 'GfUsQ7ShKcaWdds4NSwxWEFpEyFZI0Jc0tdZrzQZp3T81sjohDxwZ7ADepw0', '2025-05-17 12:00:00', '2025-06-13 14:46:36'),
(2, 'Jordan Adventures', 'Jordan Adventures Ltd.', 'TRV67890', 'jordan@travelnest.com', '2025-05-17 12:00:00', '$2y$10$examplehashedpassword', 'logos/jordan.jpg', 1, NULL, '2025-05-17 12:00:00', '2025-05-17 12:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `is_read`, `created_at`, `updated_at`) VALUES
(11, 'Nour Ali', 'nour.ali@example.com', 'Petra Tour Details', 'Can you provide more details about the Petra tour?', 0, '2025-05-01 07:00:00', '2025-05-31 09:00:00'),
(12, 'Khaled Hassan', 'khaled.hassan@example.com', 'Wadi Rum Inquiry', 'What is included in the Wadi Rum package?', 1, '2025-05-01 07:00:00', '2025-05-31 09:00:00'),
(13, 'Sara Rami', 'sara.rami@example.com', 'Amman Tour Feedback', 'Great experience in Amman!', 0, '2025-05-01 07:00:00', '2025-05-31 09:00:00'),
(14, 'Omar Zaid', 'omar.zaid@example.com', 'Rome Tour Question', 'Is the Colosseum included in the Rome tour?', 1, '2025-05-01 07:00:00', '2025-05-31 09:00:00'),
(15, 'Lina Mohammad', 'lina.mohammad@example.com', 'Cairo Tour Inquiry', 'Details about the Nile cruise.', 0, '2025-05-01 07:00:00', '2025-05-31 09:00:00'),
(16, 'Odette Lane', 'hamza.talllll@gmail.com', 'Saepe sunt ut accusa', 'Sed nisi aspernatur', 0, '2025-06-13 18:32:19', '2025-06-13 18:32:19'),
(17, 'Indigo Golden', 'hamza.talllll@gmail.com', 'Blanditiis quo harum', 'Laboriosam qui mini', 0, '2025-06-13 18:39:27', '2025-06-13 18:39:27'),
(18, 'Georgia Mendoza', 'hamza.talllll@gmail.com', 'Sapiente omnis elit', 'Fugiat harum cupidat', 0, '2025-06-13 18:39:34', '2025-06-13 18:39:34'),
(19, 'Neville Meyers', 'hamza.talllll@gmail.com', 'Eius lorem rerum bea', 'Est consequuntur fug', 0, '2025-06-13 18:41:00', '2025-06-13 18:41:00');

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
CREATE TABLE IF NOT EXISTS `destinations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Beach','Mountain','City','Cultural','Adventure','Historical','Wildlife') COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` float(3,1) DEFAULT '0.0',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_destinations_location` (`location`),
  KEY `idx_destinations_category` (`category`),
  KEY `idx_destinations_is_featured` (`is_featured`),
  KEY `company_id` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`id`, `company_id`, `title`, `description`, `location`, `category`, `price`, `discount_price`, `image`, `rating`, `is_featured`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Petra', 'Explore the ancient city carved into rock.', 'Ma\'an, Jordan', 'Historical', 200.00, 180.00, 'destinations/wlRNxNj5oGJ0WuGBMpRicv83AklUeXc5fqxLRCz5.jpg', 4.8, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:24:13'),
(2, 1, 'Wadi Rum', 'Experience the stunning desert landscapes.', 'Aqaba, Jordan', 'Adventure', 150.00, 130.00, 'destinations/ZCgOic5Q1hzELpVJ8f7oOawNw4ZiU29zmhroYC1d.jpg', 4.7, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:24:39'),
(3, 2, 'Amman', 'Discover the vibrant capital of Jordan.', 'Amman, Jordan', 'City', 100.00, 90.00, 'destinations/avAQyEetRGSSEf8K2VTGFQ06bSafDRm7FJhkCXlD.jpg', 4.5, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:30:04'),
(4, 2, 'Rome', 'Visit the historic Colosseum and Roman Forum.', 'Rome, Italy', 'Historical', 250.00, 220.00, 'destinations/esZWufyW4evoxvhzN35eJJwti5XUm8s36zLlFZQg.jpg', 4.9, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:30:11'),
(5, 1, 'Cairo', 'See the Pyramids of Giza and the Nile.', 'Cairo, Egypt', 'Cultural', 180.00, 160.00, 'destinations/Z5WHSBA7XWKtwvQgfV5ZJm22vSoGfHIFhgHB8qk1.jpg', 4.6, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:30:18'),
(6, 2, 'Santorini', 'Enjoy the stunning beaches and sunsets.', 'Santorini, Greece', 'Beach', 300.00, 270.00, 'destinations/M1axycRFnTQn0jX01c69fEvVeXMRUpeOD3SwdY7E.jpg', 4.8, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:30:24'),
(7, 2, 'Dead Sea', 'Relax in the therapeutic waters.', 'Dead Sea, Jordan', 'Beach', 120.00, 100.00, 'destinations/SMGVP0SRoaZjFVvdlO8Wb0XvJ7z9OVoOnTr8A2Sc.jpg', 4.4, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:31:08'),
(8, 1, 'Paris', 'Experience the charm of the City of Lights.', 'Paris, France', 'City', 280.00, 250.00, 'destinations/a8NyPcucV0dIphUIfSLW7HLf9fNm8RDbhUXmGKjM.jpg', 4.9, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:31:15'),
(9, 1, 'Marrakech', 'Immerse in the vibrant souks and palaces.', 'Marrakech, Morocco', 'Cultural', 160.00, 140.00, 'destinations/0Hs28DRbQNG02UvfiLQkWWmKHe8MI8DAZP43s2Uy.jpg', 4.5, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:31:21'),
(10, 1, 'Cape Town', 'Explore the wildlife and scenic beauty.', 'Cape Town, South Africa', 'Wildlife', 220.00, 200.00, 'destinations/TjJqVPoLaXeqSxitOXqkrrvmVlagF3lk4OQTo8eW.jpg', 4.7, 1, 1, '2025-05-01 07:00:00', '2025-06-13 15:31:46');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `destination_id` bigint UNSIGNED DEFAULT NULL,
  `package_id` bigint UNSIGNED DEFAULT NULL,
  `offer_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_favorites_user_id` (`user_id`),
  KEY `destination_id` (`destination_id`),
  KEY `package_id` (`package_id`),
  KEY `offer_id` (`offer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `destination_id`, `package_id`, `offer_id`, `created_at`, `updated_at`) VALUES
(23, 5, 1, NULL, NULL, '2025-06-13 18:40:37', '2025-06-13 18:40:37');

-- --------------------------------------------------------

--
-- Table structure for table `hero_sections`
--

DROP TABLE IF EXISTS `hero_sections`;
CREATE TABLE IF NOT EXISTS `hero_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` text,
  `image` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hero_sections`
--

INSERT INTO `hero_sections` (`id`, `title`, `subtitle`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
(6, 'Paris Romance', 'City of Love Awaits', 'hero/1749840271.jpg', 1, '2025-05-01 07:00:00', '2025-06-13 15:44:31'),
(7, 'Marrakech Magic', 'Vibrant Souks and Palaces', 'hero/1748717970.jpg', 1, '2025-05-01 07:00:00', '2025-05-31 15:59:30'),
(8, 'Cape Town Adventure', 'Wildlife and Scenic Beauty', 'hero/1748718084.jpg', 1, '2025-05-01 07:00:00', '2025-05-31 16:01:24'),
(16, 'Petra', 'Discover the Rose City', 'hero/1747503491.jpg', 1, '2025-05-17 11:30:51', '2025-05-31 07:52:34'),
(19, 'Wadi Rum', 'Best Destinations', 'hero/1747503543.jpg', 1, '2025-05-17 11:39:03', '2025-05-21 12:12:35'),
(20, 'Roma', 'Best Destinations To Visit Is Roma', 'hero/1747503589.jpg', 1, '2025-05-17 11:39:49', '2025-05-17 11:39:49');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_jobs_queue` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
CREATE TABLE IF NOT EXISTS `offers` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` bigint UNSIGNED DEFAULT NULL,
  `destination_id` bigint UNSIGNED NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Beach','Mountain','City','Cultural','Adventure','Historical','Wildlife') COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `discount_type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` float(3,1) DEFAULT '0.0',
  `is_active` tinyint(1) DEFAULT '1',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group_size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_offers_destination_id` (`destination_id`),
  KEY `idx_offers_category` (`category`),
  KEY `idx_offers_is_active` (`is_active`),
  KEY `idx_offers_start_date` (`start_date`),
  KEY `company_id` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `company_id`, `destination_id`, `title`, `description`, `location`, `category`, `price`, `discount_price`, `discount_type`, `image`, `rating`, `is_active`, `start_date`, `end_date`, `duration`, `group_size`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Petra Summer Special', 'Limited-time discount on Petra tours.', 'Ma\'an, Jordan', 'Historical', 300.00, 270.00, 'percentage', 'offers/OtMV7MjaWI0dFHKz3yyyHxXKVH2H61CqQpMobJ6s.jpg', 4.8, 1, '2025-06-01', '2025-06-15', '3 days', '2-8', '2025-05-01 07:00:00', '2025-06-13 15:42:12'),
(2, 2, 2, 'Wadi Rum Night Camp', 'Starry desert camping experience.', 'Aqaba, Jordan', 'Adventure', 200.00, 180.00, 'fixed', 'offers/V5eIJMEDn0awYoTpFbs5SEv3vNQpLvHTDbVcnDg9.jpg', 4.7, 1, '2025-06-05', '2025-06-20', '2 days', '4-12', '2025-05-01 07:00:00', '2025-06-13 15:42:24'),
(3, 2, 3, 'Amman Cultural Deal', 'Explore Amman’s heritage with a discount.', 'Amman, Jordan', 'City', 120.00, 100.00, 'percentage', 'offers/MXFbplKYCCLqoQqEgkKz6jEwYr2ElrxxInRgdooo.jpg', 4.5, 1, '2025-06-10', '2025-06-25', '2 days', '2-8', '2025-05-01 07:00:00', '2025-06-13 15:42:36'),
(4, 1, 4, 'Rome Exclusive Offer', 'Special deal for Rome’s historical sites.', 'Rome, Italy', 'Historical', 400.00, 360.00, 'percentage', 'offers/v4XDQL1TfWh1epy1H46OAPXDntQXOcYrir1wbDzV.jpg', 4.9, 1, '2025-07-01', '2025-07-15', '4 days', '2-10', '2025-05-01 07:00:00', '2025-06-13 15:42:48'),
(5, 2, 5, 'Cairo Nile Adventure', 'Discounted Nile cruise and Pyramids tour.', 'Cairo, Egypt', 'Cultural', 250.00, 230.00, 'fixed', 'offers/8yKbnfvNbO5EsZPKIAm6fhB1IzmjfCkr8DitKvtO.jpg', 4.6, 1, '2025-06-15', '2025-06-30', '3 days', '2-12', '2025-05-01 07:00:00', '2025-06-13 15:42:58'),
(6, 1, 6, 'Santorini Sunset Deal', 'Exclusive beach and sunset tour offer.', 'Santorini, Greece', 'Beach', 450.00, 400.00, 'percentage', 'offers/h8msDwluyKJvmMGnwFyngJDsRQGGfm0ePXNUWiCh.jpg', 4.8, 1, '2025-07-10', '2025-07-25', '4 days', '2-8', '2025-05-01 07:00:00', '2025-06-13 15:43:09'),
(7, 1, 7, 'Dead Sea Spa Offer', 'Relax with a special spa package.', 'Dead Sea, Jordan', 'Beach', 180.00, 160.00, 'fixed', 'offers/qLyPjBxP1gewKq2qpGIBHaa2roKDnCLdiTcuGErP.jpg', 4.4, 1, '2025-06-20', '2025-07-05', '2 days', '2-10', '2025-05-01 07:00:00', '2025-06-13 15:43:20'),
(8, 1, 8, 'Paris Special Deal', 'Romantic Paris tour at a discount.', 'Paris, France', 'City', 350.00, 320.00, 'percentage', 'offers/ar0yj3NkVpW3VrE7FsQ2PDPDv2dRFuJJARTriCWG.jpg', 4.9, 1, '2025-07-15', '2025-07-30', '3 days', '2-6', '2025-05-01 07:00:00', '2025-06-13 15:43:27'),
(9, 1, 9, 'Marrakech Cultural Offer', 'Discounted souk and palace tour.', 'Marrakech, Morocco', 'Cultural', 200.00, 180.00, 'fixed', 'offers/AJoU6nXuuwi4SKPYu4OuraKd0o6FVRaOwml0Hynj.jpg', 4.5, 1, '2025-06-25', '2025-07-10', '3 days', '2-8', '2025-05-01 07:00:00', '2025-06-13 15:43:34'),
(10, 2, 10, 'Cape Town Safari Deal', 'Special wildlife tour offer.', 'Cape Town, South Africa', 'Wildlife', 400.00, 360.00, 'percentage', 'offers/FkP4BZkj3SM6YYU0hd7GcLMqm6y2wnM7JkZkRmGZ.jpg', 4.7, 1, '2025-07-20', '2025-08-05', '5 days', '2-12', '2025-05-01 07:00:00', '2025-06-13 15:43:40');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
CREATE TABLE IF NOT EXISTS `packages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` bigint UNSIGNED DEFAULT NULL,
  `destination_id` bigint UNSIGNED NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Beach','Mountain','City','Cultural','Adventure','Historical','Wildlife') COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `discount_type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` float(3,1) DEFAULT '0.0',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group_size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_packages_destination_id` (`destination_id`),
  KEY `idx_packages_category` (`category`),
  KEY `idx_packages_is_featured` (`is_featured`),
  KEY `idx_packages_start_date` (`start_date`),
  KEY `company_id` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `company_id`, `destination_id`, `title`, `subtitle`, `description`, `location`, `category`, `price`, `discount_price`, `discount_type`, `image`, `rating`, `is_featured`, `is_active`, `start_date`, `end_date`, `duration`, `group_size`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'Petra Historical Tour', 'Journey Through Time', '3-day tour of Petra’s ancient ruins.', 'Ma\'an, Jordan', 'Historical', 350.00, 320.00, 'percentage', 'packages/fM4t6jNtpDNisJolB9BX3XogZeqjSkSQEA9SeRpv.jpg', 4.8, 1, 1, '2025-06-15', '2025-06-30', '3 days', '2-10', '2025-05-01 07:00:00', '2025-06-13 18:15:34'),
(2, 1, 2, 'Wadi Rum Desert', 'Desert Adventure', '2-day camping and jeep tour in Wadi Rum.', 'Aqaba, Jordan', 'Adventure', 250.00, 230.00, 'fixed', 'packages/9TWLQ7j1lvvj20TdQVVJNPSvtW5vR86EjgiJAStS.jpg', 4.7, 1, 1, '2025-06-20', '2025-06-30', '2 days', '4-12', '2025-05-01 07:00:00', '2025-06-13 18:49:31'),
(3, 2, 3, 'Amman City Explorer', 'Discover the Capital', '2-day tour of Amman’s landmarks.', 'Amman, Jordan', 'City', 150.00, 130.00, 'percentage', 'packages/cdRd4e5swXMtpY1UJe0l1UPpDbKtl00kQALTxMvI.jpg', 4.5, 1, 1, '2025-06-20', '2025-06-30', '2 days', '2-8', '2025-05-01 07:00:00', '2025-06-13 18:13:28'),
(4, 2, 4, 'Rome Grand Tour', 'Ancient Wonders', '4-day tour of Rome’s historical sites.', 'Rome, Italy', 'Historical', 450.00, 400.00, 'percentage', 'packages/06CRNHzmyz5IKEICVRxA4QKIpnVqo9neI1OO1lP9.jpg', 4.9, 1, 1, '2025-06-20', '2025-07-04', '4 days', '2-10', '2025-05-01 07:00:00', '2025-06-13 18:13:47'),
(5, 2, 5, 'Cairo Cultural Experience', 'Nile Adventure', '3-day tour including the Pyramids and Nile cruise.', 'Cairo, Egypt', 'Cultural', 300.00, 270.00, 'fixed', 'packages/JlqMvzEIxqSC0V3Y1WSqxyIGsA97dxnm2GzlHWos.jpg', 4.6, 1, 1, '2025-06-15', '2025-06-17', '3 days', '2-12', '2025-05-01 07:00:00', '2025-06-13 18:13:56'),
(6, 1, 6, 'Santorini Beach Escape', 'Sunset Serenity', '4-day beach and cultural tour in Santorini.', 'Santorini, Greece', 'Beach', 500.00, 450.00, 'percentage', 'packages/b5tep4QA4nPGyqQS5otsNvWqWyYJUpTQuU5KiWJ0.jpg', 4.8, 1, 1, '2025-06-20', '2025-07-13', '4 days', '2-8', '2025-05-01 07:00:00', '2025-06-13 18:14:10'),
(7, 1, 7, 'Dead Sea Relaxation', 'Therapeutic Retreat', '2-day spa and relaxation tour.', 'Dead Sea, Jordan', 'Beach', 200.00, 180.00, 'fixed', 'packages/849Dil2e4dK5pYKDUX97KsDYJiKhRw5PAhzwtudH.jpg', 4.4, 1, 1, '2025-06-20', '2025-06-29', '2 days', '2-10', '2025-05-01 07:00:00', '2025-06-13 18:14:38'),
(8, 1, 8, 'Paris Romantic Getaway', 'City of Lights', '3-day romantic tour in Paris.', 'Paris, France', 'City', 400.00, 360.00, 'percentage', 'packages/D3mlqae0rrE5siIlNlDj5O5PkbArNaI96sIhOjiU.jpg', 4.9, 1, 1, '2025-07-15', '2025-07-17', '3 days', '2-6', '2025-05-01 07:00:00', '2025-06-13 18:14:45'),
(9, 1, 9, 'Marrakech Souk Adventure', 'Cultural Immersion', '3-day tour of Marrakech’s markets and palaces.', 'Marrakech, Morocco', 'Cultural', 250.00, 230.00, 'fixed', 'packages/7zG6TLriuhfynK9Yizce2dpXkuTFAyhkOMhKNLy4.jpg', 4.5, 1, 1, '2025-06-25', '2025-06-27', '3 days', '2-8', '2025-05-01 07:00:00', '2025-06-13 18:14:53'),
(10, 1, 10, 'Cape Town Wildlife Safari', 'Nature’s Wonders', '5-day wildlife and scenic tour.', 'Cape Town, South Africa', 'Wildlife', 450.00, 400.00, 'percentage', 'packages/F9dLm1R2BqWilPx6PbAwtE8GObO5dOgiWoiZK6B3.jpg', 4.7, 1, 1, '2025-07-20', '2025-07-24', '5 days', '2-12', '2025-05-01 07:00:00', '2025-06-13 18:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `reviewable_type` enum('destination','package','offer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewable_id` bigint UNSIGNED NOT NULL,
  `rating` float(3,1) NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_user_id` (`user_id`),
  KEY `idx_reviews_reviewable` (`reviewable_type`,`reviewable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sessions_user_id` (`user_id`),
  KEY `idx_sessions_last_activity` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('d8HtdgZGUyzFNobBSPu6Yh9SE1L16TMNHG58BlHa', 5, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiR1dMV3ZqemRlb2JDd2VEM0xpdWZqQ1VaeTc0djhFeU1HRU1IUm9WNiI7czo1MjoibG9naW5fYWRtaW5fNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjQ0OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvaW1hZ2VzL3BsYWNlaG9sZGVyLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjU7fQ==', 1750608334);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `deactivated_at` timestamp NULL DEFAULT NULL,
  `deactivation_reason` text COLLATE utf8mb4_unicode_ci,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `avatar`, `bio`, `is_active`, `deactivated_at`, `deactivation_reason`, `remember_token`, `created_at`, `updated_at`) VALUES
(5, 'User', 'hamza.talllll@gmail.com', '07777777', '2025-05-31 18:46:32', '$2y$10$lV.Mgoh6Hf2zQaPt88nTlehBOzgiDrSltwU8cvpn05rMjIhSJIuPu', 'avatars/OVeFqs6RKM8a4nrqRCQCKyzGA9TuKCciiJpJCw1d.png', 'TravelNest', 1, NULL, NULL, 'rUi513l6biUbot930RaSpadhprKSJgXjN5eLvoYtZoupYDKiQ46CZQ6xOyXb', '2025-05-19 09:54:03', '2025-06-21 10:47:32');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `checkout`
--
ALTER TABLE `checkout`
  ADD CONSTRAINT `checkout_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `checkout_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `checkout_ibfk_3` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `checkout_ibfk_4` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `checkout_ibfk_5` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `destinations`
--
ALTER TABLE `destinations`
  ADD CONSTRAINT `destinations_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_3` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_4` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `offers_ibfk_2` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `packages`
--
ALTER TABLE `packages`
  ADD CONSTRAINT `packages_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `packages_ibfk_2` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
