# Ruleta D'Cabra — GSAP + View Transitions

Versión reorganizada para evitar el conflicto entre `ScrollTrigger`, el canvas y los transforms de GSAP.

## Ejecutar

```bash
pnpm install
pnpm dev
```

También puedes usar `npm install` y `npm run dev`.

## Imágenes

Copia tus imágenes actuales en `public/assets/`:

- `logo.jpg`
- `premio.jpg`
- `banner-left.jpg`
- `banner-right.jpg`

## Cambios principales

- La bienvenida usa `ScrollTrigger` en una sección propia de 300vh con una escena `sticky`.
- La ruleta ya no usa `ScrollTrigger.create({ pin: true })` ni `rotateZ`.
- La ruleta se mantiene estable con CSS `position: sticky`.
- Durante el sorteo, el mismo componente pasa a un overlay fijo y GSAP lo amplía suavemente.
- El resultado se presenta como una pantalla independiente con View Transitions y confeti.
- La bienvenida se muestra una vez por navegador mediante `localStorage`; el botón “Ver bienvenida” permite repetirla.
- Se corrigió el ángulo para que el segmento ganador termine realmente debajo del puntero de las 12.

## Archivos del proyecto anterior que puedes eliminar

- `src/components/DemoDataButton.jsx` (duplicaba el botón dentro de `ParticipantLoader`).
- `src/components/WinnerAnnouncement.jsx` (lo reemplaza `WinnerPage.jsx`).

## Archivos que debes reemplazar

- `src/App.jsx`
- `src/index.css`
- `src/components/Header.jsx`
- `src/components/Roulette.jsx`
- `src/components/DrawButton.jsx`
- `src/components/ConfirmResetModal.jsx`
- `src/components/ParticipantCounter.jsx`
- `src/components/ParticipantLoader.jsx`
- `src/components/ParticipantList.jsx`
- `src/components/PrizeCard.jsx`
- `src/components/SideBanner.jsx`
- `src/components/WinnersList.jsx`
- `src/hooks/useDraw.js`
- `src/utils/participants.js`
- `src/utils/roulette.js`
- `src/utils/storage.js`
- `src/config/raffleConfig.js`
- `src/config/theme.js`

## Archivos nuevos

- `src/components/WelcomeExperience.jsx`
- `src/components/RouletteStage.jsx`
- `src/components/WinnerPage.jsx`
- `src/utils/viewTransition.js`

No es necesario instalar React Router: la pantalla del ganador usa estado de React y la API nativa View Transitions. En navegadores que aún no soportan la API, funciona con un cambio inmediato sin romper la dinámica.
