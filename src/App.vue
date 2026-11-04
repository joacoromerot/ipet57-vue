
<script setup>

import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// Menú responsive
const menuAbierto = ref(false)

// Año actual
const anio = new Date().getFullYear()

// Botón volver arriba
const mostrarVolverArriba = ref(false)

// Navegación activa
const seccionActiva = ref('')

// Calificación
const calificacion = ref(0)

// Chat
const pregunta = ref('')
const chatMessages = ref(null)
const respondiendo = ref(false)

const mensajes = ref([
  {
    tipo: 'bot',
    texto: '¡Hola! Soy el asistente informativo del IPET 57. Puedo orientarte con datos públicos de la escuela y ayudarte a encontrar los canales oficiales.'
  }
])

const preguntasRapidas = [
  '¿Qué especialidades hay?',
  '¿Dónde queda el IPET 57?',
  '¿Cómo me contacto?'
]

// Respuestas del asistente
const respuestas = [
  {
    keys: [
      'especialidad', 'carrera', 'orientacion', 'orientación',
      'programacion', 'programación', 'automotor',
      'electronica', 'electrónica', 'electricidad'
    ],
    text: 'Esta maqueta presenta cuatro especialidades: Programación, Automotores, Electrónica y Electricidad. La oferta vigente debe confirmarse directamente con la institución. Facebook: https://www.facebook.com/Ipet57'
  },
  {
    keys: [
      'donde', 'dónde', 'dirección', 'direccion',
      'ubicacion', 'ubicación', 'queda', 'mapa', 'llegar'
    ],
    text: 'La dirección de referencia utilizada en esta página es 25 de Mayo 1500, barrio General Paz, Córdoba. Podés consultar el mapa en la sección Contacto.'
  },
  {
    keys: [
      'contacto', 'telefono', 'teléfono', 'llamar',
      'correo', 'mail', 'email', 'facebook', 'instagram'
    ],
    text: 'Podés consultar los canales publicados: Facebook https://www.facebook.com/Ipet57 e Instagram https://www.instagram.com/ipet_57. Confirmá que los datos sigan vigentes.'
  },
  {
    keys: [
      'inscripcion', 'inscripción', 'inscribirme',
      'inscripciones', 'requisito', 'fecha', 'horario'
    ],
    text: 'No tengo fechas, requisitos ni horarios confirmados. Consultá directamente los canales oficiales del IPET 57.'
  },
  {
    keys: [
      'hola', 'buenas', 'buenos dias',
      'buenos días', 'buenas tardes', 'buenas noches'
    ],
    text: '¡Hola! Puedo orientarte sobre especialidades, ubicación y canales de contacto. ¿Qué querés consultar?'
  }
]

// Enviar pregunta
async function enviarPregunta(texto = pregunta.value) {
  const consulta = texto.trim()

  if (!consulta || respondiendo.value) return

  mensajes.value.push({
    tipo: 'user',
    texto: consulta
  })

  pregunta.value = ''
  respondiendo.value = true

  await nextTick()
  desplazarChat()

  const q = consulta
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const encontrada = respuestas.find(item =>
    item.keys.some(key => {
      const palabra = key
        .toLocaleLowerCase('es')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

      return q.includes(palabra)
    })
  )

  const respuesta = encontrada?.text ||
    'No tengo esa información confirmada. Podés consultar el Facebook oficial https://www.facebook.com/Ipet57.'

  window.setTimeout(async () => {
    mensajes.value.push({
      tipo: 'bot',
      texto: respuesta
    })

    respondiendo.value = false

    await nextTick()
    desplazarChat()
  }, 350)
}

// Desplazar conversación
function desplazarChat() {
  if (chatMessages.value) {
    chatMessages.value.scrollTo({
      top: chatMessages.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

// Menú
function alternarMenu() {
  menuAbierto.value = !menuAbierto.value
}

function cerrarMenu() {
  menuAbierto.value = false
}

// Volver arriba
function volverArriba() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Detectar scroll y sección activa
function controlarScroll() {
  mostrarVolverArriba.value = window.scrollY > 500

  const secciones = document.querySelectorAll('main section[id]')

  let activa = ''

  secciones.forEach(seccion => {
    if (window.scrollY >= seccion.offsetTop - 150) {
      activa = seccion.id
    }
  })

  seccionActiva.value = activa
}

// Animaciones
let observer = null

onMounted(() => {
  controlarScroll()

  window.addEventListener('scroll', controlarScroll, {
    passive: true
  })

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.12
    })

    document.querySelectorAll('.reveal').forEach(element => {
      observer.observe(element)
    })
  } else {
    document.querySelectorAll('.reveal').forEach(element => {
      element.classList.add('visible')
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', controlarScroll)
  observer?.disconnect()
})

</script>




<template>

  <div class="top-line"></div>
  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="IPET 57 inicio">
      <img class="brand-logo" src="../public/ipet57-school-logo.jpg.jpeg" alt="Escudo del IPET 57">
      <span><b>IPET 57</b><small>COMODORO MARTÍN RIVADAVIA</small></span>
    </a>
    <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
    <nav class="nav" id="nav">
      <a href="#top">Inicio</a><a href="#institucion">Institución</a><a href="#especialidades">Especialidades</a>
      <a href="#vida-escolar">Vida escolar</a><a href="#novedades">Novedades</a><a href="#contacto">Contacto</a>
    </nav>
    <a class="button button-yellow header-cta" href="#contacto">◉ Consultar</a>
  </header>

  <main>
    <section class="hero">
      <div class="hero-shade"></div>
      <div class="hero-content reveal">
        <span class="eyebrow"> ESCUELA SECUNDARIA TÉCNICA · CÓRDOBA, ARGENTINA</span>
        <div class="crest"><img src="../public/ipet57-school-logo.jpg.jpeg" alt="Escudo del IPET 57"></div>
        <p class="hero-kicker">I.P.E.T. N.º 57 · COMODORO MARTÍN RIVADAVIA</p>
        <h1>Aprender haciendo.<br><span>Construir futuro.</span></h1>
        <p class="hero-description">Una escuela técnica donde las ideas se prueban, se corrigen y se vuelven oficio. Conocé la institución, sus especialidades y su vida cotidiana.</p>
        <div class="hero-actions">
          <a class="button button-light" href="#institucion">Conocer la institución <span>↗</span></a>
          <a class="button button-outline" href="#especialidades">Ver especialidades <span>↓</span></a>
        </div>
        <p class="image-note">◌ IMAGEN ILUSTRATIVA DE EDUCACIÓN TÉCNICA</p>
      </div>
    </section>

    <section class="stats wrap reveal" aria-label="Datos de la institución">
      <article><b>Técnica</b><span>Escuela secundaria provincial de modalidad técnica.</span></article>
      <article><b>4</b><span>Especialidades presentadas en esta página.</span></article>
      <article><b>Gral. Paz</b><span>25 de Mayo 1500, Córdoba capital.</span></article>
      <article><b>Formación</b><span>Aprendizaje práctico y trabajo en equipo.</span></article>
    </section>

    <section class="section wrap institution" id="institucion">
      <div class="photo-panel reveal">
        <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1100&q=85" alt="Estudiantes trabajando en un entorno técnico">
        <div class="photo-caption"><span class="caption-icon">✓</span><span><b>Datos con fuente</b><small>La información institucional debe confirmarse con los canales oficiales del colegio.</small></span></div>
      </div>
      <div class="section-copy reveal">
        <span class="section-label">01 / LA INSTITUCIÓN</span>
        <h2>Una escuela para entender cómo funcionan las cosas.</h2>
        <p>El I.P.E.T. N.º 57 “Comodoro Martín Rivadavia” es una institución de educación técnica ubicada en barrio General Paz, Córdoba.</p>
        <p>La formación técnica combina conocimientos, práctica, resolución de problemas y trabajo colaborativo.</p>
        <div class="value-list">
          <div><span>▦</span><p><b>Identidad educativa</b><small>Formación secundaria con acompañamiento, desafíos y una mirada puesta en la comunidad.</small></p></div>
          <div><span>⌁</span><p><b>Orientación técnica</b><small>Las especialidades acercan la experiencia escolar al mundo técnico y profesional.</small></p></div>
          <div><span>◎</span><p><b>Comunidad escolar</b><small>Estudiantes, docentes y familias construyen juntos la vida cotidiana de la escuela.</small></p></div>
        </div>
      </div>
    </section>

    <section class="section section-soft" id="especialidades">
      <div class="wrap">
        <div class="section-heading reveal"><div><span class="section-label">02 / ESPECIALIDADES</span><h2>Cuatro recorridos para entrar a la técnica.</h2></div><p>Cada especialidad propone una forma distinta de aprender haciendo. Elegí la que más te intrigue y seguí explorando.</p></div>
        <div class="specialty-grid">
          <article class="specialty-card reveal"><div class="card-image"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" alt="Programación en computadoras"><span>01</span></div><div class="card-body"><span class="mini-label">SOFTWARE Y LÓGICA</span><h3>Programación</h3><p>Aprender a pensar en problemas, crear soluciones digitales y descubrir cómo funcionan los sistemas.</p><a href="#contacto">Consultar especialidad ↗</a></div></article>
          <article class="specialty-card reveal"><div class="card-image"><img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80" alt="Trabajo mecánico y automotor"><span>02</span></div><div class="card-body"><span class="mini-label">MÁQUINAS Y MOVIMIENTO</span><h3>Automotores</h3><p>Explorar sistemas mecánicos, mantenimiento y el funcionamiento de vehículos.</p><a href="#contacto">Consultar especialidad ↗</a></div></article>
          <article class="specialty-card reveal"><div class="card-image"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" alt="Placas electrónicas"><span>03</span></div><div class="card-body"><span class="mini-label">CIRCUITOS Y SEÑALES</span><h3>Electrónica</h3><p>Conocer componentes, circuitos y sistemas que conectan la tecnología con la vida diaria.</p><a href="#contacto">Consultar especialidad ↗</a></div></article>
         </div>
        <div class="notice"><span>⚠</span><p><b>Sobre la oferta vigente</b><small>Las especialidades y su disponibilidad deben confirmarse con la institución. Esta sección es una maqueta visual y no reemplaza la información oficial.</small></p></div>
      </div>
    </section>

    <section class="section wrap" id="vida-escolar">
      <div class="section-heading reveal"><div><span class="section-label">03 / VIDA ESCOLAR</span><h2>La técnica se aprende en la práctica.</h2></div><p>Una mirada a los espacios y actividades que pueden formar parte de una escuela técnica.</p></div>
      <div class="life-grid">
        <article class="life-card reveal"><img src="https://th.bing.com/th/id/OIP.AGgLMLMiZcTA_F0p0HNDnAHaEK?w=321&h=180&c=7&r=0&o=7&pid=1.7&rm=3" alt="Taller técnico"><div><span class="photo-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.8"/><path d="m21 15-4.5-4.5L8 19"/></svg> ESPACIO PARA FOTOGRAFÍA</span><h3>Taller de Automotores</h3><p>Espacio preparado para fotografías del taller y de los trabajos prácticos.</p></div></article>
        <article class="life-card reveal"><img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=85" alt="Laboratorio tecnológico"><div><span class="photo-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.8"/><path d="m21 15-4.5-4.5L8 19"/></svg> ESPACIO PARA FOTOGRAFÍA</span><h3>Laboratorio de Electrónica</h3><p>Lugar reservado para registrar prácticas de medición y armado de circuitos.</p></div></article>
        <article class="life-card reveal"><img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=85" alt="Estudiantes colaborando"><div><span class="photo-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.8"/><path d="m21 15-4.5-4.5L8 19"/></svg> ESPACIO PARA FOTOGRAFÍA</span><h3>Aula de Programación</h3><p>Espacio para mostrar proyectos, pantallas y trabajos de los estudiantes.</p></div></article>
        <article class="life-card reveal"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85" alt="Actividad grupal educativa"><div><span class="photo-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.8"/><path d="m21 15-4.5-4.5L8 19"/></svg> ESPACIO PARA FOTOGRAFÍA</span><h3>Actividades institucionales</h3><p>Un lugar para actos, muestras y encuentros de la comunidad educativa.</p></div></article>
      </div>
    </section>

    <section class="section section-soft" id="novedades">
      <div class="wrap">
        <div class="section-heading reveal"><div><span class="section-label">04 / NOVEDADES Y COMUNICADOS</span><h2>Lo que la escuela comunica.</h2></div><span class="demo-tag">CONTENIDO DE DEMOSTRACIÓN</span></div>
        <div class="news-grid">
          <article class="news-card reveal"><span class="news-type">▣ COMUNICADOS</span><span class="demo-word">DEMOSTRACIÓN</span><h3>Acá se van a publicar los comunicados oficiales</h3><p>Este bloque queda preparado para publicar novedades verificadas de la institución.</p><a href="https://www.facebook.com/Ipet57" target="_blank" rel="noopener">Consultar canal oficial ↗</a></article>
          <article class="news-card reveal"><span class="news-type">▦ FECHAS IMPORTANTES</span><span class="demo-word">DEMOSTRACIÓN</span><h3>Calendario escolar y fechas clave</h3><p>Espacio reservado para el calendario escolar, fechas de examen y encuentros institucionales.</p><a href="#contacto">Ver datos de contacto ↗</a></article>
          <article class="news-card reveal"><span class="news-type">▤ INSCRIPCIONES</span><span class="demo-word">DEMOSTRACIÓN</span><h3>Información sobre inscripciones</h3><p>La sección está lista para publicar requisitos, fechas y el canal vigente de inscripción.</p><a href="#asistente">Preguntar al asistente ↗</a></article>
        </div>
        <p class="disclaimer">El contenido de demostración debe reemplazarse por comunicados oficiales. No se muestran fechas ni requisitos sin confirmar.</p>
      </div>
    </section>

    <section class="assistant-section" id="asistente">
      <div class="wrap assistant-layout">
        <div class="assistant-copy reveal"><span class="section-label">05 / ASISTENTE INSTITUCIONAL</span><h2>Una consulta rápida,<br>una respuesta clara.</h2><p>El asistente puede orientarte sobre especialidades, ubicación y canales de contacto. Para fechas o requisitos, confirmá siempre con la escuela.</p><ul><li>✓ Especialidades y orientaciones</li><li>✓ Ubicación y canales de contacto</li><li>✓ Inscripciones: información por confirmar</li></ul><div class="assistant-footnote">Las respuestas automáticas son orientativas y no reemplazan la comunicación oficial.</div></div>
        <div class="chat-window reveal">
          <div class="chat-header"><span class="online-dot"></span><div><b>Consultas frecuentes del IPET 57</b><small>Asistente institucional</small></div><span class="chat-status">● EN LÍNEA</span></div>
          <div class="chat-messages" id="chatMessages"><div class="message bot">¡Hola! Soy el asistente informativo del IPET 57. Puedo orientarte con datos públicos de la escuela y ayudarte a encontrar los canales oficiales.</div></div>
          <div class="quick-questions"><button data-question="¿Qué especialidades hay?">¿Qué especialidades hay?</button><button data-question="¿Dónde queda el IPET 57?">¿Dónde queda?</button><button data-question="¿Cómo me contacto?">¿Cómo me contacto?</button></div>
          <form id="chatForm" class="chat-form"><input id="chatInput" type="text" placeholder="Escribí tu consulta..." autocomplete="off" aria-label="Escribí tu consulta"><button aria-label="Enviar consulta" type="submit">↑</button></form>
          <small class="chat-disclaimer">Respuestas automáticas. Verificá los datos importantes con la institución.</small>
        </div>
      </div>
    </section>

    <section class="section wrap contact-section" id="contacto">
      <div class="section-heading reveal"><div><span class="section-label">06 / CONTACTO Y UBICACIÓN</span><h2>La técnica también se construye en comunidad.</h2></div><p>Consultá los canales institucionales y verificá horarios antes de acercarte.</p></div>
      <div class="contact-grid">
        <div class="contact-card reveal">
          <div class="contact-row"><span class="contact-icon">⌖</span><div><small>UBICACIÓN</small><b>25 de Mayo 1500, barrio General Paz</b><p>Córdoba, Argentina</p></div></div>
          <div class="contact-row"><span class="contact-icon">☎</span><div><small>TELÉFONO PUBLICADO EN FUENTES PÚBLICAS</small><b>+54 351 433-9170</b><p>Confirmá el número vigente antes de llamar.</p></div></div>
          <div class="contact-row"><span class="contact-icon">✉</span><div><small>CORREO PUBLICADO EN FUENTES PÚBLICAS</small><b>escuelapolitecnico10@hotmail.com</b><p>Canal de contacto institucional a verificar.</p></div></div>
          <div class="contact-row"><span class="contact-icon">◷</span><div><small>HORARIOS</small><b>Consultar con la institución</b><p>No se publica un horario sin confirmar.</p></div></div>
          <div class="official-links"><b>CANALES OFICIALES</b><div>
            <a href="https://www.facebook.com/Ipet57" target="_blank" rel="noopener">Facebook ↗</a>
            <a href="https://www.instagram.com/ipet_57" target="_blank" rel="noopener">Instagram ↗</a><!-- From Uiverse.io by Ratinax -->
<a><div class="radio-input">
  <input
    class="star s1"
    type="radio"
    id="value-1"
    name="value-radio"
    value="value-1"
  />
  <input
    class="star s2"
    type="radio"
    id="value-2"
    name="value-radio"
    value="value-2"
  />
  <input
    class="star s3"
    type="radio"
    id="value-3"
    name="value-radio"
    value="value-3"
  />
  <input
    class="star s4"
    type="radio"
    id="value-4"
    name="value-radio"
    value="value-4"
  />
  <input
    class="star s5"
    type="radio"
    id="value-5"
    name="value-radio"
    value="value-5"
  />
</div></a>
</div></div>
        </div>
        <div class="map-card reveal"><iframe title="Mapa de la zona del IPET 57" src="https://www.google.com/maps?q=25%20de%20Mayo%201500%2C%20C%C3%B3rdoba%2C%20Argentina&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><div class="map-footer"><span>⌖ Referencia: 25 de Mayo 1500, General Paz</span><a href="https://www.google.com/maps/search/?api=1&query=IPET+57+C%C3%B3rdoba" target="_blank" rel="noopener">Abrir en Google Maps ↗</a></div></div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="wrap footer-grid">
      <div><a class="brand footer-brand" href="#top"><img class="brand-logo" src="../public/ipet57-school-logo.jpg.jpeg" alt="Escudo del IPET 57"><span><b>IPET N.º 57</b><small>COMODORO MARTÍN RIVADAVIA</small></span></a><p>Escuela secundaria técnica de Córdoba. Este sitio es una maqueta independiente de demostración y debe validarse con la institución antes de publicarse como sitio oficial.</p></div>
      <div><h4>NAVEGACIÓN</h4><a href="#top">Inicio</a><a href="#institucion">Institución</a><a href="#especialidades">Especialidades</a><a href="#vida-escolar">Vida escolar</a><a href="#novedades">Novedades</a></div>
      <div><h4>CONTACTO</h4><p>⌖ 25 de Mayo 1500<br>Córdoba, Argentina</p><p>☎ +54 351 433-9170</p><p>✉ escuelapolitecnico10@hotmail.com</p><div class="socials"><a href="https://www.facebook.com/Ipet57" aria-label="Facebook">f</a><a href="https://www.instagram.com/ipet_57" aria-label="Instagram">◎</a></div></div>
    </div>
    <div class="wrap copyright"><span>© <span id="year"></span> IPET N.º 57 · Sitio de demostración</span><span>Información sujeta a confirmación institucional.</span></div>
  </footer>
  <button class="back-top" id="backTop" aria-label="Volver arriba">↑</button>


</template>

<style>
/* IPET 57 - estilos del sitio.
   Orden: variables > base > header > botones > hero > secciones > asistente > contacto > footer > responsive.
   Podés cambiar los colores desde :root. */

/* ===== VARIABLES ===== */
:root {
  --ink: #07111d;
  --navy: #06111f;
  --navy2: #0b1c2c;
  --green: #77bd83;
  --lime: #b8d96b;
  --yellow: #f6c400;
  --paper: #fffefa;
  --soft: #f5f6ef;
  --muted: #66717b;
  --line: #e7e9e1;
  --radius: 16px;
  --font: 'DM Sans',sans-serif;
  --display: 'Manrope',sans-serif;
}

/* ===== BASE ===== */
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 85px;
}
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font);
  line-height: 1.6;
}
img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
a {
  color: inherit;
  text-decoration: none;
}
button, input {
  font: inherit;
}
.top-line {
  height: 4px;
  background: linear-gradient(90deg,var(--green),var(--lime),var(--yellow));
}
.wrap {
  width: min(1160px,calc(100% - 48px));
  margin-inline: auto;
}

/* ===== HEADER Y NAVEGACIÓN ===== */
.site-header {
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 max(24px,calc((100vw - 1260px)/2));
  background: #fffefaed;
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid #e8e9e4;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 7px;
  object-fit: cover;
}
.brand b, .brand small {
  display: block;
  line-height: 1.25;
}
.brand b {
  font-family: var(--display);
  font-size: 14px;
  letter-spacing: .04em;
}
.brand small {
  font-size: 8px;
  letter-spacing: .08em;
  color: #69747b;
  margin-top: 4px;
}
.nav {
  display: flex;
  align-items: center;
  gap: 23px;
}
.nav a {
  font-size: 11px;
  color: #39434b;
  font-weight: 600;
  transition: color .2s;
}
.nav a:hover, .nav a.active {
  color: #6a9c4d;
}

/* ===== BOTONES ===== */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border-radius: 5px;
  padding: 12px 17px;
  font-size: 12px;
  font-weight: 700;
  transition: transform .2s,background .2s;
}
.button:hover {
  transform: translateY(-2px);
}
.button-yellow {
  background: var(--yellow);
  color: #171a17;
}
.header-cta {
  font-size: 10px;
  padding: 10px 15px;
}
.menu-toggle {
  display: none;
  border: 0;
  background: none;
  font-size: 25px;
}

/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 570px;
  background: #081624 url('https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=2000&q=90') center 46%/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
}
.hero:before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,#03101be8,#06111fbd 50%,#03101bc7),linear-gradient(0deg,#06111f99,transparent);
}
.hero-shade {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 40%,transparent 0%,#06111f30 70%);
}
.hero-content {
  position: relative;
  max-width: 750px;
  padding: 70px 24px 95px;
}
.eyebrow, .section-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .16em;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #d8e5d6;
}
.eyebrow i {
  width: 6px;
  height: 6px;
  background: var(--yellow);
  border-radius: 50%;
}
.crest {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  padding: 4px;
  margin: 26px auto 15px;
  border: 1px solid #b8d96b;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}
.crest img {
  border-radius: 7px;
}
.hero-kicker {
  font-size: 9px;
  letter-spacing: .2em;
  color: #d0d9df;
}
.hero h1 {
  font-family: var(--display);
  font-size: clamp(38px,5.2vw,66px);
  letter-spacing: -.055em;
  line-height: 1.12;
  margin: 14px 0;
}
.hero h1 span {
  color: var(--lime);
}
.hero-description {
  max-width: 540px;
  margin: 17px auto 25px;
  font-size: 13px;
  color: #d2dbe0;
}
.hero-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.button-light {
  background: #fff;
  color: #101b25;
}
.button-outline {
  border: 1px solid #ffffff73;
  color: #fff;
  background: #ffffff08;
}
.image-note {
  font-size: 8px;
  letter-spacing: .15em;
  color: #a7b5be;
  margin-top: 28px;
}

/* ===== DATOS RÁPIDOS ===== */
.stats {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  position: relative;
  margin-top: -42px;
  z-index: 2;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 9px;
  box-shadow: 0 14px 38px #14202a0a;
}
.stats article {
  padding: 20px 22px;
  border-right: 1px solid var(--line);
}
.stats article:last-child {
  border: 0;
}
.stats b, .stats span {
  display: block;
}
.stats b {
  font-family: var(--display);
  font-size: 17px;
}
.stats span {
  font-size: 10px;
  color: var(--muted);
  margin-top: 4px;
}

/* ===== SECCIONES: INSTITUCIÓN ===== */
.section {
  padding-top: 105px;
  padding-bottom: 105px;
}
.institution {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 72px;
}
.photo-panel {
  position: relative;
  min-height: 430px;
}
.photo-panel>img {
  height: 430px;
  border-radius: 5px;
}
.photo-caption {
  position: absolute;
  right: -15px;
  bottom: 20px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  max-width: 290px;
  padding: 16px;
  background: white;
  box-shadow: 0 10px 35px #101a2018;
  border: 1px solid var(--line);
  border-radius: 7px;
}
.caption-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #e6f6e8;
  color: #2c914c;
  flex-shrink: 0;
}
.photo-caption b, .photo-caption small {
  display: block;
}
.photo-caption b {
  font-size: 11px;
}
.photo-caption small {
  font-size: 10px;
  color: var(--muted);
  margin-top: 3px;
}
.section-label {
  color: #6d9c60;
}
.section-copy h2, .section-heading h2, .assistant-copy h2 {
  font-family: var(--display);
  font-size: clamp(27px,3vw,39px);
  letter-spacing: -.045em;
  line-height: 1.2;
  margin: 13px 0 18px;
}
.section-copy>p {
  font-size: 13px;
  color: #58636b;
}
.value-list {
  display: grid;
  gap: 18px;
  margin-top: 28px;
}
.value-list>div {
  display: flex;
  gap: 13px;
}
.value-list>div>span {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: #57865a;
  flex-shrink: 0;
}
.value-list p {
  margin: 0;
}
.value-list b, .value-list small {
  display: block;
}
.value-list b {
  font-size: 12px;
}
.value-list small {
  font-size: 11px;
  color: var(--muted);
  margin-top: 3px;
}

/* ===== ESPECIALIDADES ===== */
.section-soft {
  background: var(--soft);
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 35px;
}
.section-heading h2 {
  max-width: 570px;
  margin-bottom: 0;
}
.section-heading>p {
  max-width: 340px;
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}
.specialty-grid {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 15px;
}
.specialty-card {
  border: 1px solid #e8e9e1;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform .3s,box-shadow .3s;
}
.specialty-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 35px #15251c12;
}
.card-image {
  height: 160px;
  position: relative;
  background: #d8e0d8;
}
.card-image span {
  position: absolute;
  right: 10px;
  top: 10px;
  background: #ffffffeb;
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 10px;
  font-weight: 800;
}
.card-body {
  padding: 17px;
}
.mini-label {
  font-size: 8px;
  letter-spacing: .11em;
  color: #688d58;
  font-weight: 800;
}
.card-body h3 {
  font-family: var(--display);
  font-size: 19px;
  margin: 5px 0;
}
.card-body p {
  font-size: 11px;
  color: var(--muted);
  min-height: 70px;
}
.card-body a, .news-card a {
  font-size: 10px;
  font-weight: 800;
}
.card-body a:hover, .news-card a:hover {
  color: #638e4f;
}
.notice {
  display: flex;
  gap: 14px;
  margin-top: 22px;
  background: #fff9df;
  border: 1px solid #f2dc7c;
  border-radius: 7px;
  padding: 16px 18px;
}
.notice>span {
  color: #b88b00;
  font-size: 19px;
}
.notice p {
  margin: 0;
}
.notice b, .notice small {
  display: block;
}
.notice b {
  font-size: 11px;
}
.notice small {
  font-size: 10px;
  color: #786d45;
  margin-top: 4px;
}

/* ===== VIDA ESCOLAR ===== */
/* Grilla de 12 columnas: arriba 7+5, abajo 5+7 (como en la referencia) */
.life-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 365px 255px;
  gap: 15px;
}
.life-card {
  position: relative;
  grid-column: span 5;
  overflow: hidden;
  border-radius: 8px;
  background: #0a1928;
  color: white;
}
.life-card:nth-child(1),
.life-card:nth-child(4) {
  grid-column: span 7;
}
.life-card img {
  position: absolute;
  inset: 0;
  transition: transform .6s;
}
.life-card:hover img {
  transform: scale(1.04);
}
.life-card:after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg,#06111ff0 0%,#06111f99 32%,transparent 68%);
}
.life-card>div {
  position: absolute;
  z-index: 1;
  left: 22px;
  right: 22px;
  bottom: 22px;
}
.photo-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 4px;
  background: var(--yellow);
  color: #1a1a14;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: .12em;
}
.life-card h3 {
  font-family: var(--display);
  font-size: 22px;
  letter-spacing: -.03em;
  margin: 12px 0 6px;
}
.life-card p {
  font-size: 12px;
  color: #d6dce0;
  margin: 0;
}

/* ===== NOVEDADES ===== */
.demo-tag, .demo-word {
  font-size: 8px;
  letter-spacing: .1em;
  font-weight: 800;
  color: #88731d;
  background: #fff4bf;
  padding: 7px 9px;
  border-radius: 4px;
}
.news-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 16px;
}
.news-card {
  position: relative;
  border: 1px solid #e4e6de;
  background: #fff;
  border-radius: 7px;
  padding: 21px;
  min-height: 230px;
}
.news-type {
  font-size: 8px;
  color: #588653;
  font-weight: 800;
  letter-spacing: .08em;
}
.demo-word {
  float: right;
  background: #f5f1dc;
  font-size: 7px;
}
.news-card h3 {
  font-family: var(--display);
  font-size: 17px;
  line-height: 1.35;
  margin: 24px 0 10px;
}
.news-card p {
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 20px;
}
.disclaimer {
  font-size: 10px;
  color: #8a8170;
}

/* ===== ASISTENTE (CHAT) ===== */
.assistant-section {
  background: var(--navy);
  color: white;
  padding: 100px 0;
}
.assistant-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 70px;
}
.assistant-copy h2 {
  font-size: clamp(30px,3.3vw,43px);
}
.assistant-copy>p {
  color: #b5c0c8;
  font-size: 13px;
  max-width: 460px;
}
.assistant-copy ul {
  padding: 0;
  list-style: none;
  margin: 25px 0;
}
.assistant-copy li {
  font-size: 12px;
  margin: 10px 0;
  color: #e0e7e8;
}
.assistant-copy li::first-letter {
  color: var(--lime);
}
.assistant-footnote {
  font-size: 10px;
  color: #a8b6bf;
  border: 1px solid #ffffff20;
  border-radius: 6px;
  padding: 14px;
  max-width: 430px;
}
.chat-window {
  background: #fff;
  color: var(--ink);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 25px 65px #0004;
}
.chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 17px 19px;
  border-bottom: 1px solid var(--line);
}
.online-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #61b66e;
}
.chat-header b, .chat-header small {
  display: block;
}
.chat-header b {
  font-size: 11px;
}
.chat-header small {
  font-size: 9px;
  color: var(--muted);
}
.chat-status {
  margin-left: auto;
  font-size: 8px;
  color: #33874c;
  background: #e7f7e9;
  padding: 5px 7px;
  border-radius: 20px;
}
.chat-messages {
  padding: 20px;
  min-height: 170px;
  max-height: 260px;
  overflow: auto;
  background: #fbfcf9;
}
.message {
  max-width: 92%;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 11px;
  margin-bottom: 10px;
  white-space: pre-line;
}
.message.bot {
  background: #eef3eb;
  border: 1px solid #e0e8dc;
}
.message.user {
  margin-left: auto;
  background: #0b1c2c;
  color: white;
}
.quick-questions {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  padding: 0 16px 13px;
}
.quick-questions button {
  border: 1px solid #e2e6dd;
  background: #fff;
  border-radius: 18px;
  padding: 7px 9px;
  font-size: 9px;
  cursor: pointer;
}
.quick-questions button:hover {
  border-color: #7cad6b;
}
.chat-form {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--line);
}
.chat-form input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  font-size: 11px;
}
.chat-form button {
  width: 33px;
  height: 33px;
  border: 0;
  border-radius: 7px;
  background: var(--yellow);
  font-weight: 800;
  cursor: pointer;
}
.chat-disclaimer {
  display: block;
  padding: 0 16px 14px;
  font-size: 9px;
  color: #858c8b;
}

/* ===== CONTACTO Y MAPA ===== */
.contact-section {
  padding-top: 90px;
  padding-bottom: 100px;
}
.contact-grid {
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 18px;
}
.contact-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 23px;
}
.contact-row {
  display: flex;
  gap: 13px;
  padding: 13px 0;
  border-bottom: 1px solid var(--line);
}
.contact-icon {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  background: #edf5e9;
  color: #53834b;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.contact-row small, .contact-row b, .contact-row p {
  display: block;
}
.contact-row small {
  font-size: 8px;
  color: #6b9460;
  letter-spacing: .08em;
  font-weight: 800;
}
.contact-row b {
  font-size: 11px;
  margin-top: 3px;
  overflow-wrap: anywhere;
}
.contact-row p {
  font-size: 10px;
  color: var(--muted);
  margin: 2px 0;
}
.official-links {
  padding-top: 18px;
}
.official-links>b {
  font-size: 9px;
  letter-spacing: .1em;
}
.official-links>div {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
}
.official-links a {
  font-size: 9px;
  padding: 7px 9px;
  border: 1px solid var(--line);
  border-radius: 5px;
}
.official-links a:hover {
  background: var(--soft);
}
.map-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 420px;
}
.map-card iframe {
  width: 100%;
  flex: 1;
  min-height: 350px;
  border: 0;
}
.map-footer {
  padding: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 9px;
  color: var(--muted);
}
.map-footer a {
  background: var(--navy);
  color: white;
  padding: 8px 10px;
  border-radius: 4px;
  white-space: nowrap;
}

/* ===== FOOTER ===== */
.footer {
  background: #040c15;
  color: #dbe2e5;
  padding: 55px 0 20px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr .7fr 1fr;
  gap: 70px;
}
.footer-brand {
  color: white;
}
.footer-brand small {
  color: #8c9aa2;
}
.footer-grid>div:first-child>p {
  font-size: 10px;
  color: #9daab1;
  max-width: 330px;
  margin-top: 20px;
}
.footer h4 {
  font-size: 9px;
  color: var(--yellow);
  letter-spacing: .13em;
  margin: 0 0 15px;
}
.footer-grid>div>a:not(.brand) {
  display: block;
  font-size: 10px;
  color: #c4cdd2;
  margin: 8px 0;
}
.footer-grid p {
  font-size: 10px;
  color: #c4cdd2;
}
.socials {
  display: flex;
  gap: 8px;
}
.socials a {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border: 1px solid #ffffff30;
  border-radius: 50%;
  font-size: 12px;
}
.copyright {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 38px;
  padding-top: 17px;
  border-top: 1px solid #ffffff1b;
  color: #8b989f;
  font-size: 9px;
}

/* ===== BOTÓN VOLVER ARRIBA Y ANIMACIONES ===== */
.back-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 39px;
  height: 39px;
  border: 0;
  border-radius: 7px;
  background: var(--yellow);
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition: .25s;
  z-index: 10;
}
.back-top.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.reveal {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity .7s ease,transform .7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.specialty-card:nth-child(2), .news-card:nth-child(2) {
  transition-delay: .08s;
}
.specialty-card:nth-child(3), .news-card:nth-child(3) {
  transition-delay: .16s;
}
.specialty-card:nth-child(4) {
  transition-delay: .24s;
}
/* From Uiverse.io by Ratinax */
.radio-input {
  display: flex;
  scale: 0.15;
  transform: rotate(180deg);
}

.star {
  margin: 1em;
  appearance: none;
  --color: rgb(83, 83, 83);
  border-left: 6.4721359549996em solid transparent;
  border-right: 6.4721359549996em solid transparent;
  border-bottom: 4em solid var(--color);
  transform: rotate(0deg);
  cursor: pointer;
}

.star:before {
  content: "";
  border-left: 6.4721359549996em solid transparent;
  border-right: 6.4721359549996em solid transparent;
  border-top: 4em solid var(--color);
  position: absolute;
  left: -6.4721359549996em;
  transform: rotate(108deg);
}

.star:after {
  content: "";
  border-left: 6.4721359549996em solid transparent;
  border-right: 6.4721359549996em solid transparent;
  border-top: 4em solid var(--color);
  position: absolute;
  left: -6.4721359549996em;
  transform: rotate(253deg);
}

.radio-input > .star:hover ~ .star,
.radio-input > .star:hover,
.radio-input > .star:checked ~ .star,
.radio-input > .star:checked {
  --color: rgb(0, 68, 146);
}

.radio-input > .star:checked ~ .star,
.radio-input > .star:checked {
  animation: grow 0.5s linear forwards;
  transition: transform 0.3s;
}

@keyframes grow {
  50% {
    scale: 2;
  }
}

/* ===== RESPONSIVE ===== */
@media(max-width:1000px) {
  .nav {
    gap: 13px;
  }
  .nav a {
    font-size: 10px;
  }
  .site-header {
    padding-inline: 20px;
  }
  .header-cta {
    display: none;
  }
  .institution {
    gap: 38px;
  }
  .specialty-grid {
    grid-template-columns: repeat(2,1fr);
  }
  .card-image {
    height: 190px;
  }
  .card-body p {
    min-height: unset;
  }
  .assistant-layout {
    gap: 35px;
  }
  .footer-grid {
    gap: 35px;
  }
}
@media(max-width:760px) {
  .wrap {
    width: min(100% - 32px,560px);
  }
  .site-header {
    height: 66px;
    padding: 0 16px;
  }
  .menu-toggle {
    display: block;
    margin-left: auto;
  }
  .nav {
    position: absolute;
    display: none;
    left: 0;
    right: 0;
    top: 66px;
    padding: 12px 20px 20px;
    background: #fffefa;
    box-shadow: 0 18px 20px #0000000c;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    border-bottom: 1px solid var(--line);
  }
  .nav.open {
    display: flex;
  }
  .nav a {
    padding: 12px 0;
    border-bottom: 1px solid var(--line);
    font-size: 12px;
  }
  .hero {
    min-height: 580px;
  }
  .hero-content {
    padding: 55px 20px 75px;
  }
  .hero h1 {
    font-size: clamp(38px,10vw,55px);
  }
  .hero-description {
    font-size: 12px;
  }
  .stats {
    grid-template-columns: 1fr 1fr;
    margin-top: -25px;
  }
  .stats article {
    padding: 15px;
    border-bottom: 1px solid var(--line);
  }
  .stats article:nth-child(2) {
    border-right: 0;
  }
  .stats article:nth-child(3), .stats article:nth-child(4) {
    border-bottom: 0;
  }
  .stats b {
    font-size: 15px;
  }
  .section {
    padding-top: 70px;
    padding-bottom: 70px;
  }
  .institution {
    grid-template-columns: 1fr;
    gap: 45px;
  }
  .photo-panel, .photo-panel>img {
    min-height: 300px;
    height: 300px;
  }
  .photo-caption {
    right: 8px;
    bottom: -20px;
    max-width: 260px;
  }
  .section-copy h2, .section-heading h2 {
    font-size: 30px;
  }
  .section-heading {
    display: block;
  }
  .section-heading>p {
    margin-top: 15px;
  }
  .specialty-grid {
    gap: 10px;
  }
  .card-image {
    height: 130px;
  }
  .card-body {
    padding: 13px;
  }
  .card-body h3 {
    font-size: 16px;
  }
  .card-body p {
    font-size: 10px;
  }
  .life-grid {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    grid-auto-rows: 250px;
  }
  .life-card,
  .life-card:nth-child(1),
  .life-card:nth-child(4) {
    grid-column: auto;
  }
  .news-grid {
    grid-template-columns: 1fr;
  }
  .news-card {
    min-height: unset;
  }
  .assistant-section {
    padding: 70px 0;
  }
  .assistant-layout {
    grid-template-columns: 1fr;
    gap: 35px;
  }
  .assistant-copy h2 {
    font-size: 34px;
  }
  .contact-grid {
    grid-template-columns: 1fr;
  }
  .map-card {
    min-height: 350px;
  }
  .map-card iframe {
    min-height: 300px;
  }
  .map-footer {
    align-items: flex-start;
    flex-direction: column;
  }
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .footer-grid>div:first-child {
    grid-column: 1/-1;
  }
  .copyright {
    flex-direction: column;
    gap: 6px;
  }
}
@media(max-width:390px) {
  .brand small {
    font-size: 7px;
  }
  .specialty-grid {
    grid-template-columns: 1fr;
  }
  .card-image {
    height: 180px;
  }
  .hero-actions .button {
    padding: 11px 12px;
    font-size: 10px;
  }
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer-grid>div:first-child {
    grid-column: auto;
  }
}
@media(prefers-reduced-motion:reduce) {
  html {
    scroll-behavior: auto;
  }
  *, *::before, *::after {
    animation-duration: .01ms!important;
    transition-duration: .01ms!important;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
}
</style>


