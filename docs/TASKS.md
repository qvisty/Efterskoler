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

**Status:** TODO

**Formål:** Koordinaterne er sat ud fra bynavne og skal kontrolleres mod skolernes faktiske adresser, fx via ordbl.dk og skolernes egne hjemmesider.

**Acceptkriterier:**

- [ ] alle 20 skolers adresser slået op hos en autoritativ kilde
- [ ] koordinater opdateret til adresseniveau, fx via DAWA eller Nominatim
- [ ] Skrødstrup Efterskoles medlemskab af Ordblindeefterskolerne be- eller afkræftet
- [ ] `verified: false` markeringer fjernet eller records rettet

**Note:** Kræver netadgang til ordbl.dk og en geokodningstjeneste, som var blokeret i det oprindelige udviklingsmiljø.

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

**Status:** TODO

**Formål:** Afstandslaget skal vise reel rejsetid i bil, ikke luftlinje.

**Skitse:** Engangsberegning af kørselstid fra hvert gitterpunkt i `data/grid.js` til alle skoler, fx via en lokal OSRM instans eller OpenRouteService, gemt som statisk fil `data/traveltimes.js`. Frontend vælger så minimum over synlige skoler, samme logik som nu. Ved manglende data falder laget tilbage til luftlinje.

**Acceptkriterier:**

- [ ] kørselstider precomputed for alle gitterpunkt-skole par
- [ ] legenden skifter til minutter
- [ ] toggle adfærden er uændret

**Note:** Routing tjenester var blokeret i det oprindelige udviklingsmiljø, beregningen skal køres et sted med netadgang.

## Opdagede tasks

Ingen åbne.

## Teknisk gæld

Ingen registreret.

## Bugs

Ingen registreret.
