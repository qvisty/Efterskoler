/* Kort og togglepanel for ordblindeefterskolerne. Data kommer fra
   data/schools.js som definerer SCHOOLS. */

const REGION_ORDER = ["Nordjylland", "Midtjylland", "Syddanmark", "Fyn og øerne", "Sjælland"];

const map = L.map("map", { zoomControl: false });
L.control.zoom({ position: "bottomright" }).addTo(map);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
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
   i luftlinje til nærmeste synlige skole. Gitteret kommer fra data/grid.js. */

const DISTANCE_BINS = [
  { max: 25, color: "#fee5d9" },
  { max: 50, color: "#fcae91" },
  { max: 75, color: "#fb6a4a" },
  { max: 100, color: "#de2d26" },
  { max: Infinity, color: "#a50f15" },
];

function haversineKm(lat1, lng1, lat2, lng2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

function binColor(km) {
  for (const bin of DISTANCE_BINS) {
    if (km < bin.max) return bin.color;
  }
  return DISTANCE_BINS[DISTANCE_BINS.length - 1].color;
}

map.createPane("distancePane");
map.getPane("distancePane").style.zIndex = 350;
const distanceRenderer = L.canvas({ pane: "distancePane" });
const distanceLayer = L.layerGroup();
const distanceCells = [];
let distanceLayerOn = false;

for (const [lat, lng] of GRID.points) {
  const cell = L.rectangle(
    [
      [lat - GRID.latStep / 2, lng - GRID.lngStep / 2],
      [lat + GRID.latStep / 2, lng + GRID.lngStep / 2],
    ],
    {
      renderer: distanceRenderer,
      pane: "distancePane",
      stroke: false,
      fillColor: DISTANCE_BINS[0].color,
      fillOpacity: 0.55,
    }
  );
  cell.bindTooltip(() => cell._distanceText, { sticky: true, direction: "top" });
  distanceCells.push({ lat, lng, cell });
  distanceLayer.addLayer(cell);
}

function updateDistanceLayer() {
  if (!distanceLayerOn) return;
  const active = SCHOOLS.filter((s) => visible.has(s.id));
  for (const { lat, lng, cell } of distanceCells) {
    if (active.length === 0) {
      cell.setStyle({ fillColor: binColor(Infinity) });
      cell._distanceText = "Ingen skoler valgt";
      continue;
    }
    let min = Infinity;
    let nearest = null;
    for (const s of active) {
      const d = haversineKm(lat, lng, s.lat, s.lng);
      if (d < min) {
        min = d;
        nearest = s;
      }
    }
    cell.setStyle({ fillColor: binColor(min) });
    cell._distanceText = `${Math.round(min)} km i luftlinje til ${nearest.name}`;
  }
}

const legendEl = document.getElementById("legend");
document.getElementById("distance-toggle").addEventListener("change", (e) => {
  distanceLayerOn = e.target.checked;
  legendEl.hidden = !distanceLayerOn;
  if (distanceLayerOn) {
    updateDistanceLayer();
    distanceLayer.addTo(map);
  } else {
    map.removeLayer(distanceLayer);
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

document.getElementById("select-all").addEventListener("click", () => {
  for (const school of SCHOOLS) setVisible(school, true);
});

document.getElementById("select-none").addEventListener("click", () => {
  for (const school of SCHOOLS) setVisible(school, false);
});

const panel = document.getElementById("panel");
document.getElementById("toggle-panel").addEventListener("click", () => {
  panel.classList.toggle("hidden");
});

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
