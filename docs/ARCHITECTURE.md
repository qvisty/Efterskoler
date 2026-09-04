# Architecture

## Status

**Technology status:** DECIDED

- Backend: ingen
- Frontend: statisk HTML, CSS og vanilla JavaScript med Leaflet 1.9.4
- Database: ingen, data ligger i en statisk JS fil
- Authentication: ingen
- Hosting: statisk hosting, GitHub Pages er den oplagte kandidat
- Background jobs: ingen
- Realtime: ingen

## Teknologivurdering

### Kandidat A: Statisk site med Leaflet

Fordele:

- ingen server, ingen drift, ingen sikkerhedsflade
- kan åbnes direkte fra filsystemet og hostes gratis på GitHub Pages
- Leaflet er de facto standard til letvægts webkort og kræver ingen API nøgle sammen med OpenStreetMap
- datasættet er lille og statisk, ca. 20 skoler

Ulemper:

- fase 2 med kørselsafstande kræver enten en engangsberegning der gemmes som statisk fil, eller en ekstern routing service

### Kandidat B: Django med kort frontend

Fordele:

- passer til projektejerens præferencer ved klassiske webapps

Ulemper:

- der er ingen brugere, formularer, roller eller CRUD, så hele frameworket er dødvægt
- kræver drift og deployment af en server for noget et statisk site kan

### Kandidat C: React eller anden SPA framework

Fordele:

- komponentmodel hvis UI vokser

Ulemper:

- build tooling og dependencies for en side med ét kort og én liste er overengineering

## Valgt løsning

**Stack:** Statisk site med Leaflet og vanilla JavaScript.

**Begrundelse:**

Produktet er et kommunikationsværktøj med et lille, statisk datasæt og ingen brugere eller skrivninger. Den simpleste robuste løsning er en statisk side. Django og SPA frameworks blev fravalgt fordi de ikke løser noget konkret problem her. Det er samtidig en reversibel beslutning, datasættet i `data/schools.js` kan genbruges direkte hvis behovet ændrer sig.

Leaflet er vendoret ind i `vendor/leaflet/` i stedet for at blive hentet fra CDN, så siden virker uden eksterne afhængigheder ud over korttiles fra OpenStreetMap.

## Udviklingsmiljø

Native, ingen Docker, ingen build steps.

- åbn `index.html` direkte i en browser, eller
- kør `python3 -m http.server` i projektroden

## Systemoversigt

```text
Browser
   ├── index.html          side, styling, togglepanel og legend
   ├── js/app.js           kortopsætning, toggle logik og afstandslag
   ├── data/schools.js     datasæt over ordblindeefterskoler
   ├── data/grid.js        gitterpunkter over Danmarks landareal, genereret
   ├── vendor/leaflet/     Leaflet 1.9.4, vendoret
   └── OpenStreetMap       korttiles, eneste eksterne afhængighed

scripts/generate_grid.mjs  regenererer data/grid.js fra Natural Earth data
```

Afstandslaget tegner en canvas rektangel pr. gitterpunkt, farvet efter
luftlinjeafstand til nærmeste synlige skole, og genberegner ved hver toggle.

## Domæner og komponenter

| Komponent | Ansvar | Afhængigheder |
|---|---|---|
| `data/schools.js` | Datasæt, én record pr. skole | ingen |
| `js/app.js` | Rendering af markører, panel og toggles | Leaflet, datasæt |
| `index.html` | Layout og styling | ovenstående |

## Integrationer

- OpenStreetMap tile server, `tile.openstreetmap.org`. Gratis, ingen nøgle, kræver korrekt attribution, som er med i kortet. Ved fejl vises Leaflets grå baggrund, markørerne virker stadig.

## Fase 2, afstandsanalyse

Første del er leveret som luftlinjelag beregnet i browseren. Opgradering til reel kørselstid sker som en engangsberegning af rejsetid fra alle gitterpunkter til alle skoler, gemt som statisk fil, så arkitekturen forbliver uden server. Se Task 006 i `docs/TASKS.md`.

## Deployment

- Platform: GitHub Pages, endnu ikke sat op
- Build: ingen, filerne serveres som de er
- Secrets: ingen

## Arkitekturbeslutninger

### ADR 001: Statisk site uden backend og database

**Status:** Accepted

**Kontekst:** Der skal vises ca. 20 statiske datapunkter på et kort. Ingen brugere, ingen skrivninger.

**Alternativer:** Django app, SPA framework, statisk site.

**Valg:** Statisk site med Leaflet, data i en statisk JS fil, Leaflet vendoret.

**Begrundelse:** Simplest mulige robuste løsning, jf. CLAUDE.md principperne. SQLite blev end ikke nødvendig, se `docs/DATABASE.md`.

**Konsekvenser:** Ingen drift. Fase 2 skal løses med precomputed statiske data eller en ekstern service.
