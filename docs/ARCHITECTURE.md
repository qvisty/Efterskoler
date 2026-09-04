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
   ├── index.html          side, styling og togglepanel
   ├── js/app.js           kortopsætning og toggle logik
   ├── data/schools.js     datasæt over ordblindeefterskoler
   ├── vendor/leaflet/     Leaflet 1.9.4, vendoret
   └── OpenStreetMap       korttiles, eneste eksterne afhængighed
```

## Domæner og komponenter

| Komponent | Ansvar | Afhængigheder |
|---|---|---|
| `data/schools.js` | Datasæt, én record pr. skole | ingen |
| `js/app.js` | Rendering af markører, panel og toggles | Leaflet, datasæt |
| `index.html` | Layout og styling | ovenstående |

## Integrationer

- OpenStreetMap tile server, `tile.openstreetmap.org`. Gratis, ingen nøgle, kræver korrekt attribution, som er med i kortet. Ved fejl vises Leaflets grå baggrund, markørerne virker stadig.

## Fase 2, afstandsanalyse

Ikke implementeret endnu. Forventet tilgang: en engangsberegning af kørselsafstand fra et grid af punkter i Danmark til nærmeste skole, fx via OSRM, gemt som statisk GeoJSON der farvelægges i Leaflet. Dermed bevares arkitekturen uden server. Beslutningen træffes når fasen starter.

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
