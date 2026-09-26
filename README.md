# LevelUp Life

A zero-backend gamification app for the Nerdearla 2026 Webflow App Showcase.

## Core loop

**Check in → get adaptive micro-missions → complete one → earn XP + energy → level up.**

## Features

- Energy check-in from 1–100.
- Optional mood check-in.
- 3 adaptive micro-missions per mood.
- Explicit **Completar misión** buttons.
- XP + cumulative energy rewards.
- 11 life goals with 3-step progression.
- Optional Boss battles with 3 original inline SVG/vector bosses.
- Boss damage changes through 3 visual states as HP drops.
- Reading Boss can use the actual page count of the user's book.
- Daily streaks, achievements and roadmap.
- Local persistence with `localStorage`.
- Defensive numeric state normalization to prevent `NaN`.
- Responsive desktop/mobile UI.
- No backend, API keys or account required.

## Run

Serve the folder with any static server, for example:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Deploy

Push the repository to GitHub and deploy it with Webflow Cloud as a static app. `webflow.json` declares the static framework.

## Reset

Inside the app: **Ajustes → Reiniciar todo el progreso**.
