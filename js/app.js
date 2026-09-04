/* Kort og togglepanel for ordblindeefterskolerne. Data kommer fra
   data/schools.js som definerer SCHOOLS. */

const REGION_ORDER = ["Nordjylland", "Midtjylland", "Syddanmark", "Fyn", "Sjælland"];

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
  const note = school.verified === false
    ? '<div class="popup-town">Oplysninger under verifikation</div>'
    : "";
  return (
    `<strong>${school.name}</strong>` +
    `<div class="popup-town">${school.town}</div>` +
    `<a href="${school.website}" target="_blank" rel="noopener">${school.website.replace(/^https?:\/\//, "")}</a>` +
    note
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
