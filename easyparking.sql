-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 19, 2024 at 10:58 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `easyparking`
--
CREATE DATABASE IF NOT EXISTS `easyparking` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `easyparking`;

-- --------------------------------------------------------

--
-- Table structure for table `47_maple_ave_central_business_district`
--

DROP TABLE IF EXISTS `47_maple_ave_central_business_district`;
CREATE TABLE IF NOT EXISTS `47_maple_ave_central_business_district` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `123_main_st_downtown_city`
--

DROP TABLE IF EXISTS `123_main_st_downtown_city`;
CREATE TABLE IF NOT EXISTS `123_main_st_downtown_city` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `123_main_st_downtown_city`
--

INSERT INTO `123_main_st_downtown_city` (`id`, `firstname`, `surname`, `email`, `phone`) VALUES
(26, 'hi', 'hi', 'hi@gmail.com', '98786793'),
(27, 'Jovenn', 'hans', 'jo@gmail.com', '98765432');

-- --------------------------------------------------------

--
-- Table structure for table `862_cedar_st_riverside_community`
--

DROP TABLE IF EXISTS `862_cedar_st_riverside_community`;
CREATE TABLE IF NOT EXISTS `862_cedar_st_riverside_community` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `862_cedar_st_riverside_community`
--

INSERT INTO `862_cedar_st_riverside_community` (`id`, `firstname`, `surname`, `email`, `phone`) VALUES
(2, 'Jovenn', 'hans', 'jo@gmail.com', '98765432'),
(10, 'bob', 'bob', 'bob@gmail.com', '98786767'),
(11, 'hi', 'hi', 'hi@gmail.com', '98786793');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(128) NOT NULL,
  `firstname` varchar(128) NOT NULL,
  `surname` varchar(128) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `type`, `firstname`, `surname`, `phone`, `email`, `password`) VALUES
(1, 'Admin', 'Admin', 'Admin', '98765432', 'admin@gmail.com', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `bobbob`
--

DROP TABLE IF EXISTS `bobbob`;
CREATE TABLE IF NOT EXISTS `bobbob` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `Location` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `checkIn` varchar(50) NOT NULL,
  `checkOut` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bobbob`
--

INSERT INTO `bobbob` (`id`, `Location`, `Description`, `checkIn`, `checkOut`) VALUES
(1, '862_Cedar_St_Riverside_Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 16:13', '2024-02-19 08:14:01'),
(2, '862_Cedar_St_Riverside_Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 16:16', '2024-02-19 08:16:19');

-- --------------------------------------------------------

--
-- Table structure for table `hihi`
--

DROP TABLE IF EXISTS `hihi`;
CREATE TABLE IF NOT EXISTS `hihi` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `Location` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `checkIn` varchar(50) NOT NULL,
  `checkOut` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hihi`
--

INSERT INTO `hihi` (`id`, `Location`, `Description`, `checkIn`, `checkOut`) VALUES
(1, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-15 22:24', '2024-02-15 14:24:44'),
(2, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-16 23:23', '2024-02-16 17:53:44'),
(3, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 02:40', '2024-02-16 18:41:22'),
(4, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 00:44', '2024-02-16 18:44:22'),
(5, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 00:44', '2024-02-16 18:45:18'),
(6, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 03:56', '2024-02-16 19:57:14'),
(7, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 07:30', '2024-02-16 23:30:55'),
(8, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 07:30', '2024-02-16 23:31:17'),
(9, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 07:30', '2024-02-16 23:34:23'),
(10, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 07:30', '2024-02-16 23:37:35'),
(11, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 07:30', '2024-02-16 23:43:42'),
(12, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 07:30', '2024-02-16 23:45:25'),
(13, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-17 07:30', '2024-02-16 23:47:08'),
(14, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-18 14:44', '2024-02-18 06:45:15'),
(15, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-18 14:44', '2024-02-18 06:46:58'),
(16, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-18 21:47', '2024-02-18 13:48:05'),
(17, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-14 22:31', '2024-02-18 14:31:44'),
(18, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:20', '2024-02-18 19:30:41'),
(19, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:31', '2024-02-18 19:33:07'),
(20, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:31', '2024-02-18 19:33:09'),
(21, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:33', '2024-02-18 19:33:58'),
(22, '862 Cedar St, Riverside Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 15:56', '2024-02-19 07:56:46'),
(23, '862 Cedar St, Riverside Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 15:56', '2024-02-19 07:57:31'),
(24, '862 Cedar St, Riverside Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 15:57', '2024-02-19 07:59:37'),
(25, '862 Cedar St, Riverside Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 15:59', '2024-02-19 08:04:28'),
(26, '862 Cedar St, Riverside Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 16:05', '2024-02-19 08:08:50'),
(27, '862 Cedar St, Riverside Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 16:09', '2024-02-19 08:09:22'),
(28, '', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 16:09', '2024-02-19 08:13:34');

-- --------------------------------------------------------

--
-- Table structure for table `jovennhans`
--

DROP TABLE IF EXISTS `jovennhans`;
CREATE TABLE IF NOT EXISTS `jovennhans` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `Location` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `checkIn` varchar(50) NOT NULL,
  `checkOut` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jovennhans`
--

INSERT INTO `jovennhans` (`id`, `Location`, `Description`, `checkIn`, `checkOut`) VALUES
(1, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:23', '2024-02-18 16:24:08'),
(2, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:23', '2024-02-18 16:27:44'),
(3, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:23', '2024-02-18 16:28:42'),
(4, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:29', '2024-02-18 16:29:16'),
(5, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:29', '2024-02-18 16:30:00'),
(6, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:29', '2024-02-18 16:31:12'),
(7, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:29', '2024-02-18 16:32:11'),
(8, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:32', '2024-02-18 16:32:28'),
(9, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:32', '2024-02-18 16:32:48'),
(10, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:32', '2024-02-18 16:35:37'),
(11, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:35', '2024-02-18 16:35:49'),
(12, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:36', '2024-02-18 16:36:10'),
(13, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:36', '2024-02-18 16:38:30'),
(14, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:36', '2024-02-18 16:38:41'),
(15, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:39', '2024-02-18 16:39:15'),
(16, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 00:39', '2024-02-18 16:39:39'),
(17, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:34', '2024-02-18 19:34:49'),
(18, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:35', '2024-02-18 19:35:39'),
(19, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:35', '2024-02-18 19:35:49'),
(20, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:35', '2024-02-18 19:37:49'),
(21, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:35', '2024-02-18 19:44:34'),
(22, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:45', '2024-02-18 19:45:17'),
(23, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:45', '2024-02-18 19:45:24'),
(24, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', '2024-02-19 03:45', '2024-02-18 19:45:42'),
(25, '47 Maple Ave, Central Business District', 'High-capacity parking structure, with electric vehicle charging points.', '2024-02-19 09:05', '2024-02-19 01:23:42'),
(26, '47 Maple Ave, Central Business District', 'High-capacity parking structure, with electric vehicle charging points.', '2024-02-19 09:05', '2024-02-19 01:24:36'),
(27, '47 Maple Ave, Central Business District', 'High-capacity parking structure, with electric vehicle charging points.', '2024-02-19 09:05', '2024-02-19 01:25:02'),
(28, '862 Cedar St, Riverside Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 09:26', '2024-02-19 01:26:48'),
(29, '862 Cedar St, Riverside Community', 'Indoor parking with security cameras, monthly passes available.', '2024-02-19 09:26', '2024-02-19 05:22:29');

-- --------------------------------------------------------

--
-- Table structure for table `parkinglocation`
--

DROP TABLE IF EXISTS `parkinglocation`;
CREATE TABLE IF NOT EXISTS `parkinglocation` (
  `ParkingID` int NOT NULL AUTO_INCREMENT,
  `Location` varchar(225) NOT NULL,
  `Description` varchar(225) NOT NULL,
  `ParkingSpaces` int NOT NULL,
  `CostperHour` varchar(20) NOT NULL,
  `CostforLate` varchar(20) NOT NULL,
  PRIMARY KEY (`ParkingID`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `parkinglocation`
--

INSERT INTO `parkinglocation` (`ParkingID`, `Location`, `Description`, `ParkingSpaces`, `CostperHour`, `CostforLate`) VALUES
(12, '47 Maple Ave, Central Business District', 'High-capacity parking structure, with electric vehicle charging points.', 0, '$2', '$7'),
(11, '862 Cedar St, Riverside Community', 'Indoor parking with security cameras, monthly passes available.', 137, '$4', '$6'),
(10, '123 Main St, Downtown City', 'Covered parking garage close to shopping district. Security patrols and CCTV in operation 24/7.', 122, '$3', '$5');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `types` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `firstname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `surname` varchar(128) NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(20) NOT NULL,
  `Location` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `types`, `firstname`, `surname`, `phone`, `email`, `password`, `status`, `Location`) VALUES
(14, 'User', 'hi', 'hi', '98786793', 'hi@gmail.com', '$2y$10$fEo4QJF1GaLxjceRflSvHePxLtbjbBoGZL687rgL8SVYVmhWARBvu', 'Check-In', '862_Cedar_St_Riverside_Community'),
(15, 'User', 'Jovenn', 'hans', '98765432', 'jo@gmail.com', '$2y$10$7nlwbgZ5fpIBpEIHwSfQXuT3E1Ugg.9l3NSBhh3YDPw9HmR3Nhj8C', 'Check-In', '123_Main_St_Downtown_City'),
(16, 'User', 'bob', 'bob', '98786767', 'bob@gmail.com', '$2y$10$6sg.gj0C6lsP5YGSp/zeQOkC27v.t3ZF/f5v497vHHViWGVGKJEA6', 'Check-In', '862_Cedar_St_Riverside_Community');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
