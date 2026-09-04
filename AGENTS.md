# AGENTS.md

Dette repository er et starterkit til AI-assisteret softwareudvikling.

## Før du arbejder

Læs altid først:

1. `CLAUDE.md`
2. `docs/PRD.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DATABASE.md`
5. `docs/ROADMAP.md`
6. `docs/TASKS.md`

`CLAUDE.md` indeholder de fælles arbejdsregler for projektet. `docs/` er projektets source of truth.

`CLAUDE.md` er en permanent metodefil og må ikke erstattes. Stackspecifikke kommandoer og arkitektur skrives i dens afsluttende sektioner "Kommandoer" og "Arkitektur i denne kodebase", når stacken er valgt.

Hvis dokumentation og kode er i konflikt, skal konflikten identificeres eksplicit. Gæt ikke på hvilken version der er korrekt.

## Centrale principper

- Forstå problemet før du bygger.
- Vælg teknologistak ud fra projektets behov.
- Python og Django er præferencer, ikke krav.
- Hvis Django vælges, skal SaaS Pegasus vurderes som foretrukket udgangspunkt for et nyt projekt.
- Hold databasen så enkel som muligt. Vurder SQLite først, derefter Supabase, derefter traditionel PostgreSQL hvis nødvendigt.
- Docker er ikke standard. Foretræk native udvikling og managed services når det er robust og praktisk.
- Arbejd i små, verificerbare tasks.
- Brug faktiske referencer, tests og output som målestok.
- Stop ikke alene fordi koden virker. Stop når acceptkriterier og Definition of Done er opfyldt.
- Undgå overengineering.

## Normal arbejdsgang

Ved opstart af et nyt projekt fra denne template, brug `prompts/START_FROM_TEMPLATE.md`. Projektidéen beskrives bedst med skabelonen i `prompts/PROJEKTIDE.md`.

Ved efterfølgende udvikling, brug `prompts/NEXT_TASK.md`.

Ved bugs, brug `prompts/FIX_BUG.md`.

Ved helhedsreview, brug `prompts/REVIEW_PROJECT.md`.

I Claude Code findes prompterne også som slash commands: `/start-from-template`, `/next-task`, `/fix-bug` og `/review-project`. De er tynde wrappers om `prompts/`, som forbliver source of truth for alle agenter.

## Ændringer

Når du ændrer kode eller dokumentation:

1. Undersøg eksisterende struktur og patterns først.
2. Hold ændringen fokuseret.
3. Kør relevante tests og checks.
4. Gennemgå diffen.
5. Opdater relevante projektfiler hvis beslutninger eller scope ændres.
6. Rapportér kort hvad der er implementeret, verificeret, største resterende risiko og næste relevante skridt.
