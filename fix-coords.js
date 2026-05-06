import fs from 'fs';

// Correction places.json
const places = JSON.parse(fs.readFileSync('src/data/places.json', 'utf8'));
const choshoji = places.find(p => p.id === 'temple-choso-ji');
if (choshoji) {
  choshoji.coordonnees = { lat: 35.9388, lng: 140.5485 };
  console.log("Choshoji coordinates updated.");
}
fs.writeFileSync('src/data/places.json', JSON.stringify(places, null, 2));

// Correction festivals.json
const festivals = JSON.parse(fs.readFileSync('src/data/festivals.json', 'utf8'));
const tsuchiura = festivals.find(f => f.id === 'tsuchiura-fireworks');
if (tsuchiura) {
  tsuchiura.coordonnees = { lat: 36.0740, lng: 140.1870 };
  console.log("Tsuchiura fireworks coordinates updated.");
}
fs.writeFileSync('src/data/festivals.json', JSON.stringify(festivals, null, 2));

console.log("Done.");
