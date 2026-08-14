/**
 * Contáctenos — tabla de registros + columna de destinatarios
 * Base: vanguard_intranet
 * phpMyAdmin → SQL → pegar y Continuar
 */

-- 1) Tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS `web_contactenos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha_registro` DATETIME NOT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `asunto` VARCHAR(200) DEFAULT NULL,
  `mensaje` TEXT NOT NULL,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'nuevo',
  `ip` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_web_contactenos_fecha` (`fecha_registro`),
  KEY `idx_web_contactenos_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) Ampliar web_correos_envio para Contáctenos
--    (si la columna ya existe, ignore el error o comente esta línea)
ALTER TABLE `web_correos_envio`
  ADD COLUMN `recibe_contacto` TINYINT(1) NOT NULL DEFAULT 1
  COMMENT '1=recibe Contáctenos'
  AFTER `recibe_reclamos`;

-- 3) Activar Contáctenos para correos ya existentes (ajusta emails si hace falta)
UPDATE `web_correos_envio`
SET `recibe_contacto` = 1
WHERE `activo` = 1;
