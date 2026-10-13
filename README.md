# COSMOS — Solar System Expedition

A cinematic, scroll-driven solar-system experience with an immersive mobile planet viewer and sixteen interactive Exploration Lab instruments.

## Run without installation

Open **`COSMOS_OFFLINE.html`** from the extracted `COSMOS-3D-Solar-System` folder in Chrome or Edge. Planet texture maps, feature scripts, and COSMOS soundtrack are embedded into that single HTML file. The browser may require user interaction before audible music starts.

## Editable developer version

Requires Node.js 20 or newer and an internet connection for the first dependency installation.

```bash
npm install
npm run dev
```

The project uses React, TypeScript, Vite, Three.js / React Three Fiber, GSAP, and standalone lab scripts under `public/features/`.

## Exploration Lab — sixteen tools

1. Planet size comparison
2. Orbital navigator
3. Moon explorer
4. Sound studio
5. Planetary hotspots
6. Day and night simulator
7. Guided spacecraft tour
8. Planet surface map explorer (global texture maps)
9. Planet interior explorer
10. Solar system time machine
11. Space mission explorer
12. Eclipse simulator
13. Gravity laboratory
14. Cinematic photo mode (PNG export)
15. Exoplanet explorer
16. Exploration passport (planets, moons, missions, discoveries)

## Removed in this edition

The separate Surface Landing panoramic viewer, NASA Photo Comparison, Rover Traverse, Geological Samples, and Planetary Weather Lab were intentionally removed, together with their unused code and assets. This **does not** remove the global Planet Surface Map Explorer or the Cinematic Photo Mode.

The Exploration Passport no longer contains a sample counter or a sample-collection shortcut. Existing planet, moon, mission, and discovery progress is retained in browser storage when possible; records belonging to retired modules are not displayed.

## Scientific accuracy

Models are educational simulations. Some planet textures originate from NASA/JPL resources; some artistic moon and atmospheric treatments are illustrative. Orbital position and travel effects are not real-time navigational data. See `ASSET_CREDITS.md`.

## Verification

The offline edition is intended to run directly in recent Chromium-based browsers. On machines where WebGL is unavailable, planet viewer fallback rendering is used. For complete GPU scene verification and a production build, run the project locally with hardware acceleration and dependencies installed.
