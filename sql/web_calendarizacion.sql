/**
 * Calendarización académica — tablas + seed desde config/calendarizacion.json
 * Base: vanguard_intranet
 * phpMyAdmin → SQL → pegar y Continuar
 * Año seed: 2026 · eventos: 142
 */

CREATE TABLE IF NOT EXISTS `web_calendarizacion` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `anio` SMALLINT NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `creado_en` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_cal_anio` (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `web_calendarizacion_conceptos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(40) NOT NULL COMMENT 'tipo del JSON: feriado, tema, etc.',
  `etiqueta` VARCHAR(80) NOT NULL,
  `color` VARCHAR(20) NOT NULL DEFAULT '#3b82f6',
  `color_texto` VARCHAR(20) NOT NULL DEFAULT '#ffffff',
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `orden` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_cal_concepto` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `web_calendarizacion_eventos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `anio` SMALLINT NOT NULL,
  `mes` TINYINT NOT NULL COMMENT '1-12',
  `tipo` VARCHAR(40) NOT NULL,
  `color` VARCHAR(20) NOT NULL,
  `color_texto` VARCHAR(20) NOT NULL DEFAULT '#ffffff',
  `dia` TINYINT DEFAULT NULL COMMENT 'día único; NULL si usa rango',
  `rango_inicio` TINYINT DEFAULT NULL,
  `rango_fin` TINYINT DEFAULT NULL,
  `texto` TEXT NOT NULL COMMENT 'puede incluir saltos de línea',
  `orden` INT NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_web_cal_ev_anio_mes` (`anio`, `mes`),
  KEY `idx_web_cal_ev_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Año
INSERT INTO `web_calendarizacion` (`anio`, `activo`) VALUES (2026, 1)
ON DUPLICATE KEY UPDATE `activo` = 1;

-- Conceptos (colores por tipo)
INSERT INTO `web_calendarizacion_conceptos` (`codigo`, `etiqueta`, `color`, `color_texto`, `activo`, `orden`) VALUES
  ('reunion', 'Reunión', '#3b82f6', '#ffffff', 1, 1),
  ('inicio', 'Inicio', '#10b981', '#ffffff', 1, 2),
  ('feriado', 'Feriado', '#ef4444', '#ffffff', 1, 3),
  ('tema', 'Tema', '#8b5cf6', '#ffffff', 1, 4),
  ('evento', 'Evento', '#10b981', '#ffffff', 1, 5),
  ('examen', 'Examen', '#dc2626', '#ffffff', 1, 6),
  ('asesoria', 'Asesoría', '#f59e0b', '#ffffff', 1, 7),
  ('receso', 'Receso', '#6366f1', '#ffffff', 1, 8),
  ('actuacion', 'Actuación', '#ec4899', '#ffffff', 1, 9)
ON DUPLICATE KEY UPDATE
  `etiqueta` = VALUES(`etiqueta`),
  `color` = VALUES(`color`),
  `color_texto` = VALUES(`color_texto`),
  `activo` = 1;

-- Re-seed eventos del año 2026 (idempotente)
DELETE FROM `web_calendarizacion_eventos` WHERE `anio` = 2026;

-- Eventos seed (142) desde JSON
INSERT INTO `web_calendarizacion_eventos`
  (`anio`, `mes`, `tipo`, `color`, `color_texto`, `dia`, `rango_inicio`, `rango_fin`, `texto`, `orden`, `activo`) VALUES
  (2026, 3, 'reunion', '#3b82f6', '#ffffff', 4, NULL, NULL, 'REUNIÓN PPFF
(INICIAL Y PRIMARIA)', 1, 1),
  (2026, 3, 'reunion', '#3b82f6', '#ffffff', 5, NULL, NULL, 'REUNIÓN PPFF
(SECUNDARIA)', 2, 1),
  (2026, 3, 'inicio', '#10b981', '#ffffff', 6, NULL, NULL, 'PRIMER DIA EN
VANGUARD SCHOOLS', 3, 1),
  (2026, 3, 'feriado', '#ef4444', '#ffffff', 8, NULL, NULL, 'DÍA DE LA MUJER', 4, 1),
  (2026, 3, 'tema', '#8b5cf6', '#ffffff', NULL, 16, 20, 'TEMA 1', 5, 1),
  (2026, 3, 'inicio', '#10b981', '#ffffff', 16, NULL, NULL, 'INICIO DE CLASES', 6, 1),
  (2026, 3, 'tema', '#8b5cf6', '#ffffff', NULL, 23, 27, 'TEMA 2', 7, 1),
  (2026, 3, 'feriado', '#ef4444', '#ffffff', 21, NULL, NULL, 'DÍA INTERNACIONAL
DEL SÍNDROME DE DOWN', 8, 1),
  (2026, 3, 'tema', '#8b5cf6', '#ffffff', NULL, 30, 31, 'TEMA 3', 9, 1),
  (2026, 4, 'tema', '#8b5cf6', '#ffffff', 1, NULL, NULL, 'TEMA 3', 10, 1),
  (2026, 4, 'feriado', '#ef4444', '#ffffff', 2, NULL, NULL, 'JUEVES SANTO', 11, 1),
  (2026, 4, 'evento', '#10b981', '#ffffff', 2, NULL, NULL, 'DÍA MUNDIAL
DEl AUTISMO', 12, 1),
  (2026, 4, 'feriado', '#ef4444', '#ffffff', 3, NULL, NULL, 'VIERNES SANTO', 13, 1),
  (2026, 4, 'feriado', '#ef4444', '#ffffff', 4, NULL, NULL, 'SÁBADO SANTO', 14, 1),
  (2026, 4, 'feriado', '#ef4444', '#ffffff', 5, NULL, NULL, 'DOMINGO DE RAMOS', 15, 1),
  (2026, 4, 'examen', '#dc2626', '#ffffff', NULL, 6, 10, 'EXAMEN 1', 16, 1),
  (2026, 4, 'tema', '#8b5cf6', '#ffffff', NULL, 6, 8, 'TEMA 4', 17, 1),
  (2026, 4, 'tema', '#8b5cf6', '#ffffff', NULL, 9, 10, 'TEMA 3', 18, 1),
  (2026, 4, 'evento', '#10b981', '#ffffff', 6, NULL, NULL, 'DÍA MUNDIAL DE LA
ACTIVIDAD FÍSICA', 19, 1),
  (2026, 4, 'tema', '#8b5cf6', '#ffffff', NULL, 13, 15, 'TEMA 5', 20, 1),
  (2026, 4, 'tema', '#8b5cf6', '#ffffff', NULL, 16, 17, 'TEMA 4', 21, 1),
  (2026, 4, 'examen', '#dc2626', '#ffffff', 24, NULL, NULL, 'EXAMEN 2', 22, 1),
  (2026, 4, 'examen', '#dc2626', '#ffffff', NULL, 27, 30, 'EXAMEN 2', 23, 1),
  (2026, 4, 'tema', '#8b5cf6', '#ffffff', NULL, 20, 22, 'TEMA 6', 24, 1),
  (2026, 4, 'tema', '#8b5cf6', '#ffffff', NULL, 23, 24, 'TEMA 5', 25, 1),
  (2026, 4, 'tema', '#8b5cf6', '#ffffff', NULL, 27, 29, 'TEMA 7', 26, 1),
  (2026, 4, 'tema', '#8b5cf6', '#ffffff', 30, NULL, NULL, 'TEMA 6', 27, 1),
  (2026, 5, 'feriado', '#ef4444', '#ffffff', 1, NULL, NULL, 'DÍA DEL TRABAJADOR', 28, 1),
  (2026, 5, 'evento', '#10b981', '#ffffff', 2, NULL, NULL, 'DÍA INTERNACIONAL
CONTRA EL ACOSO
ESCOLAR', 29, 1),
  (2026, 5, 'asesoria', '#f59e0b', '#ffffff', NULL, 4, 7, 'ASESORÍA', 30, 1),
  (2026, 5, 'evento', '#10b981', '#ffffff', 8, NULL, NULL, 'EVENTO DÍA
DE LA MADRE
NO HAY CLASES', 31, 1),
  (2026, 5, 'examen', '#dc2626', '#ffffff', NULL, 11, 15, 'EXÁMENES
BIMESTRALES', 32, 1),
  (2026, 5, 'feriado', '#ef4444', '#ffffff', 10, NULL, NULL, 'DÍA DE LA MADRE', 33, 1),
  (2026, 5, 'inicio', '#10b981', '#ffffff', 18, NULL, NULL, 'INICIO DE II BIMESTRE', 34, 1),
  (2026, 5, 'tema', '#8b5cf6', '#ffffff', NULL, 18, 22, 'TEMA 1', 35, 1),
  (2026, 5, 'tema', '#8b5cf6', '#ffffff', NULL, 25, 29, 'TEMA 2', 36, 1),
  (2026, 5, 'evento', '#10b981', '#ffffff', NULL, 25, 29, 'SEMANA DE LA
EDUCACIÓN INICIAL', 37, 1),
  (2026, 5, 'feriado', '#ef4444', '#ffffff', 31, NULL, NULL, 'DIA MUNDIAL DEL
NO FUMADOR', 38, 1),
  (2026, 6, 'tema', '#8b5cf6', '#ffffff', NULL, 1, 5, 'TEMA 3', 39, 1),
  (2026, 6, 'tema', '#8b5cf6', '#ffffff', NULL, 1, 5, 'VOCABULARIO 1', 40, 1),
  (2026, 6, 'evento', '#f59e0b', '#ffffff', NULL, 1, 4, 'CELEBRAMOS
A NUESTRA BANDERA', 41, 1),
  (2026, 6, 'evento', '#10b981', '#ffffff', 4, NULL, NULL, 'DÍA INTERNACIONAL
DE LOS NIÑOS
VÍCTIMAS INOCENTES
DE AGRESIÓN', 42, 1),
  (2026, 6, 'feriado', '#ef4444', '#ffffff', 7, NULL, NULL, 'DÍA DE LA BANDERA', 43, 1),
  (2026, 6, 'examen', '#dc2626', '#ffffff', NULL, 8, 12, 'EXAMEN 1', 44, 1),
  (2026, 6, 'tema', '#8b5cf6', '#ffffff', NULL, 8, 12, 'TEMA 4', 45, 1),
  (2026, 6, 'evento', '#f59e0b', '#ffffff', 12, NULL, NULL, 'DÍA MUNDIAL CONTRA
EL TRABAJO INFANTIL', 46, 1),
  (2026, 6, 'tema', '#8b5cf6', '#ffffff', NULL, 15, 18, 'TEMA 5', 47, 1),
  (2026, 6, 'evento', '#ec4899', '#ffffff', 19, NULL, NULL, 'EVENTO DÍA
DEL PADRE
NO HAY CLASES', 48, 1),
  (2026, 6, 'feriado', '#ef4444', '#ffffff', 21, NULL, NULL, 'DÍA DEL PADRE', 49, 1),
  (2026, 6, 'tema', '#8b5cf6', '#ffffff', NULL, 22, 25, 'TEMA 6', 50, 1),
  (2026, 6, 'tema', '#8b5cf6', '#ffffff', 26, NULL, NULL, 'TEMA 5', 51, 1),
  (2026, 6, 'examen', '#dc2626', '#ffffff', 26, NULL, NULL, 'EXAMEN 2', 52, 1),
  (2026, 6, 'tema', '#8b5cf6', '#ffffff', NULL, 22, 26, 'VOCABULARIO 2', 53, 1),
  (2026, 6, 'feriado', '#ef4444', '#ffffff', 24, NULL, NULL, 'INTI RAYMI
DÍA DEL CAMPESINO', 54, 1),
  (2026, 6, 'evento', '#f59e0b', '#ffffff', 26, NULL, NULL, 'DÍA INTERNACIONAL DE
LA LUCHA CONTRA EL
USO INDEBIDO Y EL
TRÁFICO ILÍCITO DE DROGAS', 55, 1),
  (2026, 6, 'feriado', '#ef4444', '#ffffff', 29, NULL, NULL, 'FERIADO
SAN PEDRO Y SAN PABLO', 56, 1),
  (2026, 6, 'examen', '#dc2626', '#ffffff', 30, NULL, NULL, 'EXAMEN 2', 57, 1),
  (2026, 6, 'asesoria', '#f59e0b', '#ffffff', 30, NULL, NULL, 'ASESORÍADÍA DEL LOGRO', 58, 1),
  (2026, 7, 'examen', '#dc2626', '#ffffff', NULL, 1, 3, 'EXAMEN 2', 59, 1),
  (2026, 7, 'asesoria', '#f59e0b', '#ffffff', NULL, 1, 3, 'ASESORÍA DÍA DEL LOGRO', 60, 1),
  (2026, 7, 'evento', '#ec4899', '#ffffff', 4, NULL, NULL, 'INAGURACIÓN
OLIMPIADAS
VANGUARDINAS', 61, 1),
  (2026, 7, 'feriado', '#ef4444', '#ffffff', 6, NULL, NULL, 'FERIADO
DIA DEL MAESTRO', 62, 1),
  (2026, 7, 'evento', '#f59e0b', '#ffffff', NULL, 7, 10, 'DÍA DEL
LOGRO 01', 63, 1),
  (2026, 7, 'asesoria', '#f59e0b', '#ffffff', NULL, 7, 10, 'ASESORÍA DE PROYECTOS', 64, 1),
  (2026, 7, 'evento', '#f59e0b', '#ffffff', 13, NULL, NULL, 'DÍA DEL
LOGRO 01', 65, 1),
  (2026, 7, 'asesoria', '#f59e0b', '#ffffff', 13, NULL, NULL, 'ASESORÍA', 66, 1),
  (2026, 7, 'examen', '#dc2626', '#ffffff', NULL, 14, 17, 'PRESENTACIÓN
DE PROYECTOS', 67, 1),
  (2026, 7, 'examen', '#dc2626', '#ffffff', NULL, 20, 21, 'PRESENTACIÓN
DE PROYECTOS', 68, 1),
  (2026, 7, 'receso', '#6366f1', '#ffffff', NULL, 22, 24, 'SEMANA DE RECESO', 69, 1),
  (2026, 7, 'receso', '#6366f1', '#ffffff', NULL, 27, 31, 'SEMANA DE RECESO', 70, 1),
  (2026, 7, 'feriado', '#ef4444', '#ffffff', 23, NULL, NULL, 'DIA DE LA 
FUERZA AEREA 
DEL PERÚ', 71, 1),
  (2026, 7, 'feriado', '#ef4444', '#ffffff', NULL, 28, 29, 'FIESTAS PATRIAS', 72, 1),
  (2026, 8, 'inicio', '#10b981', '#ffffff', 3, NULL, NULL, 'INICIO DE III BIMESTRE', 73, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', NULL, 3, 5, 'TEMA 1', 74, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', 7, NULL, NULL, 'TEMA 1', 75, 1),
  (2026, 8, 'evento', '#10b981', '#ffffff', 7, NULL, NULL, 'CELEBRACIÓN
100 DÍAS DE CLASES', 76, 1),
  (2026, 8, 'feriado', '#ef4444', '#ffffff', 6, NULL, NULL, 'FERIADO
BATALLA DE JUNIN', 77, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', NULL, 10, 12, 'TEMA 2', 78, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', 13, NULL, NULL, 'TEMA 1', 79, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', 14, NULL, NULL, 'TEMA 2', 80, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', NULL, 17, 19, 'TEMA 3', 81, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', 20, NULL, NULL, 'TEMA 2', 82, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', 21, NULL, NULL, 'TEMA 3', 83, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', NULL, 17, 21, 'VOCABULARIO 1', 84, 1),
  (2026, 8, 'evento', '#10b981', '#ffffff', NULL, 17, 19, 'DÍA DEL NIÑO', 85, 1),
  (2026, 8, 'examen', '#dc2626', '#ffffff', NULL, 24, 28, 'EXAMEN 1', 86, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', NULL, 24, 26, 'TEMA 4', 87, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', 27, NULL, NULL, 'TEMA 3', 88, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', 28, NULL, NULL, 'TEMA 4', 89, 1),
  (2026, 8, 'tema', '#8b5cf6', '#ffffff', 31, NULL, NULL, 'TEMA 5', 90, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', NULL, 1, 2, 'TEMA 5', 91, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', 3, NULL, NULL, 'TEMA 4', 92, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', 4, NULL, NULL, 'TEMA 5', 93, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', NULL, 7, 9, 'TEMA 6', 94, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', 10, NULL, NULL, 'TEMA 5', 95, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', 11, NULL, NULL, 'TEMA 6', 96, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', NULL, 7, 11, 'VOCABULARIO 2', 97, 1),
  (2026, 9, 'evento', '#10b981', '#ffffff', 13, NULL, NULL, 'DÍA DE LA FAMILIA', 98, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', NULL, 14, 16, 'TEMA 7', 99, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', 17, NULL, NULL, 'TEMA 6', 100, 1),
  (2026, 9, 'tema', '#8b5cf6', '#ffffff', 18, NULL, NULL, 'TEMA 7', 101, 1),
  (2026, 9, 'examen', '#dc2626', '#ffffff', NULL, 14, 18, 'EXAMEN 2', 102, 1),
  (2026, 9, 'asesoria', '#f59e0b', '#ffffff', NULL, 21, 25, 'ASESORÍA', 103, 1),
  (2026, 9, 'evento', '#10b981', '#ffffff', 21, NULL, NULL, 'DÍA DEL ALZHEIMER', 104, 1),
  (2026, 9, 'evento', '#10b981', '#ffffff', NULL, 22, 25, 'SEMANA DE LA
PRIMAVERA', 105, 1),
  (2026, 9, 'evento', '#ec4899', '#ffffff', 26, NULL, NULL, 'OLIMPIADAS VANGUARD', 106, 1),
  (2026, 9, 'examen', '#dc2626', '#ffffff', NULL, 28, 30, 'EXÁMENES
BIMESTRALES', 107, 1),
  (2026, 10, 'examen', '#dc2626', '#ffffff', NULL, 1, 2, 'EXAMEN BIMESTRAL', 108, 1),
  (2026, 10, 'receso', '#6366f1', '#ffffff', NULL, 5, 9, 'SEMANA RECESO', 109, 1),
  (2026, 10, 'feriado', '#ef4444', '#ffffff', 8, NULL, NULL, 'FERIADO
COMBATE DE ANGAMOS', 110, 1),
  (2026, 10, 'evento', '#f59e0b', '#ffffff', 10, NULL, NULL, 'DIA MUNDIAL DE LA
SALUD MENTAL', 111, 1),
  (2026, 10, 'inicio', '#10b981', '#ffffff', 11, NULL, NULL, 'INICIO DE IV BIMESTRE', 112, 1),
  (2026, 10, 'tema', '#8b5cf6', '#ffffff', NULL, 12, 16, 'TEMA 1', 113, 1),
  (2026, 10, 'evento', '#f59e0b', '#ffffff', 16, NULL, NULL, 'DÍA MUNDIAL DE LA
EDUCACIÓN INCLUSIVA', 114, 1),
  (2026, 10, 'tema', '#8b5cf6', '#ffffff', NULL, 19, 23, 'TEMA 2', 115, 1),
  (2026, 10, 'tema', '#8b5cf6', '#ffffff', NULL, 26, 30, 'TEMA 3', 116, 1),
  (2026, 10, 'tema', '#8b5cf6', '#ffffff', NULL, 26, 30, 'VOCABULARIO 1', 117, 1),
  (2026, 11, 'feriado', '#ef4444', '#ffffff', 1, NULL, NULL, 'FERIADO DÍA DE
 TODOS LOS SANTOS', 118, 1),
  (2026, 11, 'examen', '#dc2626', '#ffffff', NULL, 2, 6, 'EXAMEN 1', 119, 1),
  (2026, 11, 'tema', '#8b5cf6', '#ffffff', NULL, 2, 6, 'TEMA 4', 120, 1),
  (2026, 11, 'evento', '#10b981', '#ffffff', NULL, 2, 6, 'SEMANA NACIONAL
 FORESTAL', 121, 1),
  (2026, 11, 'tema', '#8b5cf6', '#ffffff', NULL, 9, 13, 'TEMA 5', 122, 1),
  (2026, 11, 'evento', '#ec4899', '#ffffff', 14, NULL, NULL, 'ANIVERSARIO
VANGUARD INICIAL-
PRIMARIA Y SECUNDARIA', 123, 1),
  (2026, 11, 'tema', '#8b5cf6', '#ffffff', NULL, 16, 20, 'TEMA 6', 124, 1),
  (2026, 11, 'tema', '#8b5cf6', '#ffffff', NULL, 16, 20, 'VOCABULARIO 2', 125, 1),
  (2026, 11, 'examen', '#dc2626', '#ffffff', NULL, 23, 27, 'EXAMEN 2', 126, 1),
  (2026, 11, 'tema', '#8b5cf6', '#ffffff', NULL, 23, 27, 'TEMA 7', 127, 1),
  (2026, 11, 'evento', '#ef4444', '#ffffff', 25, NULL, NULL, 'DIA INTERNACIONAL
PARA LA ELIMINACIÓN
 DE LA VIOLENCIA
CONTRA LA MUJER', 128, 1),
  (2026, 11, 'evento', '#f59e0b', '#ffffff', 30, NULL, NULL, 'DIA DEL LOGRO 2', 129, 1),
  (2026, 11, 'asesoria', '#f59e0b', '#ffffff', 30, NULL, NULL, 'ASESORÍA', 130, 1),
  (2026, 11, 'feriado', '#ef4444', '#ffffff', 30, NULL, NULL, 'DÍA MUNDIAL DE LA
LUCHA CONTRA EL SIDA', 131, 1),
  (2026, 12, 'evento', '#f59e0b', '#ffffff', NULL, 1, 4, 'DÍA DEL LOGRO', 132, 1),
  (2026, 12, 'asesoria', '#f59e0b', '#ffffff', NULL, 1, 4, 'ASESORÍA', 133, 1),
  (2026, 12, 'evento', '#10b981', '#ffffff', 3, NULL, NULL, 'DÍA INTERNACIONAL DE LAS
PERSONAS CON DISCAPACIDAD', 134, 1),
  (2026, 12, 'evento', '#10b981', '#ffffff', 7, NULL, NULL, 'CLAUSURA NATACION', 135, 1),
  (2026, 12, 'feriado', '#ef4444', '#ffffff', 8, NULL, NULL, 'FERIADO
INMACULADA CONCEPCIÓN', 136, 1),
  (2026, 12, 'feriado', '#ef4444', '#ffffff', 9, NULL, NULL, 'BATALLA DE AYACUCHO', 137, 1),
  (2026, 12, 'examen', '#dc2626', '#ffffff', NULL, 10, 11, 'EXÁMENES
BIMESTRALES', 138, 1),
  (2026, 12, 'examen', '#dc2626', '#ffffff', NULL, 14, 17, 'EXÁMENES
BIMESTRALES', 139, 1),
  (2026, 12, 'evento', '#ec4899', '#ffffff', 18, NULL, NULL, 'COMPARTIR NAVIDEÑO', 140, 1),
  (2026, 12, 'actuacion', '#ec4899', '#ffffff', 21, NULL, NULL, 'CLAUSURA SECUNDARIA
09:00 a 09:00am
INICIAL
09:00 a 10:00am
PRIMARIA
10:00 a 11:00am', 141, 1),
  (2026, 12, 'feriado', '#ef4444', '#ffffff', 25, NULL, NULL, 'FERIADO NAVIDAD', 142, 1);

-- Total eventos: 142