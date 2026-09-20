# Statisk site, serveres af nginx. Bygges på serveren, ikke i GitHub
# Actions, jf. Min-server docs/server.md afsnit 6.
#
# Den unprivileged variant kører som brugeren nginx, aldrig som root,
# og kan derfor lytte på 8000 uden videre.

FROM nginxinc/nginx-unprivileged:1.28-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kun det browseren skal bruge. chown fordi cache bustingen herunder
# skriver i index.html, og imaget kører som brugeren nginx, ikke root.
COPY --chown=nginx:nginx index.html /usr/share/nginx/html/
COPY --chown=nginx:nginx js /usr/share/nginx/html/js
COPY --chown=nginx:nginx data /usr/share/nginx/html/data
COPY --chown=nginx:nginx vendor /usr/share/nginx/html/vendor

# Samme kneb som i Pages workflowet: versionsstempler script referencerne,
# så browsere aldrig blander cached js fra et tidligere deploy med ny
# index.html. Byggetidspunktet er versionen.
RUN sed -i "s/\.js\"/.js?v=$(date +%s)\"/g" /usr/share/nginx/html/index.html

EXPOSE 8000
