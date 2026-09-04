# Database design

## Status

**Database:** INGEN. Data ligger i en statisk JavaScript fil.

## Beslutningsgrundlag

- datasættet er ca. 20 ordblindeefterskoler
- data ændrer sig sjældent, skoler åbner og lukker ikke ofte
- ingen brugere, ingen skrivninger fra frontend
- ingen samtidighed, ingen realtime
- backup er git

## Kandidater

### SQLite

**Status:** FRAVALGT

En database, selv SQLite, kræver serverlogik for at blive læst fra en browser. Sitet er rent statisk, så selv den simpleste database er mere end nødvendigt.

### Supabase og traditionel PostgreSQL

**Status:** FRAVALGT

Ingen managed services er nødvendige for 20 statiske records.

## Valgt løsning

**Database:** Statisk fil, `data/schools.js`, versionsstyret i git.

**Hvorfor:** Simplest mulige løsning der opfylder behovet. Kan senere konverteres til GeoJSON eller importeres i en database uden tab, hvis behovet opstår.

## Datamodel

### School

Én record pr. ordblindeefterskole i `data/schools.js`:

```text
id          stabil slug, fx "emmerske"
name        skolens navn
town        by eller område
region      landsdel til gruppering i panelet
lat, lng    WGS84 koordinater
website     skolens hjemmeside
highlight   true for Emmerske Efterskole
```

## Datakvalitet

- Kilden er foreningen Ordblindeefterskolerne, ordbl.dk, som har 20 medlemsskoler, suppleret med søgeresultater, da direkte opslag ikke var muligt fra udviklingsmiljøet
- Koordinater er sat ud fra skolernes by og område, ikke ud fra opslag på den præcise adresse. Præcisionen er typisk inden for 1 til 2 km, hvilket er nok til et Danmarkskort, men de skal verificeres, se task i `docs/TASKS.md`
- Skrødstrup Efterskoles medlemskab af foreningen skal verificeres, skolen er markeret med `verified: false` i datasættet

## Persondata

Ingen. Alle felter er offentlige skoleoplysninger.
