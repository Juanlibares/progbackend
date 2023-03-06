

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `ecommerce` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ecommerce`;


CREATE TABLE `cart` (
  `id_cart` int(20) NOT NULL,
  `timestamp` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `cart_detail` (
  `id_cart_detail` int(20) NOT NULL,
  `fk_product` int(20) NOT NULL,
  `fk_cart` int(20) NOT NULL,
  `qty` int(11) NOT NULL,
  `unit_price` int(11) NOT NULL,
  `total_price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `product` (
  `id_product` int(20) NOT NULL,
  `timestamp` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `cart`
  ADD PRIMARY KEY (`id_cart`);

ALTER TABLE `cart_detail`
  ADD PRIMARY KEY (`id_cart_detail`),
  ADD KEY `fk_cart_detail` (`fk_cart`),
  ADD KEY `fk_products_detail` (`fk_product`);


ALTER TABLE `product`
  ADD PRIMARY KEY (`id_product`);


ALTER TABLE `cart`
  MODIFY `id_cart` int(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cart_detail`
  MODIFY `id_cart_detail` int(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `product`
  MODIFY `id_product` int(20) NOT NULL AUTO_INCREMENT;


ALTER TABLE `cart_detail`
  ADD CONSTRAINT `fk_cart_detail` FOREIGN KEY (`fk_cart`) REFERENCES `cart` (`id_cart`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_products_detail` FOREIGN KEY (`fk_product`) REFERENCES `product` (`id_product`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

