/**
 * Genera sql/web_calendarizacion.sql desde config/calendarizacion.json
 * Uso: node scripts/generate-calendarizacion-sql.js
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const jsonPath = path.join(root, 'config', 'calendarizacion.json')
const outPath = path.join(root, 'sql', 'web_calendarizacion.sql')

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const anio = data['año'] || data.anio || 2026

const etiquetaConcepto = {
  reunion: 'Reunión',
  inicio: 'Inicio',
  feriado: 'Feriado',
  tema: 'Tema',
  evento: 'Evento',
  examen: 'Examen',
  asesoria: 'Asesoría',
  receso: 'Receso',
  actuacion: 'Actuación',
}

const conceptos = new Map()
const eventos = []
let orden = 0

for (const [mesKey, mes] of Object.entries(data.meses || {})) {
  const mesNum = Number(mesKey)
  for (const ev of mes.eventos || []) {
    orden += 1
    const tipo = String(ev.tipo || 'evento')
    if (!conceptos.has(tipo)) {
      conceptos.set(tipo, {
        tipo,
        color: ev.color || '#3b82f6',
        colorTexto: ev.colorTexto || '#ffffff',
      })
    }
    eventos.push({
      mes: mesNum,
      tipo,
      color: ev.color || '#3b82f6',
      colorTexto: ev.colorTexto || '#ffffff',
      dia: ev.dia != null ? Number(ev.dia) : null,
      ri: ev.rango ? Number(ev.rango.inicio) : null,
      rf: ev.rango ? Number(ev.rango.fin) : null,
      texto: String(ev.texto || ''),
      orden,
    })
  }
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "''")
}

const lines = []
lines.push('/**')
lines.push(' * Calendarización académica — tablas + seed desde config/calendarizacion.json')
lines.push(' * Base: vanguard_intranet')
lines.push(' * phpMyAdmin → SQL → pegar y Continuar')
lines.push(` * Año seed: ${anio} · eventos: ${eventos.length}`)
lines.push(' */')
lines.push('')
lines.push('CREATE TABLE IF NOT EXISTS `web_calendarizacion` (')
lines.push('  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,')
lines.push('  `anio` SMALLINT NOT NULL,')
lines.push('  `activo` TINYINT(1) NOT NULL DEFAULT 1,')
lines.push('  `creado_en` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,')
lines.push('  PRIMARY KEY (`id`),')
lines.push('  UNIQUE KEY `uk_web_cal_anio` (`anio`)')
lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
lines.push('')
lines.push('CREATE TABLE IF NOT EXISTS `web_calendarizacion_conceptos` (')
lines.push('  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,')
lines.push('  `codigo` VARCHAR(40) NOT NULL COMMENT \'tipo del JSON: feriado, tema, etc.\',')
lines.push('  `etiqueta` VARCHAR(80) NOT NULL,')
lines.push('  `color` VARCHAR(20) NOT NULL DEFAULT \'#3b82f6\',')
lines.push('  `color_texto` VARCHAR(20) NOT NULL DEFAULT \'#ffffff\',')
lines.push('  `activo` TINYINT(1) NOT NULL DEFAULT 1,')
lines.push('  `orden` INT NOT NULL DEFAULT 0,')
lines.push('  PRIMARY KEY (`id`),')
lines.push('  UNIQUE KEY `uk_web_cal_concepto` (`codigo`)')
lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
lines.push('')
lines.push('CREATE TABLE IF NOT EXISTS `web_calendarizacion_eventos` (')
lines.push('  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,')
lines.push('  `anio` SMALLINT NOT NULL,')
lines.push('  `mes` TINYINT NOT NULL COMMENT \'1-12\',')
lines.push('  `tipo` VARCHAR(40) NOT NULL,')
lines.push('  `color` VARCHAR(20) NOT NULL,')
lines.push('  `color_texto` VARCHAR(20) NOT NULL DEFAULT \'#ffffff\',')
lines.push('  `dia` TINYINT DEFAULT NULL COMMENT \'día único; NULL si usa rango\',')
lines.push('  `rango_inicio` TINYINT DEFAULT NULL,')
lines.push('  `rango_fin` TINYINT DEFAULT NULL,')
lines.push('  `texto` TEXT NOT NULL COMMENT \'puede incluir saltos de línea\',')
lines.push('  `orden` INT NOT NULL DEFAULT 0,')
lines.push('  `activo` TINYINT(1) NOT NULL DEFAULT 1,')
lines.push('  PRIMARY KEY (`id`),')
lines.push('  KEY `idx_web_cal_ev_anio_mes` (`anio`, `mes`),')
lines.push('  KEY `idx_web_cal_ev_activo` (`activo`)')
lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;')
lines.push('')
lines.push('-- Año')
lines.push(
  `INSERT INTO \`web_calendarizacion\` (\`anio\`, \`activo\`) VALUES (${anio}, 1)`
)
lines.push('ON DUPLICATE KEY UPDATE `activo` = 1;')
lines.push('')
lines.push('-- Conceptos (colores por tipo)')
lines.push(
  'INSERT INTO `web_calendarizacion_conceptos` (`codigo`, `etiqueta`, `color`, `color_texto`, `activo`, `orden`) VALUES'
)
const concRows = [...conceptos.values()].map((c, i) => {
  const et = etiquetaConcepto[c.tipo] || c.tipo
  return `  ('${esc(c.tipo)}', '${esc(et)}', '${esc(c.color)}', '${esc(c.colorTexto)}', 1, ${i + 1})`
})
lines.push(concRows.join(',\n'))
lines.push('ON DUPLICATE KEY UPDATE')
lines.push('  `etiqueta` = VALUES(`etiqueta`),')
lines.push('  `color` = VALUES(`color`),')
lines.push('  `color_texto` = VALUES(`color_texto`),')
lines.push('  `activo` = 1;')
lines.push('')
lines.push(`-- Re-seed eventos del año ${anio} (idempotente)`)
lines.push(`DELETE FROM \`web_calendarizacion_eventos\` WHERE \`anio\` = ${anio};`)
lines.push('')
lines.push(`-- Eventos seed (${eventos.length}) desde JSON`)
lines.push('INSERT INTO `web_calendarizacion_eventos`')
lines.push(
  '  (`anio`, `mes`, `tipo`, `color`, `color_texto`, `dia`, `rango_inicio`, `rango_fin`, `texto`, `orden`, `activo`) VALUES'
)
const evRows = eventos.map((e) => {
  const dia = e.dia == null ? 'NULL' : String(e.dia)
  const ri = e.ri == null ? 'NULL' : String(e.ri)
  const rf = e.rf == null ? 'NULL' : String(e.rf)
  return `  (${anio}, ${e.mes}, '${esc(e.tipo)}', '${esc(e.color)}', '${esc(e.colorTexto)}', ${dia}, ${ri}, ${rf}, '${esc(e.texto)}', ${e.orden}, 1)`
})
lines.push(evRows.join(',\n') + ';')
lines.push('')
lines.push(`-- Total eventos: ${eventos.length}`)

fs.writeFileSync(outPath, lines.join('\n'), 'utf8')
console.log('Wrote', outPath, 'eventos=', eventos.length, 'conceptos=', conceptos.size)
