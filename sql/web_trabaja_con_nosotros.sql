/**
 * Trabaja con Nosotros — postulaciones + CV + destinatarios
 * Base: vanguard_intranet
 * phpMyAdmin → SQL → pegar y Continuar
 *
 * CVs en disco (VPS Zarkiel / web nueva):
 *   /home/vanguard/web-vanguard/data/curriculums/<archivo>
 * En BD se guarda la ruta absoluta en `cv_ruta` y el nombre original en `cv_nombre`.
 * NO usar la ruta antigua /var/www/web/...
 */

-- 1) Postulaciones
CREATE TABLE IF NOT EXISTS `web_trabaja_con_nosotros` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha_registro` DATETIME NOT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `puesto` VARCHAR(200) NOT NULL,
  `mensaje` TEXT,
  `cv_nombre` VARCHAR(255) DEFAULT NULL,
  `cv_ruta` VARCHAR(500) DEFAULT NULL COMMENT 'Ruta absoluta bajo /home/vanguard/web-vanguard/...',
  `cv_mime` VARCHAR(80) DEFAULT NULL,
  `cv_size` INT UNSIGNED DEFAULT NULL,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'nuevo',
  `ip` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_web_trabaja_fecha` (`fecha_registro`),
  KEY `idx_web_trabaja_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) Destinatarios de correo
--    Si la columna ya existe, ignore el error de ALTER.
ALTER TABLE `web_correos_envio`
  ADD COLUMN `recibe_trabaja` TINYINT(1) NOT NULL DEFAULT 1
  COMMENT '1=recibe Trabaja con Nosotros'
  AFTER `recibe_visitas`;

UPDATE `web_correos_envio`
SET `recibe_trabaja` = 1
WHERE `activo` = 1;
