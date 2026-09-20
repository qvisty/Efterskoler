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

Afstandslaget tegner alle gitterceller i ét offscreen canvas i web mercator
og viser det som ét imageOverlay, så pan og zoom er gratis uanset antal
celler. Ved hver toggle genberegnes og gentegnes billedet, ca. 130 ms ved
42000 celler. Hover håndteres af én mousemove handler med O(1) celleopslag.

Findes `data/traveltimes.js` med precomputed køretider fra
`scripts/generate_traveltimes.mjs`, farves efter minutter i bil i stedet
for luftlinje km. Placeholderfilen har `TRAVELTIMES = null`, som giver
luftlinje.

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

To kanaler serverer den samme kode fra dette repo.

### GitHub Pages

- Platform: GitHub Pages, workflow i `.github/workflows/pages.yml`, deployer ved push til main
- Build: ingen, filerne serveres som de er, script referencer versionsstemples ved deploy
- Secrets: ingen
- Adgang: offentlig

### Hjemmeserveren

- Platform: Jespers hjemmeserver, drevet af repoet qvisty/Min-server, som er kilden til sandhed om opsætningen
- Build: nginx image bygges på serveren med `Dockerfile` i repoets rod, ikke i GitHub Actions
- Deploy flow: kode pushes til GitHub, derefter `ssh server /srv/server/scripts/deploy.sh efterskoler`, som henter koden, bygger og genstarter containeren. Migrationstrinnet springes over, projektet har ingen `manage.py`. Opsætning første gang sker med `new-project.sh efterskoler <git-url>` på serveren
- Secrets: ingen. `new-project.sh` genererer en `.env` på serveren som del af sit faste flow, men projektet bruger kun `PROJECT_NAME`, `REPO_URL` og `TZ` derfra
- Database: ingen. Den database, `new-project.sh` opretter i den delte Postgres, står ubrugt hen, samme mønster som et SQLite projekt, se `docs/kobling.md` i Min-server
- Backups: ikke relevante, alt indhold ligger i git
- Monitoring: Uptime Kuma kan overvåge `https://efterskoler.srv.mitcv.com/sundhed/`, som nginx svarer `ok` på
- Rollback: `deploy.sh efterskoler <git-ref>`
- Adgang: privat, kun Jespers egne enheder på Tailscale. Valgt bevidst, Pages udgaven er den offentlige

Detaljerne står i `docs/DRIFT.md`.

#### Kontrakten med serveren

Projektet kan kun køre på serveren, hvis alle fire punkter holder:

1. Repoets rod har en `compose.yml` med en service ved navn `web`
2. Containeren hedder `efterskoler-web`
3. Den lytter på port 8000
4. Den er på det eksterne Docker netværk `web`

## Arkitekturbeslutninger

### ADR 001: Statisk site uden backend og database

**Status:** Accepted

**Kontekst:** Der skal vises ca. 20 statiske datapunkter på et kort. Ingen brugere, ingen skrivninger.

**Alternativer:** Django app, SPA framework, statisk site.

**Valg:** Statisk site med Leaflet, data i en statisk JS fil, Leaflet vendoret.

**Begrundelse:** Simplest mulige robuste løsning, jf. CLAUDE.md principperne. SQLite blev end ikke nødvendig, se `docs/DATABASE.md`.

**Konsekvenser:** Ingen drift. Fase 2 skal løses med precomputed statiske data eller en ekstern service.
