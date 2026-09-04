# Ret en bug

Buggen:

[BESKRIV BUGGEN — HVAD FORVENTEDE DU, OG HVAD SKER DER FAKTISK?]

Læs `CLAUDE.md` og relevante dokumenter i `docs/`.

## Proces

1. Registrér buggen i `docs/TASKS.md` under Bugs. Kort form er nok: titel, forventet, faktisk.
2. Reproducér buggen først. Ret ikke noget, du ikke har set fejle. Kan buggen ikke reproduceres, så sig det eksplicit og stop.
   Husk Gauntlet-reglen: udelukk en forældet kørende proces, før du konkluderer at output er forkert.
3. Find årsagen, ikke kun symptomet.
4. Skriv en regressionstest der fejler på grund af buggen, når det er praktisk muligt.
5. Ret buggen med den mindste fokuserede ændring.
6. Verificér: regressionstesten består, eksisterende relevante tests består stadig, og faktisk output er inspiceret.
7. Gennemgå `git diff`.
8. Markér buggen løst i `docs/TASKS.md` med årsag og rettelse i kort form.

Udvid ikke scope undervejs. Opdager du andre problemer, registrér dem under Opdagede tasks eller Bugs i `docs/TASKS.md` i stedet for at rette dem nu.

Afslut med:

### Årsag

### Rettelse

### Regressionstest

### Verificeret
