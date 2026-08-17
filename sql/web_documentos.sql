/**
 * Documentos de Interés — categorías + PDFs (seed desde config/documentos.json)
 * Base: vanguard_intranet
 * phpMyAdmin → SQL → pegar y Continuar
 *
 * PDFs en disco (VPS Zarkiel / web nueva):
 *   /home/vanguard/web-vanguard/public/documentos/<archivo>
 * En BD se guarda la ruta pública web (ej. /documentos/PROPUESTA2026.pdf).
 * NO usar la ruta antigua /var/www/web/...
 *
 * Categorías seed: Admisión, Contratos y Reglamentos, Información General
 * Documentos seed: 5
 */

CREATE TABLE IF NOT EXISTS `web_documentos_categorias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(80) NOT NULL COMMENT 'admision, contratos-reglamentos, informacion-general',
  `etiqueta` VARCHAR(120) NOT NULL COMMENT 'texto visible, ej. Contratos y Reglamentos',
  `orden` INT NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_doc_cat` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `web_documentos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `categoria_id` INT UNSIGNED NOT NULL,
  `codigo` VARCHAR(80) NOT NULL COMMENT 'ej. proceso-admision-2026',
  `nombre` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(20) NOT NULL DEFAULT 'PDF',
  `archivo` VARCHAR(255) NOT NULL COMMENT 'nombre sugerido al descargar',
  `ruta` VARCHAR(500) NOT NULL COMMENT 'ruta pública, ej. /documentos/RI2026.pdf',
  `orden` INT NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_doc_codigo` (`codigo`),
  KEY `idx_web_doc_cat` (`categoria_id`),
  KEY `idx_web_doc_activo` (`activo`),
  CONSTRAINT `fk_web_doc_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `web_documentos_categorias` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `web_documentos_categorias` (`codigo`, `etiqueta`, `orden`, `activo`) VALUES
  ('admision', 'Admisión', 1, 1),
  ('contratos-reglamentos', 'Contratos y Reglamentos', 2, 1),
  ('informacion-general', 'Información General', 3, 1)
ON DUPLICATE KEY UPDATE
  `etiqueta` = VALUES(`etiqueta`),
  `orden` = VALUES(`orden`),
  `activo` = 1;

DELETE FROM `web_documentos`;

INSERT INTO `web_documentos`
  (`categoria_id`, `codigo`, `nombre`, `tipo`, `archivo`, `ruta`, `orden`, `activo`) VALUES
  ((SELECT id FROM web_documentos_categorias WHERE codigo = 'admision' LIMIT 1),
    'proceso-admision-2026', 'Propuesta Académica 2026', 'PDF', 'PROPUESTA2026.pdf', '/documentos/PROPUESTA2026.pdf', 1, 1),
  ((SELECT id FROM web_documentos_categorias WHERE codigo = 'contratos-reglamentos' LIMIT 1),
    'contratos-servicios-2026', 'Contratos de Servicios 2026', 'PDF', 'Contrato2026.pdf', '/documentos/Contrato2026.pdf', 2, 1),
  ((SELECT id FROM web_documentos_categorias WHERE codigo = 'contratos-reglamentos' LIMIT 1),
    'reglamento-interno-2026', 'Reglamento Interno - Norma de Convivencia 2026', 'PDF', 'RI2026.pdf', '/documentos/RI2026.pdf', 3, 1),
  ((SELECT id FROM web_documentos_categorias WHERE codigo = 'informacion-general' LIMIT 1),
    'plan-curricular-2026', 'Plan Curricular Institucional 2026', 'PDF', 'PCI2026.pdf', '/documentos/PCI2026.pdf', 4, 1),
  ((SELECT id FROM web_documentos_categorias WHERE codigo = 'informacion-general' LIMIT 1),
    'evaluaciones-asistencias-2026', 'Evaluaciones y Asistencias 2026', 'PDF', 'EVALUACIONES2026.pdf', '/documentos/EVALUACIONES2026.pdf', 5, 1);
