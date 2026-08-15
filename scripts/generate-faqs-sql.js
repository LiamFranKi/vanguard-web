/**
 * Genera sql/web_faqs.sql desde config/faqs.json
 * Uso: node scripts/generate-faqs-sql.js
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const jsonPath = path.join(root, 'config', 'faqs.json')
const outPath = path.join(root, 'sql', 'web_faqs.sql')

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const faqs = data.faqs || []

function slugify(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "''")
}

const categoriasOrden = []
const seen = new Set()
for (const f of faqs) {
  const cat = String(f.categoria || 'OTROS').trim()
  if (!seen.has(cat)) {
    seen.add(cat)
    categoriasOrden.push(cat)
  }
}

const lines = []
lines.push('/**')
lines.push(' * Preguntas frecuentes — categorías + FAQs (seed desde config/faqs.json)')
lines.push(' * Base: vanguard_intranet')
lines.push(' * phpMyAdmin → SQL → pegar y Continuar')
lines.push(` * Categorías: ${categoriasOrden.length} · Preguntas: ${faqs.length}`)
lines.push(' *')
lines.push(' * La web agrupa por categoría (mismo diseño). Orden = orden de aparición en el JSON.')
lines.push(' */')
lines.push('')
lines.push('CREATE TABLE IF NOT EXISTS `web_faq_categorias` (')
lines.push('  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,')
lines.push('  `codigo` VARCHAR(80) NOT NULL COMMENT \'slug estable para intranet\',')
lines.push('  `etiqueta` VARCHAR(120) NOT NULL COMMENT \'texto visible, ej. ADMISIÓN Y MATRÍCULA\',')
lines.push('  `orden` INT NOT NULL DEFAULT 0,')
lines.push('  `activo` TINYINT(1) NOT NULL DEFAULT 1,')
lines.push('  PRIMARY KEY (`id`),')
lines.push('  UNIQUE KEY `uk_web_faq_cat_codigo` (`codigo`)')
lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
lines.push('')
lines.push('CREATE TABLE IF NOT EXISTS `web_faqs` (')
lines.push('  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,')
lines.push('  `categoria_id` INT UNSIGNED NOT NULL,')
lines.push('  `pregunta` VARCHAR(500) NOT NULL,')
lines.push('  `respuesta` TEXT NOT NULL,')
lines.push('  `orden` INT NOT NULL DEFAULT 0,')
lines.push('  `activo` TINYINT(1) NOT NULL DEFAULT 1,')
lines.push('  PRIMARY KEY (`id`),')
lines.push('  KEY `idx_web_faqs_cat` (`categoria_id`),')
lines.push('  KEY `idx_web_faqs_activo` (`activo`),')
lines.push(
  '  CONSTRAINT `fk_web_faqs_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `web_faq_categorias` (`id`) ON DELETE RESTRICT'
)
lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
lines.push('')
lines.push('-- Categorías (áreas / secciones de la página)')
lines.push(
  'INSERT INTO `web_faq_categorias` (`codigo`, `etiqueta`, `orden`, `activo`) VALUES'
)
const catRows = categoriasOrden.map((et, i) => {
  return `  ('${esc(slugify(et))}', '${esc(et)}', ${i + 1}, 1)`
})
lines.push(catRows.join(',\n'))
lines.push('ON DUPLICATE KEY UPDATE')
lines.push('  `etiqueta` = VALUES(`etiqueta`),')
lines.push('  `orden` = VALUES(`orden`),')
lines.push('  `activo` = 1;')
lines.push('')
lines.push('-- Re-seed FAQs (idempotente)')
lines.push('DELETE FROM `web_faqs`;')
lines.push('')
lines.push(`-- Preguntas (${faqs.length})`)
lines.push(
  'INSERT INTO `web_faqs` (`categoria_id`, `pregunta`, `respuesta`, `orden`, `activo`) VALUES'
)

const faqRows = faqs.map((f, i) => {
  const cat = String(f.categoria || 'OTROS').trim()
  const codigo = slugify(cat)
  const pregunta = esc(f.pregunta || '')
  const respuesta = esc(f.respuesta || '')
  return `  ((SELECT id FROM web_faq_categorias WHERE codigo = '${esc(codigo)}' LIMIT 1), '${pregunta}', '${respuesta}', ${i + 1}, 1)`
})
lines.push(faqRows.join(',\n') + ';')
lines.push('')
lines.push(`-- Total preguntas: ${faqs.length}`)
lines.push('-- Categorías:')
categoriasOrden.forEach((c, i) => {
  lines.push(`--   ${i + 1}. ${c} (${slugify(c)})`)
})

fs.writeFileSync(outPath, lines.join('\n'), 'utf8')
console.log('Wrote', outPath, 'cats=', categoriasOrden.length, 'faqs=', faqs.length)
console.log(categoriasOrden.map((c, i) => `${i + 1}. ${c}`).join('\n'))
