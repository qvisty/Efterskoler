# .claude

Denne mappe indeholder Claude Code-specifik opsætning for repositoryet.

## commands/

Filerne i `commands/` er custom slash commands. Claude Code opdager dem automatisk: en fil `commands/next-task.md` bliver til kommandoen `/next-task` i Claude Code-sessionen.

Kommandoerne her er tynde wrappers om prompterne i `prompts/`:

| Kommando | Indhold |
| --- | --- |
| `/start-from-template [projektidé]` | Kører `prompts/START_FROM_TEMPLATE.md` med din idé indsat. Beskriv gerne idéen med skabelonen i `prompts/PROJEKTIDE.md`; uden argument interviewer agenten dig ud fra skabelonens felter |
| `/next-task` | Kører `prompts/NEXT_TASK.md` |
| `/fix-bug [bugbeskrivelse]` | Kører `prompts/FIX_BUG.md` med din bugbeskrivelse indsat |
| `/review-project` | Kører `prompts/REVIEW_PROJECT.md` |

### Hvorfor wrappers og ikke kopier

`prompts/` er source of truth og virker for alle agenter, også Codex, via copy-paste. Kommandofilerne inliner promptfilen med en `@prompts/...`-reference i stedet for at duplikere teksten. Retter du en prompt, virker rettelsen dermed automatisk i den tilhørende slash command.

### Sådan virker en kommandofil

- Filnavnet bestemmer kommandonavnet: `next-task.md` → `/next-task`.
- YAML-frontmatter øverst er valgfri metadata: `description` vises i Claude Codes kommandoliste, `argument-hint` vises som hjælp til argumenter.
- Resten af filen er den prompt der sendes, når kommandoen køres.
- `$ARGUMENTS` erstattes med det, du skriver efter kommandonavnet, fx `/start-from-template en app til holdtilmelding`.
- `@sti/til/fil` inliner filens indhold i prompten.

### Tilføj en ny kommando

1. Skriv den fulde prompt som en ny fil i `prompts/` (så Codex-brugere også kan bruge den).
2. Opret en wrapper i `commands/` der refererer til den med `@prompts/DIN_FIL.md`.
3. Genstart eller start en ny Claude Code-session, hvis kommandoen ikke dukker op med det samme.

Dokumentation: <https://code.claude.com/docs/en/slash-commands>
