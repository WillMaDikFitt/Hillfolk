# Hillfolk

Interactive hillside homepage for **Hillfolk Inc.**

## Run locally

```bash
npm install
npm run dev
```

**Main site (vista):** `npm run dev` → `/`  
**2D hillside (legacy):** `npm run dev:hill` → `/hill.html`  
**3D town prototype:** `npm run dev:3d` → `/town3d.html`

## 3D prototype

Placeholder low-poly town built with React Three Fiber:

- Drag to orbit the hillside town
- Moving clouds, walkers, floating cards
- Click **About Us** → camera enters the studio interior
- Workers animate (typing / mouse clicks); About copy reveals in panels
- **Back to the hill** returns you outside

Other buildings show a “coming soon” toast — same pattern can be reused for Services, Café, Contact.

## Assets

Original art lives in the project root (`BACKGROUND.png`, `MIDGROUND.png`, `FOREGROUND.png`). Those files are never modified.

`npm`-served copies and building cutouts are generated into `public/layers/`:

```bash
python scripts/prepare_layers.py
```

## What’s here

- Hi-res parallax landscape (background / midground / foreground)
- Building cutouts for hover lift + enter transitions
- Immersive “step inside” rooms (not modal popups)
- Palette sampled from the illustration
- Parallel 3D town prototype (`src/town3d/`) ready for real GLB models later
