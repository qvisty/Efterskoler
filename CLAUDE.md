# CLAUDE.md

## Formål

Dette repository bruger en fast arbejdsmetode til AI-assisteret softwareudvikling. Optimér for et robust, enkelt og vedligeholdeligt produkt, ikke for størst mulig mængde kode.

Læs altid før større ændringer:

1. `docs/PRD.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DATABASE.md`
4. `docs/ROADMAP.md`
5. `docs/TASKS.md`

Dokumenterne er projektets source of truth. Hvis dokumentation og kode er i konflikt, identificér konflikten eksplicit og gæt ikke.

## Grundprincipper

### Forstå før du bygger

Før implementering skal du:

1. læse relevant dokumentation
2. undersøge eksisterende kode og repositorystruktur
3. finde eksisterende patterns og abstraheringer
4. identificere afhængigheder og risici
5. undersøge om funktionalitet allerede findes og kan genbruges

Implementér ikke parallel funktionalitet uden en konkret grund.

### Start simpelt

Tilføj kun teknologi, abstraktioner og infrastruktur når de løser et konkret problem. YAGNI gælder. Foretræk reversible beslutninger.

## Teknologivalg

Teknologistakken er ikke fastlagt på forhånd.

Vurder blandt andet:

- produktfit
- enkelhed
- udviklingshastighed
- brugeroplevelse
- datamodel
- sikkerhed
- authentication og authorization
- integrationsbehov
- realtimebehov
- drift og deployment
- vedligeholdelse
- eksisterende kompetencer
- leverandørafhængighed
- realistisk skalering

Vælg ikke en stack alene fordi den er moderne eller almindelig.

### Python og Django

Python er en præference når det passer naturligt til opgaven.

Django er en stærk præference ved applikationer med relationelle data, authentication, roller og permissions, administration, CRUD workflows, formularer, dashboards, organisationer, teams eller klassiske SaaS funktioner.

Django er ikke et krav. Hvis en anden stack passer bedre, skal den vælges og begrundes.

## Django og SaaS Pegasus

Hvis Django vælges som primær webplatform, skal SaaS Pegasus vurderes som foretrukket udgangspunkt for et nyt projekt.

Projektets ejer har lifetime adgang til SaaS Pegasus.

Start derfor ikke automatisk et tomt Django projekt.

Før et nyt Pegasus projekt genereres:

1. undersøg den aktuelle SaaS Pegasus dokumentation og projektgenerator
2. undersøg aktuelle CLI, skills og agentfunktioner hvis de findes
3. vurder hvilke Pegasus funktioner projektet faktisk har brug for
4. vurder hvilke funktioner der bør fravælges
5. præsenter den anbefalede opsætning før væsentlige eller svært reversible valg gennemføres

Vurder som minimum:

- frontendarkitektur
- UI og CSS setup
- build tool
- authentication
- teams
- subscriptions og betaling
- API
- background jobs
- async eller realtime
- email
- AI funktioner
- database
- lokal udvikling
- deployment
- monitoring og logging

Antag ikke at Pegasus konfigurationsmuligheder er de samme som tidligere versioner. Genbrug Pegasus funktionalitet frem for at bygge parallelle løsninger.

## Databaseprincip

Hold databaseløsningen så enkel som muligt.

Foretrukken vurderingsrækkefølge:

1. SQLite
2. Supabase
3. traditionel PostgreSQL
4. anden database ved konkret behov

### SQLite

SQLite skal vurderes først. Fravælg ikke SQLite alene fordi projektet skal i produktion.

Vælg SQLite når det realistisk kan understøtte datamængde, samtidige brugere, write belastning, relationer, backup, deployment og drift.

### Supabase

Vurder Supabase når en managed løsning giver reel værdi.

Skeln mellem:

1. Supabase som managed PostgreSQL database
2. Supabase som samlet platform med Auth, Storage, Realtime, Edge Functions og lignende

Vurder hver Supabase komponent separat. Undgå overlappende ansvar, fx Django authentication plus Supabase Auth uden konkret behov.

### Traditionel PostgreSQL

Vælg traditionel PostgreSQL når der er et konkret teknisk eller driftsmæssigt behov, fx høj samtidighed, høj write belastning, avancerede databasefunktioner, særlige extensions, større datamængder eller særlige transaktionskrav.

"Det er best practice" er ikke alene en tilstrækkelig begrundelse.

Dokumentér beslutningen i `docs/DATABASE.md`.

## Udviklingsmiljø

Foretræk et enkelt native udviklingsmiljø.

Docker er ikke standardvalget.

Foretrukken rækkefølge:

1. native development environment
2. managed eksterne services
3. Docker til enkelte services
4. full Docker development environment

Ved Python projekter foretrækkes som udgangspunkt en moderne Python version, `uv`, `.venv` og `pyproject.toml`.

Før Docker introduceres, beskriv:

1. hvilket konkret problem Docker løser
2. alternativet uden Docker
3. den ekstra kompleksitet Docker introducerer
4. om Docker er nødvendigt i development, production eller begge

Hvis Docker bruges, automatisér start, stop, logs, tests, migrations og relevante backups.

## Arkitektur

Vælg den simpleste arkitektur der robust opfylder kravene. Undgå unødvendige lag og patterns.

Kompleks business logic skal være testbar og må ikke gemmes i UI lag.

Hvis Django vælges:

- brug meningsfulde domæneapps
- hold views relativt tynde
- brug services til komplekse state changes når det forbedrer strukturen
- brug selectors til komplekse read queries når det giver værdi
- brug database constraints og relevante indexes
- undgå N+1 queries
- håndhæv permissions server-side

Disse er principper, ikke krav om unødvendige abstraktioner.

## API

Design API first når funktionalitet realistisk skal genbruges af flere klienter eller integrationer. Opret ikke et API lag uden konkret behov.

## Sikkerhed

Kontrollér relevante områder som authentication, authorization, object ownership, input validation, CSRF hvor relevant, filadgang, IDOR, persondata, secrets og logging af følsomme data.

Secrets må aldrig commits.

## Tests

Ved ny funktionalitet skal som minimum overvejes:

1. happy path
2. invalid input
3. permissions
4. edge cases
5. relevante business rules

En bugfix bør så vidt muligt have en regressionstest.

## Små verificerbare tasks

Store opgaver skal opdeles i dele der kan implementeres, testes og vurderes selvstændigt og har tydelige acceptkriterier.

`docs/TASKS.md` er den aktive arbejdsplan. Implementér som udgangspunkt kun én aktiv task ad gangen.

## Gauntlet processen

For hver væsentlig implementeringsdel:

1. fastlæg målestokken
2. implementér løsningen
3. test løsningen
4. inspicér faktisk output
5. evaluer kritisk
6. identificér den største resterende mangel
7. ret manglen
8. gentag indtil acceptkriterierne er opfyldt

### Udelukk forældede processer før fejlsøgning

Hvis faktisk output ikke afspejler en rettelse, så udelukk først at en forældet langtidskørende proces er årsagen, fx en dev-server startet i baggrunden, før fejlen antages at ligge i selve rettelsen.

Genstart processen på en måde der rammer hele procestræet. Wrapper-kommandoer som `uv run` spawner børneprocesser med andre PID'er, så et kill på en enkelt gemt PID rammer typisk kun wrapperen. Brug mønstermatch, fx `pkill -f 'manage.py runserver'` i et Django projekt.

### Målestokken skal skaffes, ikke antages

Hvis opgaven henviser til et eksisterende produkt, design, screenshot, dokument, API eller anden ekstern reference, skal den faktiske reference undersøges først når det er muligt.

Hvis referencen ikke kan tilgås, sig det eksplicit. Sammenlign ikke blindt med noget der kun er beskrevet.

### Kritikerrollen

Ved større funktioner skal resultatet vurderes kritisk mod faktisk output, acceptkriterier, edge cases, arkitektur, tests, brugeroplevelse og sikkerhed.

Kritikken skal være konkret og handlingsanvisende. Ros er ikke et mål. Undgå samtidig uendelige loops med kosmetiske forbedringer.

## Definition of done

En task er først færdig når:

- acceptkriterierne er opfyldt
- relevante tests består
- eksisterende relevante tests stadig består
- relevante migrations eller schemaændringer fungerer
- sikkerhed og permissions er vurderet
- væsentlige fejlscenarier er håndteret
- dokumentation er opdateret når nødvendigt
- debug kode og dead code er fjernet
- diff er gennemgået
- løsningen er kritisk evalueret

## Git

Foretag fokuserede ændringer. Undgå at blande unrelated refactoring, features og formatting uden grund.

Før større ændringer:

```bash
git status
```

Efter ændringer:

```bash
git diff
```

Gennemgå diff før tasken markeres færdig.

## Opgavestyring

Tilladte statusser i `docs/TASKS.md`:

- TODO
- IN PROGRESS
- BLOCKED
- REVIEW
- DONE

Nye opdagede tasks må registreres, men scope udvides ikke automatisk.

Små, trivielle tasks må registreres i kort form: navn, status, formål, acceptkriterier og resultat i få linjer. Brug kun det fulde taskformat når opgavens størrelse berettiger det.

Når en milestone er afsluttet, flyttes dens DONE tasks til `docs/TASKS_ARCHIVE.md`, så `docs/TASKS.md` forbliver kort og kun indeholder den aktive plan.

## Vigtige beslutninger

Ved beslutninger der fundamentalt påvirker arkitekturen, skaber betydelig leverandørafhængighed, er dyre at ændre senere, ændrer datamodellen fundamentalt, væsentligt ændrer brugeroplevelsen eller skaber væsentlige driftsomkostninger, skal alternativer og anbefaling præsenteres før implementering.

Mindre reversible tekniske beslutninger må træffes selvstændigt og dokumenteres kort.

## Afslutning på en implementeringsrunde

Rapportér kort:

### Implementeret

### Verificeret

### Største kritikpunkt

### Ændrede filer

### Næste task

## Stackspecifikke sektioner

Denne fil er en permanent metodefil og må ikke erstattes eller omskrives af `/init` eller lignende værktøjer.

Hvis `/init` køres, eller en agent vil dokumentere kommandoer og arkitektur i denne fil, skrives indholdet ind i de to sektioner nedenfor. Resten af filen bevares uændret.

## Kommandoer

Udfyldes når stacken er valgt: setup, start af udviklingsmiljø, tests, lint, migrations og andre daglige kommandoer.

## Arkitektur i denne kodebase

Udfyldes når stacken er valgt: valgt stack, overordnet struktur og de vigtigste patterns. Detaljer hører hjemme i `docs/ARCHITECTURE.md`; her står kun det en agent skal vide for at arbejde effektivt i kodebasen.
