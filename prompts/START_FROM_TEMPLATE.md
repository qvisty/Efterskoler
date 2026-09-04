# Start nyt projekt fra denne template

Jeg har oprettet dette repository fra `ai-project-starter` templaten.

Jeg vil bygge følgende produkt:

[INDSÆT DIN PROJEKTIDÉ HER — brug gerne skabelonen i `prompts/PROJEKTIDE.md` til at beskrive den systematisk]

Din opgave er først at gøre repositoryet implementeringsklart og derefter hjælpe mig med at bygge produktet iterativt.

## Før du gør noget andet

1. Læs `AGENTS.md`, hvis den findes.
2. Læs `CLAUDE.md`.
3. Læs alle relevante filer i `docs/`.
4. Undersøg repositoryets nuværende indhold.
5. Bevar og forbedr starterens arbejdsmetode frem for at erstatte den med en ny proces.

Du må ikke begynde at implementere produktkode endnu.

## Hvis projektidéen er tynd

`prompts/PROJEKTIDE.md` indeholder de systematiske spørgsmål en god projektbeskrivelse besvarer: problem, målgruppe, vigtigste arbejdsgange, referencer, ikke-mål, rammer, succeskriterier og åbne spørgsmål.

Hvis min beskrivelse ovenfor lader væsentlige af disse spørgsmål stå ubesvarede, så stil de vigtigste af dem som opklarende spørgsmål, før MVP og teknologivalg fastlægges:

- Prioritér spørgsmål om problemet, målgruppen og de vigtigste arbejdsgange. Stil højst 5-6 spørgsmål ad gangen, og markér hvilke der er vigtigst.
- Spørg om produktet og problemet — ikke om stack. Vær opmærksom på forklædte stackspørgsmål: spørg om brugskontekst ("står du med telefonen i kælderen?"), ikke om teknologi ("skal det være en mobilapp?").
- Gæt ikke på svar jeg ikke har givet. Du må gerne fremlægge din foreløbige forståelse som en hypotese jeg kan bekræfte eller korrigere — men træf ingen beslutninger på baggrund af den.
- I dette tilfælde består dit første svar kun af punkt 1-3 fra "Dit første svar" nedenfor (forståelse, brugerbehov, åbne spørgsmål) plus de opklarende spørgsmål. Resten af punkterne leveres, når spørgsmålene er besvaret.
- Opdater ikke dokumenterne i `docs/`, før afklaringen er på plads.

## Første fase: forstå og planlæg

Gør projektet implementeringsklart i denne rækkefølge:

1. Forstå problemet og det ønskede produkt.
2. Identificér primære brugere og vigtigste brugerrejser.
3. Find uklarheder, skjulte antagelser og risici.
4. Definér et realistisk MVP og tydelige ikke mål.
5. Undersøg faktiske referencer, hvis jeg har nævnt eksisterende produkter, screenshots, designs, dokumentation eller API'er.
6. Sammenlign relevante teknologistacks.
7. Anbefal den simpleste robuste løsning.
8. Vælg database ud fra projektets faktiske behov.
9. Vælg udviklingsmiljø og vurder eksplicit om Docker overhovedet er nødvendigt.
10. Udfyld eller opdater `docs/PRD.md`.
11. Udfyld eller opdater `docs/ARCHITECTURE.md`.
12. Udfyld eller opdater `docs/DATABASE.md`.
13. Udfyld eller opdater `docs/ROADMAP.md`.
14. Omdan første milestone til små verificerbare tasks i `docs/TASKS.md`.

Trin 10-14 udføres først, når de vigtigste åbne spørgsmål er afklaret med mig, og jeg har godkendt retningen. Docs-skabelonernes struktur er vejledende: tilpas sektioner og slet felter der ikke er relevante for projektet.

## Teknologipræferencer

Teknologi skal vælges ud fra produktfit, ikke vane.

Mine præferencer er:

- Python er positivt, når det passer til problemet.
- Django er en stærk præference til klassiske webapplikationer og SaaS, men ikke et krav.
- Hvis Django vælges til et nyt projekt, skal SaaS Pegasus vurderes som foretrukket udgangspunkt.
- Jeg har lifetime adgang til SaaS Pegasus.
- Hvis SaaS Pegasus anbefales, skal du undersøge den aktuelle Pegasus dokumentation og hjælpe mig med at vælge den konkrete projektopsætning før projektet genereres.
- Aktivér kun Pegasus funktioner der løser et konkret behov.

Andre stacks må og skal vælges, hvis de passer bedre til projektet.

## Databasepræference

Hold databasen så enkel som muligt.

Vurder som udgangspunkt i denne rækkefølge:

1. SQLite, hvis den kan løse opgaven robust.
2. Supabase, hvis managed database eller Supabase tjenester giver reel værdi.
3. Traditionel PostgreSQL, hvis kravene gør det nødvendigt.
4. Andet, hvis et konkret teknisk behov taler for det.

Supabase skal vurderes både som managed PostgreSQL og separat som platform med fx Auth, Storage og Realtime.

Undgå overlappende systemer. Hvis applikationen selv håndterer authentication, skal Supabase Auth ikke tilføjes uden en konkret grund.

## Udviklingsmiljø

Jeg foretrækker et enkelt native udviklingsmiljø.

Foretrukken rækkefølge:

1. Native udvikling.
2. Managed services.
3. Docker til enkelte services.
4. Fuld Docker opsætning.

Docker må vælges hvis det løser et konkret problem, men det skal begrundes.

Hvis et projekt kan køre enkelt uden Redis, Celery, containere eller andre ekstra services, skal de ikke introduceres.

## Arbejdsmetode

Arbejd i små, verificerbare dele.

Målestokken skal skaffes, ikke antages.

Når implementeringen senere starter, brug dette loop for hver væsentlig task:

Krav
→ implementering
→ faktisk output
→ tests
→ kritisk review
→ største resterende mangel
→ forbedring
→ ny evaluering

En task er færdig når acceptkriterierne og Definition of Done er opfyldt. Fortsæt ikke med kosmetiske forbedringer uden reel værdi.

Undgå overengineering og hypotetiske fremtidige behov.

## Beslutningskompetence

Du må selv træffe små og reversible tekniske beslutninger.

Stop og præsenter alternativer og din anbefaling før beslutninger der:

- fundamentalt ændrer arkitekturen
- skaber betydelig leverandørafhængighed
- er dyre at ændre senere
- ændrer datamodellen fundamentalt
- væsentligt påvirker brugeroplevelsen
- medfører væsentlige nye driftsomkostninger eller services

## Dit første svar

Er projektidéen tynd, gælder afsnittet "Hvis projektidéen er tynd" ovenfor: levér kun punkt 1-3 plus de opklarende spørgsmål, og resten efter mine svar. Ellers:

Start med:

1. Din forståelse af produktet.
2. De vigtigste brugerbehov.
3. De vigtigste åbne spørgsmål.
4. Dit forslag til MVP.
5. To til fire realistiske teknologistacks.
6. En kort sammenligning af dem.
7. Din anbefalede stack og hvorfor.
8. Dit anbefalede databasevalg og hvorfor.
9. Dit anbefalede udviklingsmiljø og om Docker er nødvendigt.
10. De største tekniske risici.
11. Den foreslåede første milestone.
12. Hvilke dokumenter du vil opdatere.

Punkt 4-11 er foreløbige forslag: markér dem som sådan, og lås dem først når de åbne spørgsmål fra punkt 3 er besvaret. Har jeg markeret noget som "ved ikke", så foreslå en begrundet default og bed om min accept i stedet for at gætte.

I det første svar er vurderinger ud fra projektets behov nok. Faktiske referencer og aktuel dokumentation, fx SaaS Pegasus, undersøges i planlægningsfasen, før valgene låses endeligt — og sig eksplicit, hvad du endnu ikke har undersøgt.

Hvis Django anbefales, skal du også give en foreløbig vurdering af SaaS Pegasus og hvilke Pegasus funktioner der sandsynligvis er relevante.

Vent med implementeringen til planlægningsfasen er gennemført og væsentlige valg er afklaret.
