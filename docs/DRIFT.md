# Drift af efterskoler på hjemmeserveren

Et statisk site, der hostes på Jespers hjemmeserver. Denne fil fortæller, hvad du skal vide, før du ændrer noget i driften. Sitet deployes også til GitHub Pages fra main, de to kanaler serverer den samme kode.

## Sprog

Al kommunikation med Jesper foregår på dansk. Undgå tankestreger og bindestreger i almindelig tekst, brug komma eller punktum i stedet. Det gælder også commit beskeder, kommentarer i kode og dokumentation.

## Arbejdsgangen, fra ændring til kørende side

GitHub er den ene sandhed. Serveren henter derfra, den bygger ikke noget, du ikke har pushet.

```bash
git add -A && git commit -m "..."
git push
ssh server /srv/server/scripts/deploy.sh efterskoler
```

`deploy.sh` henter koden, bygger et nginx image med filerne i og genstarter containeren. Projektet har ingen `manage.py`, så migrationstrinnet springes over af sig selv. Til sidst tjekker scriptet, at siden svarer.

**Kør `deploy.sh` uden `sudo`.** GitHub nøglen ligger under brugeren `qvisty`, ikke under root, og med sudo fejler klonen med `Permission denied (publickey)`.

**Serveren kører `git reset --hard`.** Det er med vilje. En ændring, du laver direkte på serveren, overlever ikke næste deploy. Ret altid her og push.

**Rul tilbage** med en git ref: `deploy.sh efterskoler HEAD~1` eller et tag.

## Fire ting, der ikke må brydes

Bryder du et af dem, holder subdomænet op med at svare, og Caddy siger ikke hvorfor.

1. `compose.yml` i repoets rod har en service, der hedder **web**
2. Containeren hedder **`efterskoler-web`**
3. Den lytter på port **8000**
4. Den er på det eksterne Docker netværk **`web`**

Containeren må ikke have `ports:`. Den skal være usynlig udefra, kun Caddy når den.

## Hvem kan se siden

efterskoler er **privat** på serveren, det er valgt bevidst. Det betyder ikke skjult for Jesper. Hans egne computere og hans mobil åbner siden helt normalt, fordi de er på Tailscale. Alle andre i verden får intet svar overhovedet.

Bemærk at kortet samtidig ligger offentligt på GitHub Pages. Privat gælder kun udgaven på hjemmeserveren.

Tjek hvad der gælder lige nu:

```bash
ssh server /srv/server/scripts/adgang.sh efterskoler
```

**Instruktion til Claude Code:** skal udgaven på serveren gøres tilgængelig for andre end Jesper, så spørg ham først, og spørg med hans ord: skal den være **privat, kun mig**, eller **offentlig, hele internettet**. Privat er standard, og er han i tvivl, så vælg privat.

Vælger han offentlig, så nøjes ikke med `adgang.sh efterskoler offentlig`. Den kommando fjerner kun filteret i Caddy, og siden er stadig ikke tilgængelig udefra bagefter. Der skal også en DNS post til, portviderestilling i routeren og DDNS. De to sidste er engangsting, som kun skal gøres første gang. Fremgangsmåden står i `docs/offentlig-adgang.md` i [qvisty/Min-server](https://github.com/qvisty/Min-server).

## Ingen database og ingen hemmeligheder

Sitet er statisk. Der er ingen Django, ingen migrationer og ingen data uden for git.

`new-project.sh` opretter altid en database i den delte Postgres og skriver en `.env` med blandt andet `DATABASE_URL` og `SECRET_KEY`. Det er scriptets faste flow, og det gør ingen skade. Projektet bruger kun `PROJECT_NAME`, `REPO_URL` og `TZ` derfra, resten står ubrugt hen, samme mønster som et SQLite projekt, se `docs/kobling.md` i Min-server.

## Faldgruber, der gælder netop dette projekt

**`/sundhed/` skal blive.** nginx svarer `ok` på den sti, se `nginx.conf`. `deploy.sh` bruger den til at se, om et deploy lykkedes, og Uptime Kuma kan holde øje løbende. Samme konvention som Django projekterne.

**Cache busting sker i Dockerfilen, ikke i koden.** Ligesom Pages workflowet versionsstempler bygget script referencerne i `index.html`, så browsere ikke blander gammel js med ny html. Tilføjes en ny scriptfil, virker det af sig selv, mønstret rammer alle `.js` referencer.

**Containeren kører som brugeren nginx, ikke root.** Derfor basen `nginxinc/nginx-unprivileged`. Skal der ændres i imaget, så bevar det.

**Kun index.html, js/, data/ og vendor/ kommer med i imaget.** Dockerfilen kopierer dem eksplicit. En ny mappe med indhold til browseren skal tilføjes både der og i denne liste.

## Hvor tingene står

| Hvad | Hvor |
|---|---|
| Hvordan serveren fungerer | [qvisty/Min-server](https://github.com/qvisty/Min-server), start i `CLAUDE.md` |
| Arbejdsmetoden, PRD og arkitektur | dette repos `CLAUDE.md` og `docs/` |
| Logs, når noget fejler | `ssh server docker logs efterskoler-web --tail 50` |
| Siden på serveren | `https://efterskoler.srv.mitcv.com` |

Ændrer noget sig i, **hvordan projektet driftes**, hører det hjemme i Min-server. Kun projektets egen kode og beslutninger hører hjemme her.

## Før du melder noget færdigt

Sig ikke at noget virker, før du har målt det. Et grønt build betyder ikke, at siden svarer. `deploy.sh` slutter med at tjekke siden, og den linje er den, der tæller.
