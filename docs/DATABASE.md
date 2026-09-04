# Database design

## Status

**Database:** UNDECIDED

Database vælges som en arkitekturbeslutning og skal holdes så enkel som muligt.

## Beslutningsgrundlag

Beskriv:

- forventet antal brugere
- forventet samtidighed
- datamængde
- write belastning
- relationel kompleksitet
- realtimebehov
- backupbehov
- deployment
- driftskompleksitet
- omkostninger

## Kandidater

### SQLite

**Status:** PASS / FAIL / TBD

Begrundelse:

[BEGRUNDELSE]

### Supabase

**Status:** PASS / FAIL / TBD

Vurder separat:

- managed PostgreSQL
- Auth
- Storage
- Realtime
- Edge Functions

Begrundelse:

[BEGRUNDELSE]

### Traditionel PostgreSQL

**Status:** PASS / FAIL / TBD

Begrundelse:

[BEGRUNDELSE]

### Andet

Kun hvis et konkret behov kræver det.

## Valgt løsning

**Database:** [VALG]

**Hvorfor:**

[BEGRUNDELSE]

**Hvorfor simplere løsninger ikke er tilstrækkelige, hvis relevant:**

[BEGRUNDELSE]

## Entiteter

### [ENTITY]

Formål:

[Beskrivelse]

Felter:

```text
id
...
created_at
updated_at
```

Relationer:

```text
...
```

Constraints:

```text
...
```

Indexes:

```text
...
```

## Relationer

```text
[ENTITY A]
   │
   │ 1:N
   ↓
[ENTITY B]
```

## Constraints

Brug databasen aktivt til at beskytte dataintegritet, når det giver mening.

Dokumentér relevante:

- uniqueness regler
- check constraints
- foreign key regler
- delete behaviour

## Indexing

Opret indexes på baggrund af faktiske query patterns. Undgå spekulative indexes.

## Persondata

For data med personoplysninger beskrives:

- formål
- adgang
- retention
- sletning
- eventuel audit trail
- logging

## Data lifecycle

### Oprettelse

[FLOW]

### Ændring

[FLOW]

### Arkivering

[FLOW]

### Sletning

[FLOW]

## Backup og restore

- Backupstrategi: [TBD]
- Restore procedure: [TBD]
- Test af restore: [TBD]

## Migration strategy

Hvis frameworket bruger migrations:

- migrations versionsstyres sammen med kode
- migrations testes før deployment
- store datamigrationer vurderes separat
- eksisterende migrations omskrives normalt ikke

## Åbne databasebeslutninger

- [ ] [SPØRGSMÅL]
