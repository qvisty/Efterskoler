# Changelog

Væsentlige ændringer i templaten, nyeste først. Versionen står i `VERSION`.

Repositories oprettet fra templaten kan ikke automatisk trække opdateringer ind. Sammenlign dit projekts `VERSION` med listen her, og overfør manuelt de ændringer der er relevante for dit projekt.

## 1.5.0 - 2026-08-22

- Tilføjet bugfix-flow: `prompts/FIX_BUG.md` og `/fix-bug [bugbeskrivelse]` — reproducér først, find årsagen, skriv regressionstest, ret med mindste fokuserede ændring, verificér.
- `prompts/NEXT_TASK.md`: nyt trin 10 — når en task afslutter den aktuelle milestone, arkiveres milestonens DONE tasks til `docs/TASKS_ARCHIVE.md`, og næste milestone bekræftes mod roadmappet. Arkiveringsreglen havde før ingen udløser i arbejdsgangen.
- `AGENTS.md`: nævner nu `prompts/PROJEKTIDE.md` og bugfix-flowet, så Codex-brugere også opdager dem.
- `START_FROM_TEMPLATE.md` strammet efter to simulerede gennemkørsler af opstartsflowet (fyldig og tynd projektidé): "Dit første svar" og tynd-idé-reglen henviser nu eksplicit til hinanden (før kunne 12-punktslisten læses som ubetinget og invitere til stack-anbefaling på ét gæt); tynd-idé-afsnittet angiver prioritering og maks. antal spørgsmål, tillader hypoteser fremlagt til bekræftelse (men ikke som beslutningsgrundlag) og advarer mod forklædte stackspørgsmål; punkt 4-11 i første svar er markeret som foreløbige forslag der først låses efter afklaring; "ved ikke"-svar besvares med en begrundet default til accept; docs-udfyldning (trin 10-14) venter eksplicit til retningen er godkendt; og web-research af referencer og aktuel dokumentation hører til planlægningsfasen, ikke første svar. Slash-commanden henviser til prompten i stedet for at duplikere tynd-idé-reglen.

## 1.4.0 - 2026-08-22

- Tilføjet `prompts/PROJEKTIDE.md`: copy-paste-klar skabelon til at beskrive projektidéen systematisk (problem, målgruppe, arbejdsgange, referencer, ikke-mål, rammer, succeskriterier, åbne spørgsmål). Bevidst produkt- og PRD-orienteret, ikke teknologi — stack vælges senere ud fra behovene.
- `prompts/START_FROM_TEMPLATE.md` og `/start-from-template`: ved en tynd projektbeskrivelse stiller agenten nu de vigtigste opklarende spørgsmål fra skabelonen, før MVP og teknologivalg fastlægges; helt uden idé interviewer den ud fra skabelonens felter.
- README: nyt afsnit "Beskriv projektidéen godt" og henvisninger til skabelonen fra quickstart og copy-paste-prompten.

## 1.3.0 - 2026-08-22

- Tilføjet Claude Code slash commands i `.claude/commands/`: `/start-from-template`, `/next-task` og `/review-project` som tynde wrappers om prompterne i `prompts/`. Se `.claude/README.md` for hvordan de virker, og hvordan nye tilføjes.
- Fjernet `prompts/START_PROJECT.md`. Den overlappede næsten fuldstændigt med `prompts/START_FROM_TEMPLATE.md` og skulle vedligeholdes parallelt. Brug `START_FROM_TEMPLATE.md`.
- Tilføjet denne CHANGELOG.
- README: strukturtræ og dokumentroller bragt i overensstemmelse med det faktiske indhold (`scripts/`, `.claude/`, `CHANGELOG.md`).

## 1.2.0 - 2026-08-22

- `CLAUDE.md`: eksplicit konvention for `/init` og genereret dokumentation. Filen er en permanent metodefil og afsluttes nu med to stackspecifikke sektioner, "Kommandoer" og "Arkitektur i denne kodebase", der udfyldes når stacken er valgt i stedet for at erstatte filen.
- `CLAUDE.md` (Gauntlet) og `scripts/README.md`: ved uventet output efter en rettelse skal en forældet baggrundsproces udelukkes først. Stop langtidskørende processer via procestræet (`pkill -f`), ikke en enkelt PID, da wrappers som `uv run` spawner børneprocesser.
- `docs/TASKS.md` og `CLAUDE.md`: let taskformat til trivielle opgaver og arkiveringsregel (`docs/TASKS_ARCHIVE.md`), så `TASKS.md` forbliver kort.

## 1.1.0 - 2026-08-22

- Quick start for Claude Code og Codex i README.
- Tilføjet `prompts/START_FROM_TEMPLATE.md` som anbefalet startprompt for repositories oprettet fra templaten.

## 1.0.0 - 2026-08-22

- Første version: `CLAUDE.md` med arbejdsmetode, `AGENTS.md` til Codex, docs-skabeloner (PRD, arkitektur, database, roadmap, tasks), prompts og scripts-vejledning.
