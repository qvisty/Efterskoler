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
defaultOff  true for skoler der starter slået fra, fx lukkede skoler
note        kort note der vises i liste og popup, fx "Lukket sommeren 2026"
```

Derudover indeholder `data/grid.js` de genererede gitterpunkter til afstandslaget, se `docs/ARCHITECTURE.md`.

## Datakvalitet

- Skoleliste og koordinater er leveret af projektejeren 2026-09-04 og gælder som autoritativ kilde, se Task 003 i `docs/TASKS.md`
- Koordinaterne er på adresseniveau
- Hjemmesider er slået op på skolernes egne sider

## Persondata

Ingen. Alle felter er offentlige skoleoplysninger.
