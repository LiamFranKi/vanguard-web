/**
 * Lista de Útiles — niveles + grados/PDFs (seed desde config/lista-utiles.json)
 * Base: vanguard_intranet
 * phpMyAdmin → SQL → pegar y Continuar
 *
 * PDFs en disco (VPS Zarkiel / web nueva):
 *   /home/vanguard/web-vanguard/public/utiles/<archivo>
 * En BD se guarda la ruta pública web (ej. /utiles/utiles-1grado.pdf).
 * NO usar la ruta antigua /var/www/web/...
 *
 * Niveles seed: inicial (pink), primaria (blue), secundaria (purple)
 * Grados seed: 14 (3 inicial + 6 primaria + 5 secundaria)
 */

CREATE TABLE IF NOT EXISTS `web_utiles_niveles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(40) NOT NULL COMMENT 'inicial, primaria, secundaria',
  `nombre` VARCHAR(120) NOT NULL,
  `color` VARCHAR(20) NOT NULL DEFAULT 'blue' COMMENT 'pink|blue|purple (diseño web)',
  `orden` INT NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_utiles_nivel` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `web_utiles_grados` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nivel_id` INT UNSIGNED NOT NULL,
  `codigo` VARCHAR(40) NOT NULL COMMENT 'ej. inicial-03, primaria-1',
  `nombre` VARCHAR(120) NOT NULL,
  `archivo` VARCHAR(255) NOT NULL COMMENT 'nombre sugerido al descargar',
  `ruta` VARCHAR(500) NOT NULL COMMENT 'ruta pública, ej. /utiles/utiles-1grado.pdf',
  `orden` INT NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_utiles_grado` (`codigo`),
  KEY `idx_web_utiles_grado_nivel` (`nivel_id`),
  KEY `idx_web_utiles_grado_activo` (`activo`),
  CONSTRAINT `fk_web_utiles_nivel` FOREIGN KEY (`nivel_id`) REFERENCES `web_utiles_niveles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `web_utiles_niveles` (`codigo`, `nombre`, `color`, `orden`, `activo`) VALUES
  ('inicial', 'Educación Inicial', 'pink', 1, 1),
  ('primaria', 'Educación Primaria', 'blue', 2, 1),
  ('secundaria', 'Educación Secundaria', 'purple', 3, 1)
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `color` = VALUES(`color`),
  `orden` = VALUES(`orden`),
  `activo` = 1;

DELETE FROM `web_utiles_grados`;

INSERT INTO `web_utiles_grados`
  (`nivel_id`, `codigo`, `nombre`, `archivo`, `ruta`, `orden`, `activo`) VALUES
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'inicial' LIMIT 1), 'inicial-03', 'Inicial 03 Años', 'utiles-3ano.pdf', '/utiles/utiles-inicial3.pdf', 1, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'inicial' LIMIT 1), 'inicial-04', 'Inicial 04 Años', 'utiles-4ano.pdf', '/utiles/utiles-inicial4.pdf', 2, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'inicial' LIMIT 1), 'inicial-05', 'Inicial 05 Años', 'utiles-5ano.pdf', '/utiles/utiles-inicial5.pdf', 3, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'primaria' LIMIT 1), 'primaria-1', '1° Grado', 'utiles-1grado.pdf', '/utiles/utiles-1grado.pdf', 4, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'primaria' LIMIT 1), 'primaria-2', '2° Grado', 'utiles-2grado.pdf', '/utiles/utiles-2grado.pdf', 5, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'primaria' LIMIT 1), 'primaria-3', '3° Grado', 'utiles-3grado.pdf', '/utiles/utiles-3grado.pdf', 6, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'primaria' LIMIT 1), 'primaria-4', '4° Grado', 'utiles-4grado.pdf', '/utiles/utiles-4grado.pdf', 7, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'primaria' LIMIT 1), 'primaria-5', '5° Grado', 'utiles-5grado.pdf', '/utiles/utiles-5grado.pdf', 8, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'primaria' LIMIT 1), 'primaria-6', '6° Grado', 'utiles-6grado.pdf', '/utiles/utiles-6grado.pdf', 9, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'secundaria' LIMIT 1), 'secundaria-1', '1° Año', 'utiles-1ano.pdf', '/utiles/utiles-1ano.pdf', 10, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'secundaria' LIMIT 1), 'secundaria-2', '2° Año', 'utiles-2ano.pdf', '/utiles/utiles-2ano.pdf', 11, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'secundaria' LIMIT 1), 'secundaria-3', '3° Año', 'utiles-3ano.pdf', '/utiles/utiles-3ano.pdf', 12, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'secundaria' LIMIT 1), 'secundaria-4', '4° Año', 'utiles-4ano.pdf', '/utiles/utiles-4ano.pdf', 13, 1),
  ((SELECT id FROM web_utiles_niveles WHERE codigo = 'secundaria' LIMIT 1), 'secundaria-5', '5° Año', 'utiles-5ano.pdf', '/utiles/utiles-5ano.pdf', 14, 1);
