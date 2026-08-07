/**
 * Tabla de correos de destino (sugerencias + reclamos)
 * Base: vanguard_intranet
 * phpMyAdmin → SQL → pegar y ejecutar
 */

CREATE TABLE IF NOT EXISTS `web_correos_envio` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(200) NOT NULL,
  `etiqueta` VARCHAR(100) DEFAULT NULL COMMENT 'Ej: Dirección, Secretaría',
  `activo` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=sí recibe, 0=no',
  `recibe_sugerencias` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=recibe sugerencias',
  `recibe_reclamos` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=recibe reclamos',
  `creado_en` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_correos_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Destinatarios iniciales (mismos que Sugerencias). Edítalos en phpMyAdmin.
INSERT INTO `web_correos_envio` (`email`, `etiqueta`, `activo`, `recibe_sugerencias`, `recibe_reclamos`)
VALUES
  ('dianavi54@gmail.com', 'Administración', 1, 1, 1),
  ('walter.lozano@vanguardschools.edu.pe', 'Dirección', 1, 1, 1),
  ('rosario.maravi@vanguardschools.edu.pe', 'Staff', 1, 1, 1),
  ('perla.lagos@vanguardschools.edu.pe', 'Staff', 1, 1, 1)
ON DUPLICATE KEY UPDATE
  `activo` = VALUES(`activo`),
  `recibe_sugerencias` = VALUES(`recibe_sugerencias`),
  `recibe_reclamos` = VALUES(`recibe_reclamos`);
