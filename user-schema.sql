CREATE TABLE `raddyProject`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NULL,
  `lastName` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `comments` TEXT NULL,
  `status` VARCHAR(45) NULL DEFAULT 'active',
  PRIMARY KEY (`id`));