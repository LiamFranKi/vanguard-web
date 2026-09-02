/**
 * Visitas Guiadas — tablas de configuración + registros + destinatarios
 * Base: vanguard_intranet
 * phpMyAdmin → SQL → pegar y Continuar
 *
 * Días: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
 * Puedes activar/desactivar días y horarios desde phpMyAdmin o la intranet.
 * Fechas concretas (modo lista): ver también 077 en intranet
 *   database/migrations/077_web_visita_fechas_mysql.sql
 */

-- 1) Días permitidos (configurables)
CREATE TABLE IF NOT EXISTS `web_visita_dias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dia_semana` TINYINT NOT NULL COMMENT '0=Dom .. 6=Sáb',
  `etiqueta` VARCHAR(40) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_visita_dia` (`dia_semana`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `web_visita_dias` (`dia_semana`, `etiqueta`, `activo`) VALUES
  (0, 'Domingo', 0),
  (1, 'Lunes', 0),
  (2, 'Martes', 1),
  (3, 'Miércoles', 0),
  (4, 'Jueves', 1),
  (5, 'Viernes', 0),
  (6, 'Sábado', 0)
ON DUPLICATE KEY UPDATE
  `etiqueta` = VALUES(`etiqueta`);

-- 2) Horarios / franjas (configurables)
CREATE TABLE IF NOT EXISTS `web_visita_horarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `etiqueta` VARCHAR(120) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `orden` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `web_visita_horarios` (`etiqueta`, `activo`, `orden`)
SELECT * FROM (
  SELECT 'Mañana (10:00 am - 11:00 am)' AS etiqueta, 1 AS activo, 1 AS orden
  UNION ALL SELECT 'Tarde (03:00 pm - 04:00 pm)', 1, 2
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM `web_visita_horarios` LIMIT 1);

-- 3) Secuencias opcionales (combinaciones día + horario)
--    Si NO hay ninguna secuencia activa, valen todos los días activos × todos los horarios activos.
--    Si HAY secuencias activas, solo se permiten esas combinaciones.
CREATE TABLE IF NOT EXISTS `web_visita_secuencias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(120) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `creado_en` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `web_visita_secuencia_slots` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `secuencia_id` INT UNSIGNED NOT NULL,
  `dia_semana` TINYINT NOT NULL,
  `horario_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_secuencia` (`secuencia_id`),
  CONSTRAINT `fk_visita_seq` FOREIGN KEY (`secuencia_id`) REFERENCES `web_visita_secuencias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_visita_horario` FOREIGN KEY (`horario_id`) REFERENCES `web_visita_horarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) Registros de solicitudes
CREATE TABLE IF NOT EXISTS `web_visitas_guiadas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha_registro` DATETIME NOT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `nivel_interes` VARCHAR(80) DEFAULT NULL,
  `fecha_preferida` DATE NOT NULL,
  `horario_preferido` VARCHAR(120) NOT NULL,
  `numero_estudiantes` VARCHAR(20) DEFAULT NULL,
  `mensaje` TEXT,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'nuevo',
  `ip` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_web_visitas_fecha` (`fecha_registro`),
  KEY `idx_web_visitas_preferida` (`fecha_preferida`),
  KEY `idx_web_visitas_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) Destinatarios de correo (intranet / phpMyAdmin)
--    Si la columna ya existe, ignore el error de ALTER.
ALTER TABLE `web_correos_envio`
  ADD COLUMN `recibe_visitas` TINYINT(1) NOT NULL DEFAULT 1
  COMMENT '1=recibe Visitas Guiadas'
  AFTER `recibe_contacto`;

UPDATE `web_correos_envio`
SET `recibe_visitas` = 1
WHERE `activo` = 1;
