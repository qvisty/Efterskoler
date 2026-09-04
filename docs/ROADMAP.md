# Project roadmap

## Produkt

Ordblindeefterskoler i Danmark, interaktivt kort.

## Princip

Roadmappet beskriver produktets progression. Detaljerede opgaver findes i `docs/TASKS.md`.

## Fase 0: Afklaring og fundament

**Status: DONE**

- problem og MVP defineret i `docs/PRD.md`
- stack valgt, statisk site med Leaflet, se `docs/ARCHITECTURE.md`
- ingen database, se `docs/DATABASE.md`

## Fase 1: Interaktivt kort med toggles, MVP

**Status: IN PROGRESS**

Mål: alle ordblindeefterskoler på et Danmarkskort, hver skole kan slås til og fra, Emmerske fremhævet.

Leverancer:

- datasæt over ordblindeefterskolerne
- Leaflet kort med markører og popups
- togglepanel med enkeltvalg, vælg alle og fravælg alle

Exit criteria:

- MVP kravene i `docs/PRD.md` er opfyldt
- koordinater og skoleliste er verificeret mod faktiske adresser

## Fase 2: Afstandsanalyse

**Status: TODO**

Mål: farvelægning af Danmark efter kørselsafstand til nærmeste ordblindeefterskole, så hullet efter en lukning af Emmerske kan vises direkte.

Skal afklares først:

- kørselsafstand via routing service, fx OSRM, eller fugleflugt
- precomputed statisk GeoJSON kontra beregning i browseren
- visning af to scenarier, med og uden Emmerske

## Fase 3: Deling og finpudsning

**Status: TODO**

- GitHub Pages hosting
- delbar visning via URL parametre
- gennemgang af mobilvisning og tilgængelighed

## Senere muligheder

Ikke del af nuværende scope:

- elevtal eller kapacitet pr. skole
- andre specialefterskoletyper som ekstra lag
- eksport af kortudsnit som billede

Disse må ikke implementeres uden ændring af PRD og roadmap.
