# Tasks

## Arbejdsregler

Hver task skal:

- være lille nok til at kunne vurderes selvstændigt
- have konkrete acceptkriterier
- kunne testes eller verificeres
- have tydelig status

Tilladte statusser: TODO, IN PROGRESS, BLOCKED, REVIEW, DONE.

Når en milestone er afsluttet, flyttes dens DONE tasks til `docs/TASKS_ARCHIVE.md`.

## Aktuel milestone

Fase 1: Interaktivt kort med toggles, MVP.

Mål: alle ordblindeefterskoler på et Danmarkskort, hver skole kan slås til og fra, Emmerske fremhævet.

## Task 001: Datasæt over ordblindeefterskolerne

**Status:** DONE

**Formål:** Ét datasæt i `data/schools.js` med alle skoler i foreningen Ordblindeefterskolerne.

**Acceptkriterier:**

- [x] alle 20 skoler med navn, by, region, koordinater og website
- [x] Emmerske markeret med `highlight: true`
- [x] usikre records markeret med `verified: false`

**Resultat:** 20 skoler indsamlet via websøgninger, da ordbl.dk ikke kunne tilgås direkte fra udviklingsmiljøet. Koordinater sat ud fra by og område. Skrødstrup Efterskole markeret som uverificeret.

## Task 002: Interaktivt kort med togglepanel

**Status:** DONE

**Formål:** Leaflet kort over Danmark med markører, popups og panel hvor hver skole kan slås til og fra.

**Acceptkriterier:**

- [x] kortet åbner centreret på Danmark med alle skoler synlige
- [x] popup med navn, by og link til website
- [x] checkboks pr. skole, vælg alle og fravælg alle
- [x] Emmerske fremhævet i både kort og panel
- [x] brugbar på mobil, panelet kan klappes sammen

**Resultat:** `index.html`, `js/app.js` og vendoret Leaflet 1.9.4. Verificeret med screenshot via lokal server og Playwright.

## Task 003: Verificér skoleliste og koordinater

**Status:** DONE

**Formål:** Koordinaterne var sat ud fra bynavne og skulle kontrolleres mod skolernes faktiske adresser.

**Acceptkriterier:**

- [x] alle 20 skolers koordinater opdateret til adresseniveau
- [x] skolelisten rettet mod autoritativ kilde
- [x] `verified: false` markeringer fjernet

**Resultat:** Projektejeren leverede koordinater for alle 20 skoler. Skrødstrup og Kongensgaard var fejlagtigt med i det oprindelige datasæt og er fjernet. Magleby Efterskole på Langeland og Hobro Efterskole er tilføjet, begge bekræftet som ordblindeefterskoler. Mejlby Efterskole lå forkert og er flyttet til Himmerland.

## Task 004: GitHub Pages hosting

**Status:** DONE

**Formål:** Gøre kortet delbart som link.

**Acceptkriterier:**

- [x] sitet er tilgængeligt på en offentlig URL
- [x] README opdateret med linket

**Resultat:** Deploy workflow i `.github/workflows/pages.yml`, hvert push til main deployer automatisk. Sitet ligger på https://qvisty.github.io/Efterskoler/. Pages blev aktiveret manuelt i repo settings, da workflow tokenet ikke må oprette Pages sitet.

## Task 005: Afstandslag med luftlinjeafstand

**Status:** DONE

**Formål:** Togglebart lag der farvelægger Danmark efter afstand til nærmeste synlige skole, som fundament for fase 2.

**Acceptkriterier:**

- [x] gitter over Danmarks landareal, genereret af `scripts/generate_grid.mjs` til `data/grid.js`
- [x] laget har egen toggle og ændrer intet, når det er slukket
- [x] farver opdateres øjeblikkeligt når skoler slås til og fra
- [x] legend med intervaller og note om at det er luftlinje
- [x] hover viser afstand og nærmeste synlige skole

**Resultat:** Ca. 2650 gitterceller a 4 km farvet i fem intervaller, lys til mørk rød. Verificeret med Playwright screenshots, scenariet uden Emmerske og Store Andst farver Sydvestjylland mørkerødt.

## Task 006: Kørselstid i stedet for luftlinje

**Status:** IN PROGRESS, afventer lokal kørsel af scriptet

**Formål:** Afstandslaget skal vise reel rejsetid i bil, ikke luftlinje.

**Acceptkriterier:**

- [x] script klar: `scripts/generate_traveltimes.mjs`, kun Node 18+, med resume og retry
- [x] frontend klar: findes `data/traveltimes.js` med gyldige data, skifter laget automatisk til minutter, legend og hover følger med, verificeret med syntetiske data
- [x] mismatch mellem traveltimes og grid giver fallback til luftlinje med console advarsel
- [ ] scriptet kørt lokalt og `data/traveltimes.js` committet

**Note:** Routing tjenester er blokeret i udviklingsmiljøet, så selve kørslen skal ske lokalt: `node scripts/generate_traveltimes.mjs`, se `scripts/README.md`. Ca. 600 kald til OSRM demo serveren, 10 til 15 minutter.

## Task 007: Delbar visning via URL

**Status:** DONE

**Formål:** Et scenarie skal kunne deles som link, fx uden Emmerske og Store Andst og med afstandslaget tændt.

**Acceptkriterier:**

- [x] fravalgte skoler og afstandslagets tilstand gemmes i URL hashen
- [x] et link med hash åbner direkte i det delte scenarie
- [x] hash ændringer i en åben side slår igennem
- [x] ukendte skole id'er ignoreres

**Resultat:** Format `#uden=emmerske,store-andst&afstand=1`. Standardvisningen har ingen hash. Verificeret med Playwright.

## Opdagede tasks

Ingen åbne.

## Teknisk gæld

Ingen registreret.

## Bugs

Ingen registreret.
