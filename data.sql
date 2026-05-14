-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: luxe_fashion
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('super_admin','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Super Admin','admin@luxefashion.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj2sLuH1j0m.','super_admin',1,'2026-05-12 10:27:39','2026-05-12 10:27:39');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,1,'2026-05-13 13:16:09','2026-05-13 13:16:09');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `quantity` int unsigned DEFAULT '1',
  `size` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cart_product_variant` (`cart_id`,`product_id`,`size`,`color`),
  KEY `product_id` (`product_id`),
  KEY `idx_cart` (`cart_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Clothing','clothing','Premium fashion clothing for men and women','https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600','2026-05-12 10:27:39','2026-05-12 10:27:39'),(2,'Shoes','shoes','Designer footwear for every occasion','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600','2026-05-12 10:27:39','2026-05-12 10:27:39'),(3,'Watches','watches','Luxury timepieces and smartwatches','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600','2026-05-12 10:27:39','2026-05-12 10:27:39'),(4,'Accessories','accessories','Fashion bags, belts, scarves and more','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600','2026-05-12 10:27:39','2026-05-12 10:27:39');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int unsigned NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,9,'Structured Tote Bag','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600','LUXE','One Size','Black',1,4299.00,4299.00),(2,2,9,'Structured Tote Bag','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600','LUXE','One Size','Black',1,4299.00,4299.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int unsigned NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `shipping_amount` decimal(10,2) DEFAULT '0.00',
  `final_amount` decimal(10,2) NOT NULL,
  `status` enum('ordered','packed','shipped','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'ordered',
  `payment_method` enum('cod','online') COLLATE utf8mb4_unicode_ci DEFAULT 'cod',
  `payment_status` enum('pending','paid','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `shipping_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci,
  `shipping_city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `ordered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_ordered` (`ordered_at`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD20260513001',1,4299.00,0.00,0.00,4299.00,'ordered','cod','pending','Ashutosh Kashyap','+916209021020','Near circuit house, power house chowk, maripur , muzaffarpur, bihar,india','Muzaffarpur','Bihar','842001',NULL,'2026-05-13 13:16:49','2026-05-13 13:16:49'),(2,'ORD20260513002',1,4299.00,0.00,0.00,4299.00,'ordered','online','pending','Ashutosh Kashyap','+916209021020','Near circuit house, power house chowk, maripur , muzaffarpur, bihar,india','Muzaffarpur','Bihar','842001',NULL,'2026-05-13 13:17:27','2026-05-13 13:17:27');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `stock` int unsigned DEFAULT '0',
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` json DEFAULT NULL,
  `sizes` json DEFAULT NULL,
  `colors` json DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `review_count` int unsigned DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_trending` tinyint(1) DEFAULT '0',
  `is_bestseller` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_category` (`category_id`),
  KEY `idx_price` (`price`),
  KEY `idx_featured` (`is_featured`),
  KEY `idx_trending` (`is_trending`),
  KEY `idx_active` (`is_active`),
  FULLTEXT KEY `ft_search` (`name`,`description`,`brand`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Premium Oversized Hoodie','premium-oversized-hoodie','Ultra-soft cotton blend oversized hoodie with minimalist design. Perfect for casual everyday wear.',2999.00,2199.00,50,'LUXE','LX-CLT-001','[\"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600\", \"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600\"]','[\"XS\", \"S\", \"M\", \"L\", \"XL\", \"XXL\"]','[\"Black\", \"White\", \"Grey\", \"Olive\"]',4.50,128,1,1,1,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(2,1,'Slim Fit Denim Jacket','slim-fit-denim-jacket','Classic slim-fit denim jacket with a modern cut. Versatile layering piece for all seasons.',3499.00,NULL,35,'LUXE','LX-CLT-002','[\"https://images.unsplash.com/photo-1544441893-675973e31985?w=600\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Blue\", \"Dark Blue\", \"Black\"]',4.30,89,1,0,1,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(3,1,'Linen Wide-Leg Trousers','linen-wide-leg-trousers','Breathable linen wide-leg trousers with an elegant drape. Summer essential.',2499.00,1999.00,40,'LUXE','LX-CLT-003','[\"https://images.unsplash.com/photo-1594938298603-c8148c4b4087?w=600\"]','[\"XS\", \"S\", \"M\", \"L\", \"XL\"]','[\"Beige\", \"White\", \"Black\", \"Navy\"]',4.60,67,0,1,0,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(4,2,'Classic White Leather Sneakers','classic-white-leather-sneakers','Timeless leather sneakers with cushioned sole. Minimal design, maximum comfort.',4999.00,3999.00,60,'LUXE','LX-SHO-001','[\"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600\", \"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600\"]','[\"38\", \"39\", \"40\", \"41\", \"42\", \"43\", \"44\", \"45\"]','[\"White\", \"Black\", \"Grey\"]',4.70,203,1,1,1,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(5,2,'Suede Chelsea Boots','suede-chelsea-boots','Premium suede chelsea boots with elastic side panels. Sophisticated yet effortless.',6999.00,NULL,25,'LUXE','LX-SHO-002','[\"https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600\"]','[\"38\", \"39\", \"40\", \"41\", \"42\", \"43\", \"44\"]','[\"Tan\", \"Black\", \"Dark Brown\"]',4.80,156,1,0,1,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(6,2,'Chunky Platform Sandals','chunky-platform-sandals','Bold platform sandals with adjustable straps. A fashion-forward statement piece.',3499.00,2799.00,30,'LUXE','LX-SHO-003','[\"https://images.unsplash.com/photo-1583241800698-e8ab01830a24?w=600\"]','[\"36\", \"37\", \"38\", \"39\", \"40\", \"41\"]','[\"Black\", \"White\", \"Nude\", \"Red\"]',4.20,74,0,1,0,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(7,3,'Minimalist Automatic Watch','minimalist-automatic-watch','Swiss-movement automatic watch with sapphire crystal glass. Timeless elegance on your wrist.',18999.00,15999.00,15,'LUXE','LX-WCH-001','[\"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600\", \"https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600\"]','[\"One Size\"]','[\"Silver\", \"Gold\", \"Rose Gold\", \"Black\"]',4.90,312,1,1,1,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(8,3,'Sport Chronograph','sport-chronograph','High-performance chronograph with tachymeter bezel. Built for the active lifestyle.',12999.00,NULL,20,'LUXE','LX-WCH-002','[\"https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600\"]','[\"One Size\"]','[\"Black\", \"Blue\", \"Red\"]',4.60,189,0,1,0,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(9,4,'Structured Tote Bag','structured-tote-bag','Premium vegan leather structured tote with gold hardware. Perfect for work and weekend.',5499.00,4299.00,43,'LUXE','LX-ACC-001','[\"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600\", \"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600\"]','[\"One Size\"]','[\"Black\", \"Camel\", \"White\", \"Burgundy\"]',4.70,245,1,1,1,1,'2026-05-12 10:27:39','2026-05-13 13:17:27'),(10,4,'Silk Paisley Scarf','silk-paisley-scarf','100% mulberry silk scarf with classic paisley print. A versatile luxury accessory.',2999.00,NULL,55,'LUXE','LX-ACC-002','[\"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600\"]','[\"90x90cm\", \"70x180cm\"]','[\"Blue\", \"Red\", \"Green\", \"Multicolor\"]',4.50,98,0,0,1,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(11,4,'Woven Leather Belt','woven-leather-belt','Hand-stitched genuine leather woven belt with brushed metal buckle.',1999.00,1599.00,70,'LUXE','LX-ACC-003','[\"https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=600\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Black\", \"Tan\", \"Brown\"]',4.40,112,0,0,0,1,'2026-05-12 10:27:39','2026-05-12 10:27:39'),(12,1,'Cashmere Blend Turtleneck','cashmere-blend-turtleneck','Luxuriously soft cashmere blend turtleneck sweater. The ultimate winter wardrobe staple.',4999.00,3999.00,28,'LUXE','LX-CLT-004','[\"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600\"]','[\"XS\", \"S\", \"M\", \"L\", \"XL\"]','[\"Cream\", \"Camel\", \"Grey\", \"Navy\", \"Black\"]',4.80,167,1,0,1,1,'2026-05-12 10:27:39','2026-05-12 10:27:39');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ashutosh Kashyap','ashutoshhkashyap@gmail.com','$2b$12$kbgVzOWpPqDLJZiAmpBZF.4T.bwv5glAviWOyxQYBnPpRpPGZdodC','+916209021020',NULL,NULL,1,'2026-05-13 13:16:09','2026-05-13 13:16:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-15  2:20:05
