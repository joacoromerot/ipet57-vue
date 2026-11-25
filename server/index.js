import express from 'express'
import { readFileSync } from 'node:fs'
import { existsSync, mkdirSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const PORT = process.env.PORT || 3000

// Base de conocimiento del asistente (misma que usa el front)
const faq = JSON.parse(readFileSync(path.join(rootDir, 'src', 'chat.json'), 'utf-8'))

const normalizar = (texto) =>
  String(texto)
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const FALLBACK =
  'No tengo esa información confirmada. Podés consultar el Facebook oficial https://www.facebook.com/Ipet57.'

// Busca la entrada con más coincidencias de keywords
function buscarRespuesta(consulta) {
  const q = normalizar(consulta)
  let mejor = null
  let mejorPuntaje = 0

  for (const item of faq) {
    const puntaje = item.keywords.reduce(
      (acc, key) => (q.includes(normalizar(key)) ? acc + 1 : acc),
      0
    )
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje
      mejor = item
    }
  }
  return mejor
}

// Base de datos SQLite (data/ipet57.db) para guardar todas las consultas
const dataDir = path.join(rootDir, 'data')
mkdirSync(dataDir, { recursive: true })
const db = new DatabaseSync(path.join(dataDir, 'ipet57.db'))
db.exec(`
  CREATE TABLE IF NOT EXISTS mensajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sesion TEXT,
    mensaje TEXT NOT NULL,
    respuesta_id TEXT,
    respuesta TEXT NOT NULL,
    fecha TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_mensajes_sesion ON mensajes (sesion);
`)
const guardarMensaje = db.prepare(
  'INSERT INTO mensajes (sesion, mensaje, respuesta_id, respuesta) VALUES (?, ?, ?, ?)'
)

// Token para ver lo guardado (definilo en la variable de entorno ADMIN_TOKEN)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '10kb' }))

// Límite simple de pedidos por IP (30 por minuto)
const hits = new Map()
function limitar(req, res, next) {
  const ip = req.ip
  const ahora = Date.now()
  const recientes = (hits.get(ip) || []).filter((t) => ahora - t < 60_000)
  recientes.push(ahora)
  hits.set(ip, recientes)
  if (recientes.length > 30) {
    return res.status(429).json({ error: 'Demasiadas consultas. Probá de nuevo en un minuto.' })
  }
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, preguntas: faq.length })
})

app.get('/api/faq', (_req, res) => {
  res.json(faq.map(({ id, pregunta }) => ({ id, pregunta })))
})

app.post('/api/chat', limitar, (req, res) => {
  const mensaje = req.body?.mensaje
  if (typeof mensaje !== 'string' || !mensaje.trim() || mensaje.length > 300) {
    return res.status(400).json({ error: 'Mensaje inválido.' })
  }

  const sesion = typeof req.body?.sesion === 'string' ? req.body.sesion.slice(0, 64) : null
  const encontrada = buscarRespuesta(mensaje)
  const respuesta = encontrada?.respuesta ?? FALLBACK

  guardarMensaje.run(sesion, mensaje.trim(), encontrada?.id ?? null, respuesta)

  res.json({ id: encontrada?.id ?? null, respuesta })
})

// Ver lo guardado: /api/mensajes?limite=100  (header: Authorization: Bearer <ADMIN_TOKEN>)
app.get('/api/mensajes', (req, res) => {
  if (!ADMIN_TOKEN || req.get('authorization') !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'No autorizado.' })
  }
  const limite = Math.min(Number(req.query.limite) || 100, 1000)
  const filas = db
    .prepare('SELECT * FROM mensajes ORDER BY id DESC LIMIT ?')
    .all(limite)
  res.json(filas)
})

// En producción sirve el build de Vue (npm run build)
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`Servidor IPET 57 en http://localhost:${PORT}`)
})
