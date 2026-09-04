# Product requirements document

## Produkt

**Navn:** Ordblindeefterskoler i Danmark, interaktivt kort

**Version:** 0.1

**Status:** I arbejde

## Problem

Emmerske Efterskole ved Tønder er den eneste ordblindeefterskole i Sydvestdanmark. Hvis skolen lukker, får ordblinde elever i Tønder og omegn markant længere til nærmeste tilbud. Det er svært at kommunikere den konsekvens uden et visuelt overblik over, hvor ordblindeefterskolerne faktisk ligger, og hvor langt der er imellem dem.

Produktet skal understøtte kommunikationen om, at en lukning af Emmerske Efterskole vil efterlade et stort geografisk hul for ordblinde unge i Sydvestdanmark.

## Målsætning

Produktet skal gøre det muligt at:

1. se alle ordblindeefterskoler i Danmark på et interaktivt kort
2. slå de enkelte skoler til og fra i visningen, fx for at vise kortet uden Emmerske
3. senere vise en farvelægning af Danmark efter kørselsafstand til nærmeste ordblindeefterskole

## Ikke mål

Produktet skal i første version ikke:

- beregne reelle kørselstider, afstandslaget bruger luftlinje indtil en precomputed kørselstidsløsning er på plads
- have login, brugere eller administration
- have backend eller database
- vise andre skoletyper end ordblindeefterskoler

## Brugere

### Primær bruger

**Type:** Personer der arbejder for at bevare Emmerske Efterskole, fx bestyrelse, forældre og lokale kræfter, som skal bruge kortet i kommunikation med presse, politikere og offentlighed.

Behov:

- et troværdigt og letforståeligt Danmarkskort
- hurtigt at kunne vise scenariet med og uden Emmerske
- at kunne vise kortet på storskærm og dele det som link eller screenshot

### Sekundær bruger

Modtagerne af kommunikationen, fx journalister og beslutningstagere, som selv skal kunne udforske kortet.

## Centrale brugerrejser

### Journey 1: Vis hullet efter Emmerske

1. brugeren åbner kortet og ser alle ordblindeefterskoler
2. brugeren slår Emmerske Efterskole fra i listen
3. kortet viser nu tydeligt, at Sydvestdanmark står uden en ordblindeefterskole

Acceptkriterier:

- [x] alle skoler vises som markører på et Danmarkskort
- [x] hver skole kan slås til og fra enkeltvis
- [x] Emmerske Efterskole er visuelt fremhævet, så scenariet er let at demonstrere

### Journey 2: Udforsk en skole

1. brugeren klikker på en markør
2. brugeren ser skolens navn og by

Acceptkriterier:

- [x] klik på markør viser navn og by
- [x] listen og kortet stemmer altid overens

## Funktionelle krav

### Must have

#### F1. Interaktivt Danmarkskort med alle ordblindeefterskoler

Kortet viser de ca. 20 ordblindeefterskoler som markører med navn og by i popup.

Acceptkriterier:

- [x] kortet åbner centreret på Danmark
- [x] alle skoler i datasættet vises som markører
- [x] popup viser navn og by

#### F2. Toggle af enkelte skoler

En panelliste viser alle skoler med checkbokse. En skole der slås fra forsvinder fra kortet med det samme. Knapper til vælg alle og fravælg alle.

Acceptkriterier:

- [x] hver skole kan slås til og fra enkeltvis
- [x] vælg alle og fravælg alle virker
- [x] Emmerske er fremhævet i både liste og kort

#### F3. Afstandslag

Et togglebart lag der farvelægger Danmarks landareal efter afstand til nærmeste synlige skole. Laget genberegnes øjeblikkeligt, når skoler slås til og fra, så scenarier som "uden Emmerske og Store Andst" kan vises direkte. Første version bruger luftlinjeafstand og siger det tydeligt i legenden.

Acceptkriterier:

- [x] laget kan tændes og slukkes uafhængigt, og kortet uden laget er uændret
- [x] farvelægningen følger kun de synlige skoler og opdateres ved toggle
- [x] legend med afstandsintervaller og tydelig markering af at det er luftlinje
- [x] hover på et område viser afstand og nærmeste synlige skole

#### F4. Delbare scenarie links

Fravalgte skoler og afstandslagets tilstand ligger i URL hashen, fx `#uden=emmerske,store-andst&afstand=1`, så et scenarie kan deles som link.

Acceptkriterier:

- [x] et delt link åbner direkte i scenariet
- [x] standardvisningen har en ren URL

### Should have

- reel kørselstid i stedet for luftlinje, precomputed, se roadmap fase 2

### Could have

- scenariesammenligning side om side, med og uden Emmerske

## UX krav

- skal fungere på både desktop og mobil, desktop er primær ved præsentationer
- panelet må ikke skjule kortet på små skærme
- dansk sprog i hele fladen
- læsbar for målgruppen, produktet handler om ordblindhed, så hold tekstmængden lav og typografien tydelig

## Sikkerhed og persondata

Ingen persondata. Alle data er offentligt tilgængelige skoleoplysninger. Ingen authentication. Statisk site uden serverlogik.

## Success metrics

Produktet anses som succesfuldt når:

1. kortet kan demonstrere scenariet med og uden Emmerske på under 10 sekunder
2. datasættet dækker alle ordblindeefterskoler i foreningen Ordblindeefterskolerne
3. kortet kan deles som simpelt link, fx via GitHub Pages

## MVP

MVP består af:

1. statisk side med Leaflet kort over Danmark
2. datasæt med alle ordblindeefterskoler, navn, by og koordinater
3. togglepanel med enkeltvalg, vælg alle og fravælg alle
4. fremhævning af Emmerske Efterskole

Alt andet udsættes.

## Åbne spørgsmål

- Skolernes koordinater er sat ud fra bynavne og skal verificeres mod faktiske adresser, se task i `docs/TASKS.md`
- Skal afstandsanalysen i fase 2 bruge kørselsafstand via en routing service, fx OSRM, eller er fugleflugtsafstand godt nok til kommunikationen? Kørselsafstand er ønsket, men kræver en ekstern service eller en engangsberegning
- Endelig hosting, GitHub Pages er den oplagte kandidat
