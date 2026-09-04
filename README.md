# AI Project Starter

Et teknologineutralt starterkit til AI-assisteret softwareudvikling med Claude Code eller Codex.

Målet er en fast, genbrugelig arbejdsmetode uden at låse projekter til en bestemt stack.

## Grundprincipper

- Forstå problemet og definér MVP før implementering.
- Vælg teknologistak ud fra projektets faktiske behov.
- Django er en præference, ikke et krav.
- Hvis Django vælges, skal SaaS Pegasus vurderes som foretrukket udgangspunkt.
- Hold databasen simpel: vurder SQLite først, derefter Supabase, og traditionel PostgreSQL først når det er nødvendigt.
- Docker er ikke standard. Foretræk native udvikling og managed services når det er robust.
- Arbejd i små verificerbare tasks.
- Test, kritisér og forbedr faktisk output.
- Undgå overengineering.

## Struktur

```text
.
├── AGENTS.md
├── CHANGELOG.md
├── CLAUDE.md
├── README.md
├── VERSION
├── .claude/
│   └── commands/          # Claude Code slash commands (wrappers om prompts/)
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── ROADMAP.md
│   └── TASKS.md
├── prompts/
│   ├── PROJEKTIDE.md
│   ├── START_FROM_TEMPLATE.md
│   ├── NEXT_TASK.md
│   ├── FIX_BUG.md
│   └── REVIEW_PROJECT.md
└── scripts/               # udfyldes når stacken er valgt
```

## Start et nyt projekt

1. Klik `Use this template` på GitHub.
2. Opret et nyt privat repository.
3. Klon repositoryet lokalt og åbn det i VS Code.
4. Start Claude Code eller Codex i projektets rodmappe.
5. Beskriv din projektidé — brug gerne skabelonen i `prompts/PROJEKTIDE.md`, der stiller de systematiske spørgsmål (problem, målgruppe, arbejdsgange, referencer, ikke-mål, rammer).
6. I Claude Code: kør `/start-from-template` efterfulgt af din projektidé. I Codex: kopiér `prompts/START_FROM_TEMPLATE.md` og indsæt din projektidé.
7. Lad agenten gøre PRD, stackvalg, databasevalg, arkitektur, roadmap og første tasks klar før produktkode skrives.
8. Brug derefter `/next-task` (eller `prompts/NEXT_TASK.md`) til den normale udviklingscyklus.

## Beskriv projektidéen godt

Kvaliteten af PRD, MVP og teknologivalg afhænger direkte af hvor godt idéen er beskrevet.

`prompts/PROJEKTIDE.md` er en copy-paste-klar skabelon med de spørgsmål en god projektbeskrivelse besvarer: problemet, hvem der har det, de vigtigste arbejdsgange, referencer til eksisterende produkter, ikke-mål, rammer, succeskriterier og dine egne åbne spørgsmål. Skabelonen handler bevidst om produktet, ikke om teknologi — stack og database vælges senere ud fra behovene.

Alle felter er valgfrie. En tynd beskrivelse er også okay: både `/start-from-template` og startprompten beder agenten stille de vigtigste opklarende spørgsmål, før MVP og teknologivalg fastlægges. Kører du `/start-from-template` helt uden idé, interviewer agenten dig ud fra skabelonens felter.

## Slash commands i Claude Code

Templaten indeholder fire custom slash commands i `.claude/commands/`, så prompterne kan køres uden copy-paste:

- `/start-from-template [projektidé]` — gør et nyt repository implementeringsklart ud fra din idé.
- `/next-task` — implementér næste TODO task fra `docs/TASKS.md` efter arbejdsmetoden.
- `/fix-bug [bugbeskrivelse]` — reproducér, ret og regressionstest en bug.
- `/review-project` — kritisk helhedsreview af projektets tilstand, uden automatiske ændringer.

Kommandoerne er bevidst tynde wrappers: hver kommandofil inliner den tilsvarende fil i `prompts/` via en `@prompts/...`-reference. `prompts/` er dermed source of truth — retter du en prompt, følger slash commanden automatisk med, og Codex-brugere kan bruge de samme prompts via copy-paste.

Se `.claude/README.md` for hvordan kommandofilerne virker, og hvordan du tilføjer nye.

## Hurtig copy paste prompt

```text
Dette repository er oprettet fra ai-project-starter templaten.

Læs først AGENTS.md, CLAUDE.md og alle relevante filer i docs/.

Brug repositoryets arbejdsmetode og teknologipræferencer som projektets styringsramme.

Gør først projektet implementeringsklart. Forstå problemet, definér et realistisk MVP, vurder relevante teknologistacks, vælg den simpleste robuste database og udviklingsopsætning, og opdater PRD, arkitektur, databasebeskrivelse, roadmap og første tasks.

Begynd ikke at implementere produktkode endnu.

Hvis Django anbefales, skal SaaS Pegasus vurderes som foretrukket udgangspunkt. Hjælp mig med valg af den aktuelle Pegasus projektopsætning før generering.

Hold database og drift simple. Vurder SQLite først, derefter Supabase, og traditionel PostgreSQL først hvis kravene gør det nødvendigt. Docker er ikke standard.

Når implementeringen senere starter, arbejd task for task med faktisk output, tests, kritisk review og forbedring indtil acceptkriterierne er opfyldt.

Min projektidé:

[INDSÆT PROJEKTIDÉ HER]
```

Den komplette version findes i `prompts/START_FROM_TEMPLATE.md`. Brug gerne skabelonen i `prompts/PROJEKTIDE.md` til at formulere selve projektidéen, før du indsætter den.

## Claude Code og Codex

`CLAUDE.md` indeholder de detaljerede fælles arbejdsregler og er den primære instruktionsfil til Claude Code.

`CLAUDE.md` er en permanent metodefil. Den afsluttes med to stackspecifikke sektioner, "Kommandoer" og "Arkitektur i denne kodebase", der udfyldes når stacken er valgt, fx via `/init`. Filen må ikke erstattes af genereret indhold.

`AGENTS.md` er indgangen for Codex og peger videre til `CLAUDE.md` samt projektets dokumentation.

Begge agenter kan derfor bruge den samme `docs/` struktur, de samme prompts og den samme taskbaserede udviklingsproces.

## Dokumenternes roller

- `AGENTS.md`: projektinstruktioner og indgang for Codex.
- `CLAUDE.md`: detaljerede permanente arbejdsregler.
- `docs/PRD.md`: produkt, brugere, krav og MVP.
- `docs/ARCHITECTURE.md`: stack, komponenter, integrationer, udvikling og deployment.
- `docs/DATABASE.md`: databasevalg, datamodel og relationer.
- `docs/ROADMAP.md`: faser og milestones.
- `docs/TASKS.md`: aktive, små og verificerbare opgaver.
- `docs/TASKS_ARCHIVE.md`: afsluttede tasks fra tidligere milestones. Oprettes ved behov, så `TASKS.md` forbliver kort.
- `prompts/PROJEKTIDE.md`: copy-paste-klar skabelon til at beskrive projektidéen systematisk.
- `prompts/START_FROM_TEMPLATE.md`: anbefalet startprompt til et nyt repository fra templaten.
- `prompts/NEXT_TASK.md`: normal udviklingscyklus.
- `prompts/FIX_BUG.md`: bugfix-flow med reproduktion og regressionstest.
- `prompts/REVIEW_PROJECT.md`: kritisk helhedsreview.
- `.claude/commands/`: slash commands til Claude Code, tynde wrappers om `prompts/`.
- `CHANGELOG.md`: ændringer i selve templaten pr. version.

## Django og SaaS Pegasus

Hvis Django viser sig at være den bedste løsning, skal agenten først vurdere SaaS Pegasus og den aktuelle projektgenerator. Den skal hjælpe med valg af den konkrete Pegasus opsætning og kun aktivere funktioner der løser et reelt behov.

## Database og Docker

Database er ikke fastlagt på forhånd. Vurderingsrækkefølgen er SQLite, Supabase, traditionel PostgreSQL og derefter andre løsninger ved konkrete behov.

Docker er heller ikke standard. Foretrukken rækkefølge er native udvikling, managed services, Docker til enkelte services og først derefter fuld Docker opsætning.

## Versionering

Starterkittets version står i `VERSION`, og ændringerne pr. version står i `CHANGELOG.md`.

Repositories oprettet fra templaten kan ikke automatisk trække opdateringer ind. Sammenlign dit projekts `VERSION` med changeloggen, og overfør manuelt de ændringer der er relevante.
