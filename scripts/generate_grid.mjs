// Genererer data/grid.js: gitterpunkter over Danmarks landareal til
// afstandslaget. Køres kun når gitteret skal ændres, output er committet.
//
//   npm install world-atlas topojson-client
//   node scripts/generate_grid.mjs
//
// Kilde: world-atlas countries-10m.json (Natural Earth 1:10m).

import { createRequire } from "module";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const topo = require("world-atlas/countries-10m.json");
const tc = require("topojson-client");

const CELL_KM = 3;

const geo = tc.feature(topo, topo.objects.countries);
const denmark = geo.features.find((f) => f.properties.name === "Denmark");
if (!denmark) throw new Error("Denmark ikke fundet i world-atlas");

// Ray casting mod alle ringe i multipolygonen.
function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInDenmark(lng, lat) {
  for (const polygon of denmark.geometry.coordinates) {
    if (pointInRing(lng, lat, polygon[0])) {
      // Indre ringe er huller.
      for (let h = 1; h < polygon.length; h++) {
        if (pointInRing(lng, lat, polygon[h])) return false;
      }
      return true;
    }
  }
  return false;
}

let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
for (const polygon of denmark.geometry.coordinates) {
  for (const [lng, lat] of polygon[0]) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
}

const midLat = (minLat + maxLat) / 2;
const latStep = CELL_KM / 111.2;
const lngStep = CELL_KM / (111.32 * Math.cos((midLat * Math.PI) / 180));

const points = [];
for (let lat = minLat + latStep / 2; lat < maxLat; lat += latStep) {
  for (let lng = minLng + lngStep / 2; lng < maxLng; lng += lngStep) {
    if (pointInDenmark(lng, lat)) {
      points.push([Number(lat.toFixed(4)), Number(lng.toFixed(4))]);
    }
  }
}

const out =
  "// Genereret af scripts/generate_grid.mjs, redigér ikke i hånden.\n" +
  "// Gitterpunkter (celle-centre) over Danmarks landareal.\n" +
  `const GRID = {\n  cellKm: ${CELL_KM},\n  latStep: ${latStep.toFixed(6)},\n  lngStep: ${lngStep.toFixed(6)},\n  points: ${JSON.stringify(points)},\n};\n`;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
writeFileSync(join(root, "data", "grid.js"), out);
console.log(`Skrev ${points.length} gitterpunkter til data/grid.js`);
