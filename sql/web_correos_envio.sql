/**
 * web_correos_envio — agregar/activar correo destino
 * Base de datos: vanguard_intranet
 * phpMyAdmin → seleccionar BD → pestaña SQL → pegar → Continuar
 *
 * Correo: walter.lozano@vanguardschools.edu.pe
 * Recibe: sugerencias + reclamos
 */

CREATE TABLE IF NOT EXISTS `web_correos_envio` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(200) NOT NULL,
  `etiqueta` VARCHAR(100) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `recibe_sugerencias` TINYINT(1) NOT NULL DEFAULT 1,
  `recibe_reclamos` TINYINT(1) NOT NULL DEFAULT 1,
  `creado_en` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_correos_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `web_correos_envio`
  (`email`, `etiqueta`, `activo`, `recibe_sugerencias`, `recibe_reclamos`)
VALUES
  ('walter.lozano@vanguardschools.edu.pe', 'Dirección', 1, 1, 1)
ON DUPLICATE KEY UPDATE
  `etiqueta` = VALUES(`etiqueta`),
  `activo` = 1,
  `recibe_sugerencias` = 1,
  `recibe_reclamos` = 1;
