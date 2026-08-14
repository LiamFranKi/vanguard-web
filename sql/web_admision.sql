/**
 * Admisión / Ratificación — solicitudes web + destinatarios
 * Base: vanguard_intranet
 * phpMyAdmin → SQL → pegar y Continuar
 *
 * La página /admision-2026 usa un solo formulario (Admisión y Ratificación).
 */

-- 1) Solicitudes de admisión
CREATE TABLE IF NOT EXISTS `web_admision` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha_registro` DATETIME NOT NULL,
  `nombres_estudiante` VARCHAR(200) NOT NULL,
  `apellidos_estudiante` VARCHAR(200) NOT NULL,
  `nombres_apoderado` VARCHAR(200) NOT NULL,
  `dni_apoderado` VARCHAR(20) NOT NULL,
  `telefono_apoderado` VARCHAR(50) DEFAULT NULL,
  `email_apoderado` VARCHAR(200) NOT NULL,
  `direccion_apoderado` VARCHAR(300) DEFAULT NULL,
  `grado` VARCHAR(80) NOT NULL,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'nuevo',
  `ip` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_web_admision_fecha` (`fecha_registro`),
  KEY `idx_web_admision_estado` (`estado`),
  KEY `idx_web_admision_grado` (`grado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) Destinatarios de correo
--    Si la columna ya existe, ignore el error de ALTER.
ALTER TABLE `web_correos_envio`
  ADD COLUMN `recibe_admision` TINYINT(1) NOT NULL DEFAULT 1
  COMMENT '1=recibe Admisión / Ratificación'
  AFTER `recibe_trabaja`;

UPDATE `web_correos_envio`
SET `recibe_admision` = 1
WHERE `activo` = 1;
