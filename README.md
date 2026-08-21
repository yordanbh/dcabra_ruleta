# Ruleta Online D'Cabra

Aplicación web interactiva para realizar sorteos aleatorios a partir de listas de participantes cargadas desde Excel, CSV, TSV o TXT. Incluye una presentación animada, ruleta en canvas, historial de ganadores, persistencia local y una pantalla especial para anunciar cada resultado.

## Funcionalidades

- Carga de participantes mediante el selector de archivos o arrastrando el archivo sobre el mismo botón.
- Compatibilidad con archivos `.xlsx`, `.xls`, `.xlsm`, `.csv`, `.tsv` y `.txt`.
- Eliminación automática de nombres vacíos y duplicados.
- Selección del ganador entre la lista completa de participantes.
- Visualización de un máximo de 10 nombres en la ruleta para conservar la legibilidad.
- Inclusión garantizada del ganador dentro de la selección visible durante el giro.
- Eliminación automática del ganador de la lista disponible.
- Historial de ganadores con número de selección, fecha y hora.
- Persistencia de participantes y ganadores mediante `localStorage`.
- Presentación de bienvenida animada con GSAP y ScrollTrigger.
- Botón para volver a reproducir la bienvenida.
- Animación de giro con GSAP y renderizado de la ruleta mediante Canvas.
- Pantalla del ganador con View Transitions y confeti.
- Diseño responsive y adaptado a dispositivos móviles.
- Notificaciones visuales mediante Sileo.

## Tecnologías

- React 19
- Vite 8
- Tailwind CSS 4
- GSAP y `@gsap/react`
- Canvas API
- Canvas Confetti
- SheetJS para archivos Excel
- Sileo para notificaciones
- Lucide React para iconos
- View Transitions API con fallback para navegadores no compatibles

## Requisitos

- Node.js 20 o superior
- npm o pnpm

## Instalación

```bash
pnpm install
pnpm dev
```

También se puede usar npm:

```bash
npm install
npm run dev
```

La aplicación estará disponible normalmente en `http://localhost:5173`.

## Scripts

```bash
pnpm dev       # Inicia el servidor de desarrollo
pnpm build     # Genera la versión de producción
pnpm preview   # Previsualiza la compilación
pnpm lint      # Ejecuta oxlint
```

Antes de publicar:

```bash
pnpm lint
pnpm build
pnpm preview
```

## Formatos de participantes

### Excel

Se procesa la primera hoja del libro. Se recomienda incluir una columna con uno de estos encabezados:

- `Nombre`
- `Participante`
- `Nombres`
- `Nombre completo`

Ejemplo:

| N° | DNI | Nombre | Correo |
| ---: | --- | --- | --- |
| 1 | 70123456 | Andrea Torres | andrea@example.com |
| 2 | 70987654 | Miguel Flores | miguel@example.com |

Si no existe un encabezado reconocido, la aplicación puede usar la primera columna con información válida, según la implementación de `src/utils/participants.js`.

### CSV o TSV

```csv
Nombre,Correo
Andrea Torres,andrea@example.com
Miguel Flores,miguel@example.com
```

### TXT

Un participante por línea:

```text
Andrea Torres
Miguel Flores
Lucía Herrera
```

## Funcionamiento del sorteo

1. El usuario carga una lista de participantes.
2. La aplicación limpia los nombres y elimina duplicados.
3. Si existen más de 10 participantes, se elige una muestra visual de 10 nombres.
4. El ganador se selecciona aleatoriamente desde la lista completa, no únicamente desde los nombres visibles.
5. El ganador se incorpora a la muestra visual y la ruleta calcula el ángulo de destino.
6. Al terminar el giro, el ganador se guarda en el historial y se elimina de los participantes disponibles.
7. Al pulsar **Continuar sorteo**, se regresa a la ruleta conservando los participantes restantes.
8. El botón **Reiniciar dinámica** es la única acción que elimina participantes, ganadores y estado almacenado.

Por ejemplo, si se cargan 50 participantes y se obtiene un ganador, al volver a la ruleta quedarán 49 participantes disponibles.

## Configuración

La configuración principal se encuentra en `src/config/raffleConfig.js`:

```js
const raffleConfig = {
  title: "Gran Sorteo D'Cabra",
  subtitle: "Descubre a nuestros ganadores",
  welcomeTitle: "Bienvenidos al Gran Sorteo D'Cabra",
  prizeName: "Premio Especial D'Cabra",
  prizeDescription: "Kit de productos artesanales",
  logo: "/assets/logo.jpg",
  prizeImage: "/assets/premio.jpg",
  leftBanner: "/assets/banner-left.jpg",
  rightBanner: "/assets/banner-right.jpg",
  spinDurationMs: 6000,
  minSpins: 5,
  maxSpins: 7,
};
```

Los colores se administran desde `src/config/theme.js` y las clases personalizadas de Tailwind desde `src/index.css`.

## Recursos gráficos

Coloca los archivos en `public/assets/`:

```text
public/assets/
├── logo.jpg
├── premio.jpg
├── banner-left.jpg
├── banner-right.jpg
└── og-ruleta-dcabra.jpg
```

Para compartir la página en redes sociales, `og-ruleta-dcabra.jpg` debe medir preferentemente `1200 × 630 px`.

## Persistencia

La información se almacena en el navegador mediante estas claves:

- `dcabra_participants`
- `dcabra_winners`
- `dcabra_raffle_state`
- `dcabra_welcome_seen`

Los datos no se envían a un servidor. Si se limpia el almacenamiento del navegador o se usa otro dispositivo, el estado no estará disponible.

## Estructura principal

```text
src/
├── components/
│   ├── ConfirmResetModal.jsx
│   ├── DrawButton.jsx
│   ├── Header.jsx
│   ├── ParticipantCounter.jsx
│   ├── ParticipantList.jsx
│   ├── ParticipantLoader.jsx
│   ├── Roulette.jsx
│   ├── RouletteStage.jsx
│   ├── SideBanner.jsx
│   ├── WelcomeExperience.jsx
│   ├── WinnerPage.jsx
│   └── WinnersModal.jsx
├── config/
│   ├── raffleConfig.js
│   └── theme.js
├── data/
│   └── demoParticipants.js
├── hooks/
│   └── useDraw.js
├── utils/
│   ├── participants.js
│   ├── roulette.js
│   ├── storage.js
│   └── viewTransition.js
├── App.jsx
├── index.css
└── main.jsx
```

## Archivos que ya no se necesitan

- `src/components/DemoDataButton.jsx`: su función está incluida en `ParticipantLoader.jsx`.
- `src/components/WinnerAnnouncement.jsx`: fue reemplazado por `WinnerPage.jsx`.
- `src/components/PrizeCard.jsx`: puede eliminarse si el premio ya no se muestra en la pantalla principal.
- `src/components/WinnersList.jsx`: puede eliminarse si el historial se muestra únicamente mediante `WinnersModal.jsx`.

Antes de eliminar los dos últimos, comprueba que no tengan imports activos con:

```bash
rg "PrizeCard|WinnersList" src
```

## SEO y publicación

1. Sustituye `https://TU-DOMINIO.com` en `index.html`, `public/robots.txt` y `public/sitemap.xml` por la URL pública real.
2. Crea `public/assets/og-ruleta-dcabra.jpg` en formato `1200 × 630 px`.
3. Ejecuta `pnpm build` y publica el contenido generado en `dist/`.
4. Verifica que la página responda con HTTPS y estado HTTP 200.
5. Registra el dominio en Google Search Console.
6. Envía `https://TU-DOMINIO.com/sitemap.xml` desde Search Console.
7. Usa la inspección de URL para solicitar la indexación de la página principal.
8. Comprueba el JSON-LD con la herramienta de resultados enriquecidos de Google.
9. Revisa rendimiento, accesibilidad y SEO con Lighthouse.

Los metadatos ayudan a que Google entienda la aplicación, pero no garantizan una posición específica. Para competir por búsquedas amplias como “ruleta online” también se necesita contenido útil indexable, rendimiento, menciones y enlaces externos, antigüedad y autoridad del dominio.

## Consideración sobre aleatoriedad

La selección utiliza aleatoriedad en el navegador. Es adecuada para dinámicas promocionales y recreativas. Para concursos regulados, auditados o con premios de alto valor se recomienda seleccionar y registrar el resultado desde un backend seguro.

## Licencia

Proyecto privado desarrollado para D'Cabra. No se autoriza su redistribución sin permiso del propietario.
