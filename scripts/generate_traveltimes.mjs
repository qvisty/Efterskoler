// Genererer data/traveltimes.js: køretid i bil fra hvert gitterpunkt i
// data/grid.js til hver skole i data/schools.js, via OSRM table API.
//
// Kræver kun Node 18 eller nyere, ingen dependencies:
//
//   node scripts/generate_traveltimes.mjs
//
// Bruger som standard den offentlige OSRM demo server. Den er best effort,
// så scriptet holder pauser mellem kaldene, prøver igen ved fejl og gemmer
// løbende fremdrift i scripts/.traveltimes_progress.json. Afbrydes det,
// fortsætter et nyt kald hvor det slap. En anden OSRM instans kan angives:
//
//   OSRM_URL=http://localhost:5000 node scripts/generate_traveltimes.mjs
//
// Efter succesfuld kørsel: commit data/traveltimes.js. Kortet skifter så
// automatisk fra luftlinje km til minutter i bil.

import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const OSRM_URL = process.env.OSRM_URL || "https://router.project-osrm.org";
// OSRM demo serverens table grænse er 100 lokationer pr. kald i alt.
const SOURCES_PER_REQUEST = 70;
const DELAY_MS = 700;
const MAX_RETRIES = 5;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const progressPath = join(root, "scripts", ".traveltimes_progress.json");

function loadBrowserGlobal(file, name) {
  const src = readFileSync(join(root, "data", file), "utf8");
  return new Function(`${src}; return ${name};`)();
}

const GRID = loadBrowserGlobal("grid.js", "GRID");
const SCHOOLS = loadBrowserGlobal("schools.js", "SCHOOLS");

const points = GRID.points;
const schoolIds = SCHOOLS.map((s) => s.id);
const destCoords = SCHOOLS.map((s) => `${s.lng},${s.lat}`).join(";");

let minutes = points.map(() => null);
let startChunk = 0;
if (existsSync(progressPath)) {
  const p = JSON.parse(readFileSync(progressPath, "utf8"));
  if (p.pointCount === points.length && p.schoolIds.join() === schoolIds.join()) {
    minutes = p.minutes;
    startChunk = p.nextChunk;
    console.log(`Fortsætter fra chunk ${startChunk}`);
  } else {
    console.log("Fremdriftsfil matcher ikke nuværende grid eller skoler, starter forfra");
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchTable(chunkPoints) {
  const srcCoords = chunkPoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const nSrc = chunkPoints.length;
  const sources = Array.from({ length: nSrc }, (_, i) => i).join(";");
  const destinations = Array.from({ length: schoolIds.length }, (_, i) => nSrc + i).join(";");
  const url =
    `${OSRM_URL}/table/v1/driving/${srcCoords};${destCoords}` +
    `?sources=${sources}&destinations=${destinations}&annotations=duration`;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "efterskoler-kort" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      if (body.code !== "Ok") throw new Error(`OSRM: ${body.code} ${body.message || ""}`);
      return body.durations;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      const wait = 2000 * 2 ** (attempt - 1);
      console.log(`  fejl (${err.message}), prøver igen om ${wait / 1000}s`);
      await sleep(wait);
    }
  }
}

const chunkCount = Math.ceil(points.length / SOURCES_PER_REQUEST);
console.log(
  `${points.length} gitterpunkter, ${schoolIds.length} skoler, ` +
  `${chunkCount} kald til ${OSRM_URL}, forventet ca. ${Math.round((chunkCount * (DELAY_MS + 800)) / 60000)} min`
);

for (let chunk = startChunk; chunk < chunkCount; chunk++) {
  const from = chunk * SOURCES_PER_REQUEST;
  const chunkPoints = points.slice(from, from + SOURCES_PER_REQUEST);
  const durations = await fetchTable(chunkPoints);
  durations.forEach((row, i) => {
    minutes[from + i] = row.map((sec) => (sec === null ? null : Math.round(sec / 60)));
  });
  writeFileSync(
    progressPath,
    JSON.stringify({ pointCount: points.length, schoolIds, nextChunk: chunk + 1, minutes })
  );
  if ((chunk + 1) % 25 === 0 || chunk + 1 === chunkCount) {
    console.log(`  ${chunk + 1}/${chunkCount} chunks færdige`);
  }
  await sleep(DELAY_MS);
}

const missing = minutes.filter((row) => row === null || row.every((v) => v === null)).length;
if (missing > 0) {
  console.log(`Advarsel: ${missing} punkter uden nogen rute, de farves som over max`);
}

const out =
  "// Genereret af scripts/generate_traveltimes.mjs, redigér ikke i hånden.\n" +
  "// Køretid i bil i minutter fra hvert punkt i data/grid.js til hver\n" +
  "// skole, kolonneorden som schoolIds. null betyder ingen rute.\n" +
  `const TRAVELTIMES = {\n` +
  `  generated: ${JSON.stringify(new Date().toISOString().slice(0, 10))},\n` +
  `  osrm: ${JSON.stringify(OSRM_URL)},\n` +
  `  cellKm: ${GRID.cellKm},\n` +
  `  schoolIds: ${JSON.stringify(schoolIds)},\n` +
  `  minutes: ${JSON.stringify(minutes)},\n` +
  `};\n`;

writeFileSync(join(root, "data", "traveltimes.js"), out);
unlinkSync(progressPath);
console.log(`Skrev data/traveltimes.js for ${points.length} punkter. Commit filen, så skifter kortet til køretid.`);
