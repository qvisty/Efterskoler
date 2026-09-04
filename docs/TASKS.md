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

**Status:** TODO

**Formål:** Gøre kortet delbart som link.

**Acceptkriterier:**

- [ ] sitet er tilgængeligt på en offentlig URL
- [ ] README opdateret med linket

## Opdagede tasks

- [ ] Fase 2 afklaring: kørselsafstand kontra fugleflugt, precomputed data kontra ekstern service, se `docs/ROADMAP.md`

## Teknisk gæld

Ingen registreret.

## Bugs

Ingen registreret.
