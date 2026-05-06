import fs from 'fs';

const places = JSON.parse(fs.readFileSync('src/data/places.json', 'utf8'));
const festivals = JSON.parse(fs.readFileSync('src/data/festivals.json', 'utf8'));

console.log("--- PLACES ---");
places.forEach(p => {
  if (p.nom && (p.nom.includes('Chōshō') || p.nom.includes('Chosho') || p.nom.includes('Kasumigaura') || p.nom.includes('Tsuchiura'))) {
    console.log(`- ${p.nom} (ID: ${p.id}): lat=${p.coordonnees?.lat}, lng=${p.coordonnees?.lng}, ville_id=${p.ville_id}`);
  }
});

console.log("\n--- FESTIVALS ---");
festivals.forEach(f => {
  if (f.nom && (f.nom.includes('Tsuchiura') || f.nom.includes('Artifice'))) {
    console.log(`- ${f.nom} (ID: ${f.id}): lat=${f.coordonnees?.lat}, lng=${f.coordonnees?.lng}, ville_id=${f.ville_id}`);
  }
});
