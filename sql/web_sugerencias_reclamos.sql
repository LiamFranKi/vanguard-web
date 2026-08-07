/**
 * Script SQL para phpMyAdmin
 * Base de datos: vanguard_intranet
 *
 * Cómo usarlo:
 * 1. Entra a phpMyAdmin
 * 2. Selecciona la base vanguard_intranet (izquierda)
 * 3. Pestaña "SQL"
 * 4. Pega TODO este archivo y pulsa "Continuar"
 */

CREATE TABLE IF NOT EXISTS `web_sugerencias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nombre` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `relacion` VARCHAR(100) DEFAULT NULL,
  `tipo` VARCHAR(100) DEFAULT NULL,
  `mensaje` TEXT NOT NULL,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'nuevo',
  `ip` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_web_sugerencias_fecha` (`fecha_registro`),
  KEY `idx_web_sugerencias_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `web_reclamos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero` VARCHAR(30) NOT NULL,
  `fecha_registro` DATETIME NOT NULL,
  `nombre` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `tipo_documento` VARCHAR(30) NOT NULL,
  `numero_documento` VARCHAR(50) NOT NULL,
  `domicilio` VARCHAR(255) DEFAULT NULL,
  `relacion` VARCHAR(100) DEFAULT NULL,
  `alumno_nombre` VARCHAR(200) DEFAULT NULL,
  `alumno_dni` VARCHAR(30) DEFAULT NULL,
  `tipo` ENUM('reclamo', 'queja') NOT NULL,
  `bien_contratado` VARCHAR(200) DEFAULT NULL,
  `fecha_hecho` DATE DEFAULT NULL,
  `detalle` TEXT NOT NULL,
  `pedido` TEXT NOT NULL,
  `monto` VARCHAR(50) DEFAULT NULL,
  `adjunto_nombre` VARCHAR(255) DEFAULT NULL,
  `adjunto_ruta` VARCHAR(500) DEFAULT NULL,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'nuevo',
  `ruc_registrado` VARCHAR(30) DEFAULT NULL,
  `razon_social` VARCHAR(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_reclamos_numero` (`numero`),
  KEY `idx_web_reclamos_fecha` (`fecha_registro`),
  KEY `idx_web_reclamos_tipo` (`tipo`),
  KEY `idx_web_reclamos_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* También ejecuta sql/web_correos_envio.sql (correos de destino) */
