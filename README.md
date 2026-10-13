# COSMOS — Planetary Field Guide

**An interactive 3D solar-system experience developed by DevHon.**

COSMOS combines a cinematic scroll-driven journey through the solar system with a planet atlas, moon viewer, planetary comparisons, and an interactive Exploration Lab. Designed for desktop and mobile.

> **Independent educational project:** COSMOS is not affiliated with, sponsored by, or endorsed by NASA. Some textures, atmospheric effects, orbital simulations, and extraterrestrial landscapes are artistic or approximate. See [Asset Credits](ASSET_CREDITS.md).

## Run locally in VS Code

**Requirements:** Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173/`). Open this folder directly in VS Code; it must contain `package.json`. Do **not** open `index.html` via VS Code Live Server.

To validate the production output:

```bash
npm run build
npm run preview
```

The build output is `dist/` and is intentionally not committed to Git.

## Deploy on Vercel

1. Push this project to your GitHub repository.
2. In Vercel, **Add New → Project** and import the GitHub repository.
3. Use **Vite** as the framework preset, **`npm run build`** as the build command, and **`dist`** as the output directory.
4. Use the repository root as the root directory and deploy.

No backend or environment variables are needed for the included version. If you add APIs later, keep their secret keys on the server—not in public frontend code.

## Included experiences

- Planet-by-planet scroll journey: Earth → Mars → Jupiter → Saturn → Uranus → Neptune. Mercury and Venus remain available from the atlas.
- 3D planet viewing and inspection, scientific dossiers, and responsive mobile interaction.
- Planet Size Comparison, Orbital Navigator, Moon Explorer, Sound Studio.
- Planetary Hotspots, Day & Night Simulator, Guided Spacecraft Tour, and Surface Map Explorer.
- Planet Interior Explorer, Solar System Time Machine, Space Mission Explorer, Eclipse Simulator, Gravity Lab, Photo Mode, Exoplanet Explorer, and Exploration Passport.

Surface Landing, NASA Photo Comparison, Rover Traverse, Geological Samples, and Planetary Weather were intentionally removed from this edition.

## Directory structure

```text
.
├── index.html           # Vite entry
├── package.json         # npm scripts and dependencies
├── tsconfig.json
├── vite.config.ts
├── src/                 # React, Three.js, and application styles
├── public/
│   ├── assets/          # Required textures, backgrounds, and soundtrack
│   └── features/        # Exploration Lab scripts and styles
├── .gitignore           # Excludes node_modules, builds, and secrets
├── ASSET_CREDITS.md     # Media provenance and caveats
└── README.md
```

## Soundtrack and attribution

The project bundles `public/assets/audio/cosmos-ambient.mp3`, adapted from the provided COSMOS soundtrack. Sound is selected **On** by default, but browsers may require a click or tap before audible playback is permitted; visitors can mute it.

**Before publishing publicly**, confirm that you have permission to redistribute this soundtrack and the supplied media. Review [Asset Credits](ASSET_CREDITS.md), do not imply NASA endorsement, and do not commit credentials or `.env` secrets. Developer credit in the website footer does not transfer copyright in external assets.

**Developer:** DevHon. No open-source license is granted here for third-party imagery or music.

Background Music: AI-generated using Google Flow Music for the COSMOS project.
