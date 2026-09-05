# Scripts

## generate_grid.mjs

Genererer `data/grid.js`, gitterpunkterne som afstandslaget farvelægger.

Vigtigt: kortet læser den genererede `data/grid.js`, ikke scriptet. En ændring af `CELL_KM` i scriptet har derfor ingen effekt, før scriptet er kørt igen og den nye `data/grid.js` er committet.

Sådan regenereres gitteret:

```bash
npm install world-atlas topojson-client
node scripts/generate_grid.mjs
```

`CELL_KM` i toppen af scriptet styrer cellestørrelsen i km. Mindre celler giver mere detaljeret farvelægning og en større `data/grid.js`. Ved 1 km er der ca. 42000 celler.

Bemærk: efter en grid ændring passer `data/traveltimes.js` ikke længere og skal genereres om, ellers falder kortet tilbage til luftlinje.

## generate_traveltimes.mjs

Genererer `data/traveltimes.js`, køretid i bil i minutter fra hvert gitterpunkt til hver skole. Når filen er committet, skifter afstandslaget automatisk fra luftlinje km til minutter.

Kræver kun Node 18 eller nyere og netadgang, ingen dependencies:

```bash
node scripts/generate_traveltimes.mjs
```

Scriptet bruger den offentlige OSRM demo server, holder pauser mellem kaldene og gemmer løbende fremdrift, så det kan afbrydes og genoptages. Med 1 km gitteret er det ca. 600 kald og 10 til 15 minutter. En egen OSRM instans kan angives med `OSRM_URL=... node scripts/generate_traveltimes.mjs`.

Bagefter:

```bash
git add data/traveltimes.js
git commit -m "Precomputed køretider"
git push
```

## Langtidskørende processer

Hvis et script starter en dev-server eller anden langtidskørende proces i baggrunden, fx til Playwright-verifikation:

- Stop via hele procestræet, ikke en enkelt gemt PID. Wrapper-kommandoer spawner børneprocesser med andre PID'er, så en PID-fil rammer typisk kun wrapperen.
- Brug mønstermatch, fx `pkill -f 'http.server'`.
- Ved uventet output efter en rettelse: udelukk først at en forældet kørende proces er årsagen, før fejlen antages at ligge i selve rettelsen.
