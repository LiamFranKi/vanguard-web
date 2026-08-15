/**
 * Preguntas frecuentes — categorías + FAQs (seed desde config/faqs.json)
 * Base: vanguard_intranet
 * phpMyAdmin → SQL → pegar y Continuar
 * Categorías: 7 · Preguntas: 20
 *
 * La web agrupa por categoría (mismo diseño). Orden = orden de aparición en el JSON.
 */

CREATE TABLE IF NOT EXISTS `web_faq_categorias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(80) NOT NULL COMMENT 'slug estable para intranet',
  `etiqueta` VARCHAR(120) NOT NULL COMMENT 'texto visible, ej. ADMISIÓN Y MATRÍCULA',
  `orden` INT NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_web_faq_cat_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `web_faqs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `categoria_id` INT UNSIGNED NOT NULL,
  `pregunta` VARCHAR(500) NOT NULL,
  `respuesta` TEXT NOT NULL,
  `orden` INT NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_web_faqs_cat` (`categoria_id`),
  KEY `idx_web_faqs_activo` (`activo`),
  CONSTRAINT `fk_web_faqs_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `web_faq_categorias` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categorías (áreas / secciones de la página)
INSERT INTO `web_faq_categorias` (`codigo`, `etiqueta`, `orden`, `activo`) VALUES
  ('admision-y-matricula', 'ADMISIÓN Y MATRÍCULA', 1, 1),
  ('costos-y-pagos', 'COSTOS Y PAGOS', 2, 1),
  ('horarios-y-calendario', 'HORARIOS Y CALENDARIO', 3, 1),
  ('academico-y-pedagogico', 'ACADÉMICO Y PEDAGÓGICO', 4, 1),
  ('servicios-y-actividades', 'SERVICIOS Y ACTIVIDADES', 5, 1),
  ('comunicacion-con-padres', 'COMUNICACIÓN CON PADRES', 6, 1),
  ('otros', 'OTROS', 7, 1)
ON DUPLICATE KEY UPDATE
  `etiqueta` = VALUES(`etiqueta`),
  `orden` = VALUES(`orden`),
  `activo` = 1;

-- Re-seed FAQs (idempotente)
DELETE FROM `web_faqs`;

-- Preguntas (20)
INSERT INTO `web_faqs` (`categoria_id`, `pregunta`, `respuesta`, `orden`, `activo`) VALUES
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'admision-y-matricula' LIMIT 1), '¿Cuál es la edad mínima para ingresar a inicial?', 'En inicial, a partir de los 3 años cumplidos hasta el 31 de marzo 2026.', 1, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'admision-y-matricula' LIMIT 1), '¿Cuál es la capacidad máxima de estudiantes por salón?', 'Nivel inicial: máximo 25 estudiantes.
Nivel primaria: máximo 30 estudiantes.
Nivel secundaria: máximo 30 estudiantes.', 2, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'admision-y-matricula' LIMIT 1), '¿Puedo trasladar a mi hijo una vez iniciado el año escolar?', 'Sí, pero el traslado estará sujeto a la disponibilidad de vacantes. Si es aprobado, deberás cumplir con las condiciones y obligaciones correspondientes a un estudiante nuevo.', 3, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'costos-y-pagos' LIMIT 1), '¿Cuáles son los costos de la matrícula, pensión y otros?', 'Nivel inicial: matrícula S/510 – pensión S/510.
Nivel primaria: matrícula S/510 – pensión S/510.
Nivel secundaria: matrícula S/530 – pensión S/530.
Evaluación psicopedagógica S/50.', 4, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'costos-y-pagos' LIMIT 1), '¿Hay descuentos por hermanos?', 'Sí, a partir del 2do hermano, descuento de S/20 en matrícula y pensión.', 5, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'horarios-y-calendario' LIMIT 1), '¿Cuál es el horario de clases por nivel?', 'Inicial: 8:00 am – 12:30 pm.
Primaria: 7:35 am – 1:30 pm.
Secundaria: 7:35 am – 2:00 pm.', 6, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'horarios-y-calendario' LIMIT 1), '¿Cuándo es el inicio de clases?', 'El inicio de clases en nuestros 3 niveles es el viernes 6 de marzo.', 7, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'horarios-y-calendario' LIMIT 1), '¿Hay vacaciones durante el año para los estudiantes?', 'Sí, al final de cada bimestre, los estudiantes de los 3 niveles tienen una semana de receso.', 8, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'academico-y-pedagogico' LIMIT 1), '¿Cuál es la metodología educativa en el nivel inicial?', 'Basada en el enfoque STEAM (Science, Technology, Engineering, Arts and Mathematics), con proyectos, resolución de problemas, aprendizaje activo y colaborativo.', 9, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'academico-y-pedagogico' LIMIT 1), '¿Cuál es la metodología educativa en primaria y secundaria?', 'Aplicamos el modelo de Aula Invertida (Flipped Classroom), donde los estudiantes ven la teoría en casa y en clase trabajan práctica, debates y proyectos.', 10, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'academico-y-pedagogico' LIMIT 1), '¿Qué idiomas imparten y desde qué grado comienzan?', 'Inglés desde inicial, con proyectos, debates y club de conversación en inglés, además de visitas de profesores nativos.', 11, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'academico-y-pedagogico' LIMIT 1), '¿Cómo se evalúa a los estudiantes?', 'Evaluación continua, formativa y multidimensional: prácticas, trabajos, presentaciones y observaciones con retroalimentación y rúbricas claras.', 12, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'academico-y-pedagogico' LIMIT 1), '¿Se permite el uso de tecnología en clase?', 'Sí. Desde 4.º de primaria hasta 5.º de secundaria los estudiantes usan tablets como herramienta educativa. La compra es asumida por los padres.', 13, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'servicios-y-actividades' LIMIT 1), '¿Qué actividades extracurriculares ofrecen?', 'Talleres gratuitos de natación y danzas, además de fútbol, vóley y balonmano dentro de Educación Física.', 14, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'servicios-y-actividades' LIMIT 1), '¿Cuentan con departamento de psicología?', 'Sí. Ofrecemos acompañamiento socioemocional, protocolos anti-bullying, orientación vocacional, talleres y escuela para padres, siempre con confidencialidad.', 15, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'comunicacion-con-padres' LIMIT 1), '¿Cómo se informa a los padres sobre el progreso académico?', 'Reportes bimestrales, plataforma digital con calificaciones en tiempo real, reuniones personalizadas y alertas tempranas.', 16, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'comunicacion-con-padres' LIMIT 1), '¿Con qué frecuencia se realizan reuniones de padres y maestros?', 'Reuniones generales al inicio del año y reuniones individuales bimestrales con cada familia.', 17, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'comunicacion-con-padres' LIMIT 1), '¿Tienen plataforma virtual o aplicación?', 'Sí. Contamos con la Intranet Vanguardroom 4.0 y una APP móvil que notifica sobre asistencias, calificaciones y comunicados.', 18, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'otros' LIMIT 1), '¿Los estudiantes usan uniforme?', 'En Vanguard Schools no exigimos uniforme completo. Solo se requiere el buzo institucional y polos distintivos para actividades académicas y deportivas. Esto mantiene la identidad del colegio, con comodidad y sin gastos innecesarios. La vestimenta siempre debe respetar el Reglamento Interno.', 19, 1),
  ((SELECT id FROM web_faq_categorias WHERE codigo = 'otros' LIMIT 1), 'Calidad de la enseñanza en Vanguard Schools', 'Contamos con un equipo docente de alto nivel, capacitado en metodologías modernas como STEAM y Aula Invertida, evaluados y acompañados durante todo el año.', 20, 1);

-- Total preguntas: 20
-- Categorías:
--   1. ADMISIÓN Y MATRÍCULA (admision-y-matricula)
--   2. COSTOS Y PAGOS (costos-y-pagos)
--   3. HORARIOS Y CALENDARIO (horarios-y-calendario)
--   4. ACADÉMICO Y PEDAGÓGICO (academico-y-pedagogico)
--   5. SERVICIOS Y ACTIVIDADES (servicios-y-actividades)
--   6. COMUNICACIÓN CON PADRES (comunicacion-con-padres)
--   7. OTROS (otros)