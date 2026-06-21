# MusicSpot Frontend — Features

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6.3.5 |
| Estilos | TailwindCSS v4 + shadcn/ui (Radix UI) |
| Animaciones | Motion (motion/react) |
| Mapa | Leaflet 1.9 + react-leaflet 5 |
| Iconos | lucide-react |

---

## Navegación

- Navbar fija con logo **MusicSpot**, tabs de navegación y avatar de usuario.
- Tres vistas: **Inicio**, **Mapa**, **Eventos**.
- Tab activo con indicador de línea degradada violet → fuchsia.
- Navegación por estado React (sin router externo), lista para conectar con `react-router` cuando el backend requiera rutas protegidas.

---

## Inicio

- Hero con grilla animada de fondo y degradado radial violet/fuchsia.
- Título con animación de entrada escalonada via `motion`.
- Botones de CTA que navegan directamente a Mapa y Eventos.
- Sección de features con cards animadas al entrar en viewport (`whileInView`).
- Sección de estadísticas con contador degradado (250+ eventos, 80+ locales, 15K+ usuarios) — placeholder listo para datos reales del backend.

---

## Mapa

### Tiles y comportamiento
- Tiles oscuros de **CartoDB Dark** vía OpenStreetMap (sin API key requerida).
- `noWrap: true` — previene el scroll horizontal infinito del mapa.
- `maxBounds` + `maxBoundsViscosity: 1.0` — el mapa rebota al intentar salir de los límites del mundo.
- Zoom mínimo 3, máximo 19.

### Controles
- **Zoom +** y **Zoom −** funcionales via `useMap()` de react-leaflet.
- **Botón de brújula** — solicita GPS preciso con `enableHighAccuracy: true` y `maximumAge: 0`.

### Geolocalización en dos fases
1. **Fase IP (silenciosa):** al cargar, consulta `ipapi.co/json/` y vuela animado a la ciudad detectada (zoom 13, duración 1.5s). No pide permiso al usuario.
2. **Fase GPS (explícita):** muestra un modal centrado con backdrop difuminado preguntando si activar la ubicación exacta.
   - **Acepta:** el navegador pide permiso, el mapa vuela a las coordenadas GPS reales (zoom 16), coloca un marcador violeta pulsante.
   - **Rechaza / Ahora no:** cierra el modal, el mapa permanece en la ciudad por IP.
   - **Permiso denegado:** toast de error con instrucciones para activar en el navegador.

### Modal de ubicación
- Backdrop `bg-black/50 backdrop-blur-sm` sobre el mapa.
- Card centrada `max-w-md` con icono, ciudad detectada, dos botones y nota de privacidad.
- Clic fuera del modal lo cierra.
- Tres estados visuales: `visible` → `loading` (spinner) → `denied` (toast rojo).

### Marcadores
- `L.divIcon` personalizado por género con color único (Jazz: ámbar, Electrónica: cyan, Rock: rojo, Hip Hop: verde, Indie: violeta).
- Efecto ring + sombra al seleccionar un marcador.
- Popup nativo de Leaflet con nombre y género del local — estilizado en dark mode.
- Card de venue seleccionado como overlay animado (spring animation, cierre con botón X).

### Estado vacío
- Cuando no hay venues del backend, el mapa muestra solo los tiles sin marcadores.

---

## Eventos

- Header con título y descripción de sección.
- Dos secciones: **Eventos destacados** y **Próximos eventos**.
- Estado vacío en cada sección con icono y mensaje:
  > *"Ups, aún no hay eventos destacados por aquí — Puedes volver a revisar más tarde, actualizamos el contenido frecuentemente."*
- Estructura de cards lista para recibir datos del microservicio de eventos.

---

## Mapa — Sidebar

- Buscador en tiempo real por nombre de evento, banda o local.
- Filtros por género (Jazz, Rock, Electrónica, Hip Hop, Indie, Blues) como pills con toggle.
- Contador dinámico de resultados.
- Scroll con scrollbar personalizado (thin, dark).
- Estado vacío diferenciado:
  - **Sin datos del backend:** *"Ups, aún no hay nada por aquí..."*
  - **Sin resultados de búsqueda:** *"Sin resultados — Intenta con otros filtros o términos."*
- Responsive: sidebar fijo al 30% en desktop, drawer animado desde la izquierda en mobile.

---

## Sistema de diseño

- Modo oscuro forzado (`dark` class en el root).
- Variables CSS con tokens de color shadcn/ui (`--background`, `--foreground`, `--primary`, etc.).
- Fuente **Inter** vía Google Fonts.
- Scrollbar personalizado via CSS (`scrollbar-thin`).
- Popup de Leaflet adaptado al dark mode (fondo `#1A1A1A`, borde sutil).
- Keyframe `pulse` para el marcador de ubicación del usuario.

---

## Arquitectura lista para backend

| Punto de integración | Archivo | Qué conectar |
|---|---|---|
| Venues del mapa | `Map.tsx` → `const venues = []` | Microservicio de venues |
| Sidebar de venues | `Sidebar.tsx` → `const mockVenues = []` | Microservicio de venues |
| Eventos | `Events.tsx` → `const specialEvents = []` | Microservicio de eventos |
| Estadísticas del Home | `Home.tsx` → valores hardcoded | Microservicio de estadísticas |

El API Gateway puede inyectar los datos reemplazando los arrays vacíos por llamadas `fetch`/`axios` a los 3 microservicios correspondientes.
