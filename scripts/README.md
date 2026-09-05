# Scripts

## generate_grid.mjs

Genererer `data/grid.js`, gitterpunkterne som afstandslaget farvelægger.

Vigtigt: kortet læser den genererede `data/grid.js`, ikke scriptet. En ændring af `CELL_KM` i scriptet har derfor ingen effekt, før scriptet er kørt igen og den nye `data/grid.js` er committet.

Sådan regenereres gitteret:

```bash
npm install world-atlas topojson-client
node scripts/generate_grid.mjs
```

`CELL_KM` i toppen af scriptet styrer cellestørrelsen i km. Mindre celler giver mere detaljeret farvelægning og en større `data/grid.js`. Ved 2 km er der ca. 10600 celler, og genberegningen i browseren tager under 20 ms, så der er plads til at gå finere ned, hvis det ønskes.

## Langtidskørende processer

Hvis et script starter en dev-server eller anden langtidskørende proces i baggrunden, fx til Playwright-verifikation:

- Stop via hele procestræet, ikke en enkelt gemt PID. Wrapper-kommandoer spawner børneprocesser med andre PID'er, så en PID-fil rammer typisk kun wrapperen.
- Brug mønstermatch, fx `pkill -f 'http.server'`.
- Ved uventet output efter en rettelse: udelukk først at en forældet kørende proces er årsagen, før fejlen antages at ligge i selve rettelsen.
