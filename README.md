# Ordblindeefterskoler i Danmark

Interaktivt kort over de 20 ordblindeefterskoler i Danmark.

**Se kortet her: https://qvisty.github.io/Efterskoler/**

Kortet viser alle skolerne som markører på et Danmarkskort. Hver skole kan slås til og fra i panelet, og Emmerske Efterskole ved Tønder er fremhævet. Formålet er at vise, hvor stort et geografisk hul der opstår for ordblinde unge i Sydvestdanmark, hvis Emmerske Efterskole lukker.

## Kør lokalt

Ingen build steps og ingen dependencies.

```bash
python3 -m http.server
```

Åbn derefter `http://localhost:8000`. `index.html` kan også åbnes direkte i en browser.

## Struktur

- `index.html`: layout, styling og togglepanel
- `js/app.js`: kortopsætning, markører og toggle logik
- `data/schools.js`: datasættet, én record pr. skole
- `vendor/leaflet/`: Leaflet 1.9.4, vendoret
- `docs/`: PRD, arkitektur, databasevalg, roadmap og tasks

## Deployment

GitHub Pages via `.github/workflows/pages.yml`. Hvert push til `main` deployer automatisk.

## Roadmap

Næste større fase er en farvelægning af Danmark efter kørselsafstand til nærmeste ordblindeefterskole, se `docs/ROADMAP.md`.

## Arbejdsmetode

Projektet er startet fra ai-project-starter templaten. Arbejdsmetoden står i `CLAUDE.md`, og `docs/` er projektets source of truth.
