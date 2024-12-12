
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema codeconnect
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema codeconnect
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `codeconnect` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `codeconnect` ;

-- -----------------------------------------------------
-- Table `codeconnect`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NULL DEFAULT NULL,
  `country` VARCHAR(100) NULL DEFAULT NULL,
  `phone` VARCHAR(20) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `isSeller` TINYINT(1) NULL DEFAULT '0',
  `isPremium` TINYINT(1) NULL DEFAULT '0',
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `disabled` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`projects`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`projects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `userId` INT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `projects_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `codeconnect`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `img` VARCHAR(255) NULL DEFAULT NULL,
  `description` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 42
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`services`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`services` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `totalStars` INT NULL DEFAULT '0',
  `starNumber` INT NULL DEFAULT '0',
  `categoryId` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `cover` VARCHAR(255) NOT NULL,
  `images` TEXT NULL DEFAULT NULL,
  `shortTitle` VARCHAR(255) NOT NULL,
  `shortDesc` VARCHAR(255) NOT NULL,
  `deliveryTime` INT NOT NULL,
  `revisionNumber` INT NOT NULL,
  `features` TEXT NULL DEFAULT NULL,
  `sales` INT NULL DEFAULT '0',
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isactive` TINYINT(1) NULL DEFAULT '0',
  `isended` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `userId` (`userId` ASC) VISIBLE,
  INDEX `categoryId` (`categoryId` ASC) VISIBLE,
  CONSTRAINT `services_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `codeconnect`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `services_ibfk_2`
    FOREIGN KEY (`categoryId`)
    REFERENCES `codeconnect`.`categories` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`bids`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`bids` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `projectId` INT NOT NULL,
  `serviceId` INT NOT NULL,
  `addedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `projectId` (`projectId` ASC) VISIBLE,
  INDEX `serviceId` (`serviceId` ASC) VISIBLE,
  CONSTRAINT `bids_ibfk_1`
    FOREIGN KEY (`projectId`)
    REFERENCES `codeconnect`.`projects` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `bids_ibfk_2`
    FOREIGN KEY (`serviceId`)
    REFERENCES `codeconnect`.`services` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`cards`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`cards` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `desc` TEXT NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`conversations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`conversations` (
  `id` VARCHAR(255) NOT NULL,
  `sellerId` INT NOT NULL,
  `buyerId` INT NOT NULL,
  `readBySeller` TINYINT(1) NOT NULL,
  `readByBuyer` TINYINT(1) NOT NULL,
  `lastMessage` TEXT NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `sellerId` (`sellerId` ASC) VISIBLE,
  INDEX `buyerId` (`buyerId` ASC) VISIBLE,
  CONSTRAINT `conversations_ibfk_1`
    FOREIGN KEY (`sellerId`)
    REFERENCES `codeconnect`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `conversations_ibfk_2`
    FOREIGN KEY (`buyerId`)
    REFERENCES `codeconnect`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conversationId` VARCHAR(255) NOT NULL,
  `userId` INT NOT NULL,
  `desc` TEXT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `conversationId` (`conversationId` ASC) VISIBLE,
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `messages_ibfk_1`
    FOREIGN KEY (`conversationId`)
    REFERENCES `codeconnect`.`conversations` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2`
    FOREIGN KEY (`userId`)
    REFERENCES `codeconnect`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ServiceId` INT NOT NULL,
  `sellerId` INT NOT NULL,
  `buyerId` INT NOT NULL,
  `isCompleted` TINYINT(1) NULL DEFAULT '0',
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `ServiceId` (`ServiceId` ASC) VISIBLE,
  INDEX `sellerId` (`sellerId` ASC) VISIBLE,
  INDEX `buyerId` (`buyerId` ASC) VISIBLE,
  CONSTRAINT `orders_ibfk_1`
    FOREIGN KEY (`ServiceId`)
    REFERENCES `codeconnect`.`services` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2`
    FOREIGN KEY (`sellerId`)
    REFERENCES `codeconnect`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_3`
    FOREIGN KEY (`buyerId`)
    REFERENCES `codeconnect`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`paymentrecords`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`paymentrecords` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `orderId` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `platformFee` DECIMAL(10,2) NOT NULL,
  `sellerEarnings` DECIMAL(10,2) NOT NULL,
  `paymentDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `orderId` (`orderId` ASC) VISIBLE,
  CONSTRAINT `paymentrecords_ibfk_1`
    FOREIGN KEY (`orderId`)
    REFERENCES `codeconnect`.`orders` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ServiceId` INT NOT NULL,
  `userId` INT NOT NULL,
  `star` INT NOT NULL,
  `desc` TEXT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `ServiceId` (`ServiceId` ASC) VISIBLE,
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `reviews_ibfk_1`
    FOREIGN KEY (`ServiceId`)
    REFERENCES `codeconnect`.`services` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2`
    FOREIGN KEY (`userId`)
    REFERENCES `codeconnect`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codeconnect`.`subscriptions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codeconnect`.`subscriptions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `subscriptions_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `codeconnect`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
