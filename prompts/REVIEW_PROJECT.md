# Helhedsreview af projektet

Læs `CLAUDE.md`, alle dokumenter i `docs/` og den aktuelle kodebase.

Foretag et kritisk review af projektets nuværende tilstand.

Du skal ikke automatisk implementere ændringer.

Vurder:

1. Om produktet stadig matcher `PRD.md`.
2. Om MVP scope er tydeligt og realistisk.
3. Om den valgte stack stadig er den simpleste robuste løsning.
4. Om der er kommet unødvendig teknologisk kompleksitet.
5. Om databasevalget stadig er passende.
6. Om SQLite kunne være tilstrækkeligt hvis en mere kompleks database er valgt.
7. Om Supabase bruges målrettet uden overlappende services.
8. Om traditionel PostgreSQL kun bruges hvis der er et reelt behov.
9. Om Docker er introduceret uden tilstrækkelig grund.
10. Hvis Django bruges, om SaaS Pegasus funktionalitet genbruges hensigtsmæssigt frem for at blive duplikeret.
11. Om arkitekturen har klare ansvarsområder uden overengineering.
12. Om permissions og sikkerhed håndhæves server-side.
13. Om kritisk business logic er testbar.
14. Om tests dækker de vigtigste workflows og fejlscenarier.
15. Om der er tydelig teknisk gæld.
16. Om roadmap og tasks afspejler den faktiske retning.
17. Om dokumentation og kode er i konflikt.
18. Om deployment, backups og observability passer til projektets reelle modenhed.

Find derefter de fem vigtigste forbedringer, rangeret efter effekt og risiko.

For hver forbedring angives:

- problem
- konsekvens
- anbefaling
- størrelse: S / M / L
- risiko ved ændringen: lav / medium / høj
- om den bør udføres nu eller senere

Afslut med én samlet anbefaling:

- FORTSÆT SOM PLANLAGT
- JUSTÉR FØR NÆSTE FEATURE
- STOP OG RET FUNDAMENTET

Begrund valget kort.
