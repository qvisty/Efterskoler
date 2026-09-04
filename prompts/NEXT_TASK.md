# Implementér næste task

Læs `CLAUDE.md` og alle relevante dokumenter i `docs/`.

Find den næste relevante TODO task i `docs/TASKS.md`.

Kontrollér først at tasken stadig stemmer overens med:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/ROADMAP.md`

Hvis der er en væsentlig konflikt eller et svært reversibelt valg, stop og forklar det før implementering.

Ellers:

1. Markér tasken `IN PROGRESS`.
2. Undersøg eksisterende kode og relevante patterns.
3. Implementér kun denne task.
4. Følg Gauntlet processen fra `CLAUDE.md`.
5. Kør relevante tests og andre kontroller.
6. Inspicér faktisk output hvor det er relevant.
7. Gennemgå `git diff`.
8. Ret den største resterende mangel hvis den forhindrer acceptkriterierne.
9. Markér først tasken `DONE` når Definition of Done er opfyldt.
10. Hvis tasken afsluttede den aktuelle milestone: flyt milestonens DONE tasks til `docs/TASKS_ARCHIVE.md`, og bekræft næste milestone mod `docs/ROADMAP.md` før den brydes ned i nye tasks.

Implementér ikke automatisk efterfølgende tasks.

Afslut med:

### Implementeret

### Verificeret

### Største kritikpunkt

### Ændrede filer

### Næste task
