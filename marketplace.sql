CREATE DATABASE IF NOT EXISTS `marketplace`;
USE `marketplace`;

-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: marketplace
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `imagen_icono` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (7,'hola','',NULL),(8,'grjoo','jogre',NULL),(9,'industria',NULL,'/uploads/1772070345346-718277019.jpg'),(11,'kkkkk',' svns','/uploads/1772585142540-415515025.png');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,12,1,2,150.00,300.00),(2,12,5,1,150.00,150.00),(5,21,1,2,50.00,100.00),(6,22,4,2,5.00,10.00),(7,23,4,2,5.00,10.00),(8,24,4,2,5.00,10.00),(9,25,4,2,5.00,10.00),(10,26,4,2,5.00,10.00),(11,27,1,1,5.00,5.00),(12,28,2,2,5.00,10.00),(13,29,4,2,5.00,10.00);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  `shipping_address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (3,2,200.00,'pending','calle 30 55 33','2026-02-21 17:47:22'),(7,8,4.00,'pending',NULL,'2026-02-25 01:00:22'),(8,7,300.00,'pending',NULL,'2026-02-25 01:43:21'),(12,7,450.00,'pending','Calle 50 #12-34, Bogotá','2026-02-25 02:40:43'),(21,7,100.00,'pending','nlasxsnaklx','2026-02-25 17:47:01'),(22,7,10.00,'pending','Calle','2026-02-25 23:44:16'),(23,7,10.00,'pending','Calle','2026-02-25 23:44:50'),(24,7,0.00,'pending','Calle Falsa 123','2026-02-25 23:55:16'),(25,7,10.00,'pending','Calle Falsa 123','2026-02-25 23:58:38'),(26,7,10.00,'pending','Calle Falsa 123','2026-02-26 00:07:22'),(27,7,5.00,'pending','Calle123','2026-02-26 00:08:12'),(28,7,10.00,'shipped','Calle123','2026-02-26 00:11:22'),(29,7,10.00,'pending','Calle Falsa 123','2026-02-26 00:15:39');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `seller_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'jabon','Descripción no disponible en este momento.',4.00,74,NULL,2,NULL,'2026-02-21 17:44:41'),(2,'celular','Description not available at the moment.',400.00,75,NULL,2,NULL,'2026-02-21 17:50:48'),(3,'tablet','Description not available at the moment.',400.00,77,NULL,2,NULL,'2026-02-21 17:53:02'),(4,'tablet','Description not available at the moment.',400.00,55,NULL,2,NULL,'2026-02-21 17:54:19'),(5,'tablet','Description not available at the moment.',400.00,67,NULL,2,NULL,'2026-02-21 17:55:32'),(6,'tablet','Description not available at the moment.',400.00,67,NULL,2,NULL,'2026-02-21 17:55:36'),(7,'tablet','Description not available at the moment.',400.00,67,NULL,2,NULL,'2026-02-21 17:55:38'),(8,'azucar','Description not available at the moment.',2.00,88,NULL,2,NULL,'2026-02-21 18:01:20'),(9,'azucar','Description not available at the moment.',2.00,88,NULL,2,NULL,'2026-02-21 18:03:37'),(10,'agua','Description not available at the moment.',1.00,100,NULL,2,NULL,'2026-02-21 18:05:29'),(11,'sal','Description not available at the moment.',1.00,100,NULL,2,NULL,'2026-02-21 18:06:42'),(12,'axuzar','Description not available at the moment.',1.00,99,NULL,7,NULL,'2026-02-23 02:26:18'),(13,'sopa','Un producto excelente que supera las expectativas del mercado.',3.00,1000,NULL,7,NULL,'2026-02-23 02:50:08'),(14,'imac','Un producto excelente que supera las expectativas del mercado.',3.00,1000,NULL,7,NULL,'2026-02-23 02:50:43'),(15,'iphone','Un artículo exclusivo diseñado para elevar tu experiencia diaria.',1000.00,20,NULL,7,NULL,'2026-02-23 02:54:10'),(16,'azucar morena','Un artículo exclusivo diseñado para elevar tu experiencia diaria.',2.00,20,NULL,7,NULL,'2026-02-23 02:54:38'),(17,'azucar morena','Calidad excepcional y diseño innovador pensados para tu estilo de vida.',2.00,20,NULL,7,NULL,'2026-02-23 02:58:50'),(18,'azucar morena','',2.00,20,NULL,7,NULL,'2026-02-23 02:59:17'),(19,'oro','Calidad excepcional y diseño innovador pensados para tu estilo de vida.',1000.00,20,NULL,7,NULL,'2026-02-23 03:01:42'),(20,'telfono samsung s25 ultra','Calidad superior diseñada para las exigencias de hoy.',1000.00,30,NULL,7,NULL,'2026-02-23 03:06:39'),(23,'jugo','Calidad excepcional en cada detalle.',3.00,100,NULL,7,NULL,'2026-02-25 02:19:00'),(26,'Nuevo Producto','Descripción del producto',10.99,50,NULL,7,NULL,'2026-02-26 01:56:29'),(27,'Zapatos','Calidad excepcional y diseño único en cada detalle.',10.99,50,NULL,7,NULL,'2026-02-26 16:05:40');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,3,7,5,'any','2026-02-23 02:41:15'),(2,3,7,5,'bueno','2026-02-23 02:41:28'),(3,3,7,5,'','2026-02-23 02:53:20'),(4,3,8,5,'','2026-02-25 00:48:36'),(5,2,7,2,'','2026-02-25 01:43:59'),(6,2,7,2,'hola','2026-02-25 01:44:34'),(7,2,7,4,'hvshbv','2026-02-25 02:22:47'),(8,3,7,4,'vrhbfwkrw','2026-02-25 02:52:30');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('buyer','seller','admin') DEFAULT 'buyer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@test.com','hashed_pass','admin','2026-02-21 17:23:51'),(2,'juano','juanos@gmail.com','$2b$10$Q6LVRfnLyMml3XBSb0pLUu97exjukXDBwBFmV64tkQ0lI2W5.W9Jq','admin','2026-02-21 17:41:56'),(3,'Juan','juanpa@gmail.com','$2b$10$v7BBaBXEt0Hula/JqJSoQObOzXwni0OjMbhB/dtFq2O/5v7n3cwXG','admin','2026-02-23 00:47:10'),(4,'euegun','juaniu@gmail.com','$2b$10$glGO8gJ9Qgn4rOOdvIX.xe8A.ogT6hauDKyPdN7oUrM8t/aoQLRk2','seller','2026-02-23 01:30:23'),(5,'jj','jj@gmail.com','$2b$10$nkB7NcQA/jwBaJHORjGJsOlGDUHIhxwOd1x0EGKQim4pxTRFGqp8G','seller','2026-02-23 02:18:11'),(7,'jjj','jjj@gmail.com','$2b$10$TEvzQxWwpLeLBjV//GssauctBx1Ey3QDnRPOUdbKSWg51DsUWzd6e','admin','2026-02-23 02:20:15'),(8,'Daniel','dani@gmail.com','$2b$10$fHGDKE/2pQk5kv8Vwn8cRuJGghePE2r5SsURxYUJelCvLEiPMyGha','admin','2026-02-25 00:41:52'),(9,'jcbsk','nvn@gmail.com','$2b$10$L9X6NyviVaOAtwFmIhRZvu7wJSrnMDvqHMBBLRN6yIgfXAdCUbLqW','admin','2026-02-25 01:36:46'),(10,'sognrsn','sosfpi@gmail.com','$2b$10$GvFegmdW.nCV1jsROQoEyeGCvfO5dCcoosHUlC46.gbEzCFU7x.Qy','admin','2026-02-25 02:14:08'),(11,'vdrjbPerez','hkghwjk@gmail.com','$2b$10$BPiJ654NW232qkIHCOnIJOZzyyP66eahNx.f59SCUz7CSa9fg5/gm','admin','2026-02-26 01:33:37'),(13,'Juan Pérez','juan@example.com','$2b$10$r5W.WOOaj3/Mx77TjmdNb.LLMbKzrw.9Zz3nozcr.cc8LKyVEGZ8u','seller','2026-02-26 01:39:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-04  0:10:57