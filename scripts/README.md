# Scripts

Denne mappe er bevidst næsten tom i template repositoryet, fordi teknologistakken endnu ikke er valgt.

Når projektets udviklingsmiljø er besluttet, skal agenten vurdere om enkle scripts kan gøre det daglige workflow lettere.

På Windows kan det eksempelvis være:

```text
setup.ps1
dev.ps1
test.ps1
```

På macOS/Linux kan tilsvarende scripts anvendes hvis det giver mening.

Scripts skal skjule unødvendig driftskompleksitet, ikke skabe et nyt lag af kompleksitet.

Mulige formål:

- første setup
- start af udviklingsmiljø
- tests
- linting
- migrations
- backup og restore hvor relevant

Opret kun de scripts projektet faktisk har brug for.

## Langtidskørende processer

Hvis et script starter en dev-server eller anden langtidskørende proces i baggrunden, fx til Playwright-verifikation:

- Stop via hele procestræet, ikke en enkelt gemt PID. Wrapper-kommandoer som `uv run` spawner børneprocesser med andre PID'er, så en PID-fil rammer typisk kun wrapperen.
- Brug mønstermatch, fx `pkill -f 'manage.py runserver'` i et Django projekt.
- Ved uventet output efter en rettelse: udelukk først at en forældet kørende proces er årsagen, før fejlen antages at ligge i selve rettelsen.
