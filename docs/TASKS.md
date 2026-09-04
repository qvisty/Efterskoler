# Tasks

## Arbejdsregler

Hver task skal:

- være lille nok til at kunne vurderes selvstændigt
- have konkrete acceptkriterier
- kunne testes eller verificeres
- have tydelig status

Tilladte statusser:

```text
TODO
IN PROGRESS
BLOCKED
REVIEW
DONE
```

En task er først DONE når dens acceptkriterier og Definition of Done er verificeret.

### Fuldt og let format

Brug det fulde taskformat (som Task 001 nedenfor) til opgaver med reel kompleksitet.

Små, trivielle opgaver må bruge det lette format, så filen ikke vokser unødvendigt:

```markdown
## Task XXX: [NAVN]

**Status:** TODO

**Formål:** [ÉN LINJE]

**Acceptkriterier:**

- [ ] [KRITERIUM]

**Resultat:** [KORT, UDFYLDES VED DONE]
```

### Arkivering

Når en milestone er afsluttet, flyttes dens DONE tasks til `docs/TASKS_ARCHIVE.md` (opret filen ved behov, samme struktur som her). Denne fil skal kun indeholde den aktive plan og forblive kort nok til at kunne læses i sin helhed.

## Aktuel milestone

[MILESTONE]

Mål:

[KORT BESKRIVELSE]

## Task 001: [NAVN]

**Status:** TODO

### Formål

[Hvad skal opgaven opnå?]

### Afhængigheder

Ingen

eller:

- Task XXX

### Forventede områder

```text
[mapper/filer]
```

Dette er vejledende. Undersøg eksisterende kode før implementering.

### Acceptkriterier

- [ ] [KRITERIUM]
- [ ] [KRITERIUM]
- [ ] [KRITERIUM]

### Verifikation

- [ ] happy path
- [ ] invalid input hvis relevant
- [ ] permissions hvis relevant
- [ ] edge cases
- [ ] relevante automatiske tests
- [ ] faktisk output inspiceret

### Gauntlet

Efter implementering:

1. kør relevante tests
2. inspicér faktisk output
3. sammenlign med krav eller reference
4. identificér største resterende mangel
5. ret manglen
6. gentag indtil acceptkriterierne er opfyldt

### Resultat

**Implementeret:**

[RESULTAT]

**Tests/verifikation:**

[RESULTAT]

**Største kritikpunkt:**

[RESULTAT]

**Resterende risici:**

[RESULTAT]

## Task 002: [NAVN]

**Status:** TODO

### Formål

[...]

### Acceptkriterier

- [ ] [KRITERIUM]

### Verifikation

- [ ] [KONTROL]

## Opdagede tasks

Nye nødvendige tasks registreres her først.

- [ ] [TASK]

De må ikke automatisk implementeres hvis de udvider scope.

## Teknisk gæld

Registrér kun konkret identificeret teknisk gæld.

- [ ] [PROBLEM]
  - Konsekvens: [KONSEKVENS]
  - Foreslået løsning: [LØSNING]

## Bugs

### Bug 001: [TITEL]

**Status:** TODO

**Beskrivelse:**

[...]

**Forventet:**

[...]

**Faktisk:**

[...]

**Regressionstest:**

- [ ] [TEST]
