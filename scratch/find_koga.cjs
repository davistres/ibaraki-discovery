const fs = require('fs');
const lines = fs.readFileSync('src/data/places.json', 'utf8').split('\n');
let inTarget = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"id": "koga-ville-musee"')) {
    inTarget = true;
    console.log('Found koga-ville-musee at line ' + (i+1));
  }
  if (inTarget && lines[i].includes('"lat"')) {
    console.log('lat at line ' + (i+1) + ': ' + lines[i].trim());
  }
  if (inTarget && lines[i].includes('"googleMaps"')) {
    console.log('googleMaps at line ' + (i+1) + ': ' + lines[i].trim());
    break;
  }
}
