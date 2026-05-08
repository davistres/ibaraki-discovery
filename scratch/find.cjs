const fs = require('fs');
const lines = fs.readFileSync('src/data/places.json', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('musee-ceramique-ibaraki')) {
    console.log(`musee-ceramique-ibaraki at line ${i + 1}`);
  }
  if (lines[i].includes('colline-arts-kasama')) {
    console.log(`colline-arts-kasama at line ${i + 1}`);
  }
  if (lines[i].includes('"lat": 36.3475')) {
    console.log(`lat 36.3475 at line ${i + 1}`);
  }
}
