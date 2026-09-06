/* Kort og togglepanel for ordblindeefterskolerne. Data kommer fra
   data/schools.js som definerer SCHOOLS. */

const REGION_ORDER = ["Nordjylland", "Midtjylland", "Syddanmark", "Fyn og øerne", "Sjælland"];

const map = L.map("map", { zoomControl: false });
L.control.zoom({ position: "topright" }).addTo(map);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  // crossOrigin gør at tiles kan tegnes i eksportcanvas uden at taint'e det.
  crossOrigin: "anonymous",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bidragydere',
}).addTo(map);

const allBounds = L.latLngBounds(SCHOOLS.map((s) => [s.lat, s.lng]));
map.fitBounds(allBounds, { padding: [40, 40] });

function markerStyle(school) {
  if (school.highlight) {
    return {
      radius: 11,
      color: "#8a2f08",
      weight: 2,
      fillColor: "#d9480f",
      fillOpacity: 0.95,
    };
  }
  return {
    radius: 8,
    color: "#123763",
    weight: 2,
    fillColor: "#1b4f9c",
    fillOpacity: 0.9,
  };
}

function popupHtml(school) {
  return (
    `<strong>${school.name}</strong>` +
    `<div class="popup-town">${school.town}</div>` +
    `<a href="${school.website}" target="_blank" rel="noopener">${school.website.replace(/^https?:\/\//, "")}</a>`
  );
}

const markers = new Map();
for (const school of SCHOOLS) {
  const marker = L.circleMarker([school.lat, school.lng], markerStyle(school))
    .bindTooltip(school.name, { direction: "top", offset: [0, -8] })
    .bindPopup(popupHtml(school));
  marker.addTo(map);
  markers.set(school.id, marker);
}

/* Afstandslag: gitterceller over Danmarks landareal, farvet efter afstand
   til nærmeste synlige skole. Gitteret kommer fra data/grid.js og tegnes
   som ét samlet canvas billede i et imageOverlay, så titusindvis af celler
   ikke koster noget ved pan og zoom.

   Findes data/traveltimes.js med precomputed køretider (Task 006), bruges
   minutter i bil i stedet for luftlinje km. */

const KM_BINS = [
  { max: 25, color: "#fee5d9", label: "under 25 km" },
  { max: 50, color: "#fcae91", label: "25 til 50 km" },
  { max: 75, color: "#fb6a4a", label: "50 til 75 km" },
  { max: 100, color: "#de2d26", label: "75 til 100 km" },
  { max: Infinity, color: "#a50f15", label: "over 100 km" },
];

const MIN_BINS = [
  { max: 30, color: "#fee5d9", label: "under 30 min" },
  { max: 60, color: "#fcae91", label: "30 til 60 min" },
  { max: 90, color: "#fb6a4a", label: "60 til 90 min" },
  { max: 120, color: "#de2d26", label: "90 til 120 min" },
  { max: Infinity, color: "#a50f15", label: "over 120 min" },
];

const travelMode =
  typeof TRAVELTIMES !== "undefined" &&
  TRAVELTIMES !== null &&
  Array.isArray(TRAVELTIMES.minutes) &&
  TRAVELTIMES.minutes.length === GRID.points.length;

if (typeof TRAVELTIMES !== "undefined" && TRAVELTIMES !== null && !travelMode) {
  console.warn("traveltimes.js matcher ikke grid.js, falder tilbage til luftlinje. Kør scripts/generate_traveltimes.mjs igen.");
}

const BINS = travelMode ? MIN_BINS : KM_BINS;
// Kolonneindeks pr. skole i TRAVELTIMES rækkerne.
const travelCol = travelMode
  ? new Map(TRAVELTIMES.schoolIds.map((id, i) => [id, i]))
  : null;

function haversineKm(lat1, lng1, lat2, lng2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

function binColor(value) {
  for (const bin of BINS) {
    if (value < bin.max) return bin.color;
  }
  return BINS[BINS.length - 1].color;
}

// Geometri for gitteret og canvas i web mercator y, så billedet ligger
// præcist når Leaflet strækker det mellem hjørnerne.
const grid = (() => {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const [lat, lng] of GRID.points) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  minLat -= GRID.latStep / 2;
  maxLat += GRID.latStep / 2;
  minLng -= GRID.lngStep / 2;
  maxLng += GRID.lngStep / 2;
  const cols = Math.round((maxLng - minLng) / GRID.lngStep);
  const rows = Math.round((maxLat - minLat) / GRID.latStep);
  // Opslag fra cellekoordinat til punktindeks, bruges af hover.
  const index = new Map();
  GRID.points.forEach(([lat, lng], i) => {
    const c = Math.floor((lng - minLng) / GRID.lngStep);
    const r = Math.floor((lat - minLat) / GRID.latStep);
    index.set(r * cols + c, i);
  });
  return { minLat, maxLat, minLng, maxLng, cols, rows, index };
})();

function mercY(lat) {
  return Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
}

const CANVAS_SCALE = 2;
const distanceCanvas = document.createElement("canvas");
distanceCanvas.width = grid.cols * CANVAS_SCALE;
distanceCanvas.height = grid.rows * CANVAS_SCALE;
const distanceCtx = distanceCanvas.getContext("2d");
const mercTop = mercY(grid.maxLat);
const mercRange = mercTop - mercY(grid.minLat);
const lngRange = grid.maxLng - grid.minLng;

map.createPane("distancePane");
map.getPane("distancePane").style.zIndex = 350;
const distanceOverlay = L.imageOverlay(
  distanceCanvas.toDataURL(),
  [
    [grid.minLat, grid.minLng],
    [grid.maxLat, grid.maxLng],
  ],
  { opacity: 0.55, pane: "distancePane", interactive: false }
);
let distanceLayerOn = false;

// Værdi for ét gitterpunkt: minutter i bil eller km i luftlinje, samt
// hvilken synlig skole der er nærmest.
function valueAt(pointIndex, active) {
  let min = Infinity;
  let nearest = null;
  const [lat, lng] = GRID.points[pointIndex];
  for (const s of active) {
    let v;
    if (travelMode) {
      v = TRAVELTIMES.minutes[pointIndex][travelCol.get(s.id)];
      if (v === null || v === undefined) continue;
    } else {
      v = haversineKm(lat, lng, s.lat, s.lng);
    }
    if (v < min) {
      min = v;
      nearest = s;
    }
  }
  return { min, nearest };
}

// Nøgletal: andel af landcellerne over 75 km, i køretidstilstand 90 min.
// Netop den grænse flytter sig mest i scenarierne uden de sydvestlige
// skoler og følger en intervalgrænse i legenden.
const STAT_THRESHOLD = BINS[BINS.length - 3].max;
const statEl = document.getElementById("stat");
const statValueEl = document.getElementById("stat-value");
const statLabelEl = document.getElementById("stat-label");
let statText = { value: "", label: "" };

function formatPct(share) {
  const pct = share * 100;
  const text = pct > 0 && pct < 10 ? pct.toFixed(1).replace(".", ",") : String(Math.round(pct));
  return `${text} %`;
}

function updateStat(countOver) {
  statText = {
    value: formatPct(countOver / GRID.points.length),
    label: travelMode
      ? `af Danmarks areal har over ${STAT_THRESHOLD} min i bil til nærmeste valgte skole`
      : `af Danmarks areal har over ${STAT_THRESHOLD} km i luftlinje til nærmeste valgte skole`,
  };
  statValueEl.textContent = statText.value;
  statLabelEl.textContent = statText.label;
}

function redrawDistanceCanvas() {
  const W = distanceCanvas.width;
  const H = distanceCanvas.height;
  const ctx = distanceCtx;
  ctx.clearRect(0, 0, W, H);
  const active = SCHOOLS.filter((s) => visible.has(s.id));
  const halfLat = GRID.latStep / 2;
  const halfLng = GRID.lngStep / 2;
  let countOver = 0;
  for (let i = 0; i < GRID.points.length; i++) {
    const [lat, lng] = GRID.points[i];
    const { min } = active.length ? valueAt(i, active) : { min: Infinity };
    if (min >= STAT_THRESHOLD) countOver++;
    ctx.fillStyle = binColor(min);
    const x = ((lng - halfLng - grid.minLng) / lngRange) * W;
    const w = (GRID.lngStep / lngRange) * W;
    const yTop = ((mercTop - mercY(lat + halfLat)) / mercRange) * H;
    const yBot = ((mercTop - mercY(lat - halfLat)) / mercRange) * H;
    // Lille overlap så der ikke opstår hairlines mellem cellerne.
    ctx.fillRect(x, yTop, w + 0.5, yBot - yTop + 0.5);
  }
  updateStat(countOver);
  distanceOverlay.setUrl(distanceCanvas.toDataURL());
}

// Gentegninger samles pr. frame, så fx vælg alle med 20 setVisible kald
// kun koster én gentegning og skoletoggles føles øjeblikkelige.
let redrawQueued = false;
function updateDistanceLayer() {
  if (!distanceLayerOn || redrawQueued) return;
  redrawQueued = true;
  requestAnimationFrame(() => {
    redrawQueued = false;
    if (distanceLayerOn) redrawDistanceCanvas();
  });
}

// Hover: én tooltip der følger musen over landceller.
const hoverTip = L.tooltip({ direction: "top", offset: [0, -8] });

function hoverText(latlng) {
  const c = Math.floor((latlng.lng - grid.minLng) / GRID.lngStep);
  const r = Math.floor((latlng.lat - grid.minLat) / GRID.latStep);
  const pointIndex = grid.index.get(r * grid.cols + c);
  if (pointIndex === undefined) return null;
  const active = SCHOOLS.filter((s) => visible.has(s.id));
  if (active.length === 0) return "Ingen skoler valgt";
  const { min, nearest } = valueAt(pointIndex, active);
  if (!nearest) return "Ingen rute fundet";
  return travelMode
    ? `${Math.round(min)} min i bil til ${nearest.name}`
    : `${Math.round(haversineKm(latlng.lat, latlng.lng, nearest.lat, nearest.lng))} km i luftlinje til ${nearest.name}`;
}

map.on("mousemove", (e) => {
  if (!distanceLayerOn) return;
  const text = hoverText(e.latlng);
  if (!text) {
    map.closeTooltip(hoverTip);
    return;
  }
  hoverTip.setLatLng(e.latlng).setContent(text);
  if (!map.hasLayer(hoverTip)) map.openTooltip(hoverTip);
});

map.on("mouseout", () => map.closeTooltip(hoverTip));

// Legend bygges ud fra de aktive intervaller.
const legendEl = document.getElementById("legend");
for (const bin of BINS) {
  const row = document.createElement("div");
  row.className = "legend-row";
  const swatch = document.createElement("span");
  swatch.className = "swatch";
  swatch.style.background = bin.color;
  row.append(swatch, bin.label);
  legendEl.appendChild(row);
}
const note = document.createElement("p");
note.className = "legend-note";
note.textContent = travelMode
  ? "Køretid i bil, beregnet på forhånd med OSRM."
  : "Afstand i luftlinje. Kørselsafstand er typisk 20 til 40 procent længere.";
legendEl.appendChild(note);

const mapInfoEl = document.getElementById("map-info");
document.getElementById("distance-toggle").addEventListener("change", (e) => {
  distanceLayerOn = e.target.checked;
  mapInfoEl.hidden = !distanceLayerOn;
  if (distanceLayerOn) {
    redrawDistanceCanvas();
    distanceOverlay.addTo(map);
  } else {
    map.removeLayer(distanceOverlay);
    map.closeTooltip(hoverTip);
  }
  updateHash();
});

const listEl = document.getElementById("school-list");
const countEl = document.getElementById("count");
const visible = new Set(SCHOOLS.map((s) => s.id));

function updateCount() {
  countEl.textContent = `${visible.size} af ${SCHOOLS.length} vist`;
}

function setVisible(school, on) {
  const marker = markers.get(school.id);
  const row = document.getElementById(`row-${school.id}`);
  const box = document.getElementById(`box-${school.id}`);
  if (on) {
    visible.add(school.id);
    marker.addTo(map);
    row.classList.remove("off");
  } else {
    visible.delete(school.id);
    map.removeLayer(marker);
    row.classList.add("off");
  }
  box.checked = on;
  updateCount();
  updateDistanceLayer();
  updateHash();
  refreshScenarioButtons();
}

for (const region of REGION_ORDER) {
  const schools = SCHOOLS.filter((s) => s.region === region);
  if (schools.length === 0) continue;

  const title = document.createElement("div");
  title.className = "region-title";
  title.textContent = region;
  listEl.appendChild(title);

  for (const school of schools) {
    const row = document.createElement("label");
    row.className = "school" + (school.highlight ? " highlight" : "");
    row.id = `row-${school.id}`;

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = true;
    box.id = `box-${school.id}`;
    box.addEventListener("change", () => setVisible(school, box.checked));

    const dot = document.createElement("span");
    dot.className = "dot";

    const text = document.createElement("span");
    text.innerHTML = `${school.name}<span class="town">${school.town}</span>`;

    row.append(box, dot, text);
    listEl.appendChild(row);
  }
}

updateCount();

/* Scenarieknapper: faste valg til præsentation, ét klik sætter
   skolevalget og tænder afstandslaget. */

const SCENARIOS = [
  { id: "idag", label: "I dag", uden: [] },
  { id: "uden-emmerske", label: "Uden Emmerske", uden: ["emmerske"] },
  {
    id: "uden-emmerske-store-andst",
    label: "Uden Emmerske og Store Andst",
    uden: ["emmerske", "store-andst"],
  },
];

const scenariosEl = document.getElementById("scenarios");
for (const scenario of SCENARIOS) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = `scenario-${scenario.id}`;
  btn.textContent = scenario.label;
  btn.addEventListener("click", () => applyScenario(scenario));
  scenariosEl.appendChild(btn);
}

function applyScenario(scenario) {
  const uden = new Set(scenario.uden);
  for (const school of SCHOOLS) {
    setVisible(school, !uden.has(school.id));
  }
}

function refreshScenarioButtons() {
  const hidden = SCHOOLS.filter((s) => !visible.has(s.id)).map((s) => s.id).sort().join();
  for (const scenario of SCENARIOS) {
    const btn = document.getElementById(`scenario-${scenario.id}`);
    btn.classList.toggle("active", hidden === [...scenario.uden].sort().join());
  }
}

refreshScenarioButtons();

document.getElementById("select-all").addEventListener("click", () => {
  for (const school of SCHOOLS) setVisible(school, true);
});

document.getElementById("select-none").addEventListener("click", () => {
  for (const school of SCHOOLS) setVisible(school, false);
});

const panel = document.getElementById("panel");
const panelToggle = document.getElementById("toggle-panel");

function setPanelOpen(open) {
  panel.classList.toggle("hidden", !open);
  panelToggle.setAttribute("aria-expanded", String(open));
}

panelToggle.addEventListener("click", () => {
  setPanelOpen(panel.classList.contains("hidden"));
});

// På små skærme er kortet det vigtigste, panelet starter sammenklappet
// og er ét tryk væk.
if (window.matchMedia("(max-width: 640px)").matches) {
  setPanelOpen(false);
}

/* Eksport: tegner kortets tiles, afstandslag og markører sammen i ét
   canvas med en infoboks og OpenStreetMap attribution, og downloader
   det som PNG. */

function drawInfoBox(ctx, mapWidth) {
  const pad = 12;
  const lineHeight = 17;
  const boxWidth = 300;
  const lines = [];
  const hiddenSchools = SCHOOLS.filter((s) => !visible.has(s.id));
  lines.push({ text: `${visible.size} af ${SCHOOLS.length} ordblindeefterskoler vist`, font: "12px sans-serif", color: "#5a6270" });
  if (hiddenSchools.length) {
    const names = hiddenSchools.map((s) => s.name).join(", ");
    lines.push({ text: `Uden: ${names}`, font: "12px sans-serif", color: "#5a6270", wrap: true });
  }

  // Grov linjeombrydning af lange linjer.
  const wrapped = [];
  ctx.font = "12px sans-serif";
  for (const line of lines) {
    if (!line.wrap || ctx.measureText(line.text).width <= boxWidth - 2 * pad) {
      wrapped.push(line);
      continue;
    }
    let current = "";
    for (const word of line.text.split(" ")) {
      const next = current ? `${current} ${word}` : word;
      if (ctx.measureText(next).width > boxWidth - 2 * pad && current) {
        wrapped.push({ ...line, text: current });
        current = word;
      } else {
        current = next;
      }
    }
    if (current) wrapped.push({ ...line, text: current });
  }

  const legendLines = distanceLayerOn ? BINS.length + 1 : 0;
  const statHeight = distanceLayerOn ? 44 : 0;
  const height =
    pad + 20 + wrapped.length * lineHeight + statHeight + legendLines * lineHeight + pad;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  ctx.strokeStyle = "#c6ccd4";
  ctx.beginPath();
  ctx.roundRect(12, 12, boxWidth, height, 10);
  ctx.fill();
  ctx.stroke();

  let y = 12 + pad + 8;
  ctx.fillStyle = "#1f2430";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("Ordblindeefterskoler i Danmark", 12 + pad, y);
  y += 20;

  for (const line of wrapped) {
    ctx.font = line.font;
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, 12 + pad, y);
    y += lineHeight;
  }

  if (distanceLayerOn) {
    y += 6;
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#d9480f";
    ctx.fillText(statText.value, 12 + pad, y + 6);
    y += 24;
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#5a6270";
    // Stat teksten er for lang til én linje, del den på "til".
    const cut = statText.label.indexOf(" til nærmeste");
    ctx.fillText(statText.label.slice(0, cut), 12 + pad, y);
    y += 14;
    ctx.fillText(statText.label.slice(cut + 1), 12 + pad, y);
    y += lineHeight;
    for (const bin of BINS) {
      ctx.fillStyle = bin.color;
      ctx.fillRect(12 + pad, y - 9, 16, 11);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
      ctx.strokeRect(12 + pad, y - 9, 16, 11);
      ctx.fillStyle = "#454c58";
      ctx.font = "11px sans-serif";
      ctx.fillText(bin.label, 12 + pad + 23, y);
      y += lineHeight;
    }
  }
  ctx.restore();

  // OpenStreetMap kræver attribution på gengivelser af deres tiles.
  ctx.font = "10px sans-serif";
  const attr = "© OpenStreetMap-bidragydere";
  const attrWidth = ctx.measureText(attr).width;
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillRect(mapWidth - attrWidth - 12, 0, attrWidth + 12, 16);
  ctx.fillStyle = "#454c58";
  ctx.fillText(attr, mapWidth - attrWidth - 6, 11);
}

function buildExportCanvas() {
  map.closeTooltip(hoverTip);
  const container = map.getContainer();
  const rect = container.getBoundingClientRect();
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.fillStyle = "#dddddd";
  ctx.fillRect(0, 0, rect.width, rect.height);

  const drawElement = (el) => {
    const r = el.getBoundingClientRect();
    ctx.drawImage(el, r.left - rect.left, r.top - rect.top, r.width, r.height);
  };

  for (const tile of container.querySelectorAll("img.leaflet-tile")) {
    if (tile.complete && tile.naturalWidth > 0) drawElement(tile);
  }
  for (const overlay of container.querySelectorAll("img.leaflet-image-layer")) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    drawElement(overlay);
    ctx.restore();
  }

  // Markørerne tegnes direkte i stedet for at rastere Leaflets SVG pane,
  // som placeres upræcist ved serialisering.
  for (const school of SCHOOLS) {
    if (!visible.has(school.id)) continue;
    const p = map.latLngToContainerPoint([school.lat, school.lng]);
    const style = markerStyle(school);
    ctx.beginPath();
    ctx.arc(p.x, p.y, style.radius, 0, 2 * Math.PI);
    ctx.fillStyle = style.fillColor;
    ctx.globalAlpha = style.fillOpacity;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = style.weight;
    ctx.strokeStyle = style.color;
    ctx.stroke();
  }

  drawInfoBox(ctx, rect.width);
  return canvas;
}

function exportImage() {
  const btn = document.getElementById("export-btn");
  btn.disabled = true;
  try {
    const canvas = buildExportCanvas();
    canvas.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "ordblindeefterskoler-kort.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 10000);
      btn.disabled = false;
    }, "image/png");
  } catch (err) {
    btn.disabled = false;
    console.error(err);
    alert("Kortet kunne ikke gemmes som billede i denne browser. Tag i stedet et screenshot.");
  }
}

document.getElementById("export-btn").addEventListener("click", exportImage);

/* Delbar visning: fravalgte skoler og afstandslagets tilstand ligger i
   URL hashen, fx #uden=emmerske,store-andst&afstand=1, så et scenarie
   kan deles som link. */

function updateHash() {
  const uden = SCHOOLS.filter((s) => !visible.has(s.id)).map((s) => s.id);
  const parts = [];
  if (uden.length) parts.push("uden=" + uden.join(","));
  if (distanceLayerOn) parts.push("afstand=1");
  history.replaceState(
    null,
    "",
    parts.length ? "#" + parts.join("&") : location.pathname + location.search
  );
}

function applyHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  const uden = new Set((params.get("uden") || "").split(",").filter(Boolean));
  for (const school of SCHOOLS) {
    setVisible(school, !uden.has(school.id));
  }
  const wantLayer = params.get("afstand") === "1";
  const toggle = document.getElementById("distance-toggle");
  if (toggle.checked !== wantLayer) {
    toggle.checked = wantLayer;
    toggle.dispatchEvent(new Event("change"));
  }
}

window.addEventListener("hashchange", applyHash);
applyHash();
