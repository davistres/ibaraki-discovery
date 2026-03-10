import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const updates = [
  { 
    id: 'colline-arts-kasama', 
    siteWeb: 'https://www.city.kasama.lg.jp/page/page000122.html' 
  },
  { 
    id: 'parc-kasama-no-mori', 
    siteWeb: 'https://www.city.kasama.lg.jp/page/page000122.html',
    googleMaps: 'https://www.google.com/maps/search/?api=1&query=Kasama+Geijutsu-no-mori+Park+(Kasama+Art+Forest+Park)'
  }
];

async function main() {
  console.log('--- Mise à jour des sites et liens Google Maps (Kasama) ---');

  // 1. Mettre à jour Prisma
  for (const update of updates) {
    try {
      const data = { siteWeb: update.siteWeb };
      if (update.googleMaps) data.googleMaps = update.googleMaps;

      await prisma.place.update({
        where: { id: update.id },
        data: data
      });
      console.log(`Prisma: Lieu ${update.id} mis à jour.`);
    } catch (e) {
      console.error(`Erreur Prisma pour ${update.id}:`, e.message);
    }
  }

  // 2. Mettre à jour src/data/places.json
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json');
  if (fs.existsSync(placesPath)) {
    const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));
    let changed = false;

    for (const place of placesData) {
      const update = updates.find(u => u.id === place.id);
      if (update) {
        place.siteWeb = update.siteWeb;
        if (update.googleMaps) place.googleMaps = update.googleMaps;
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(placesPath, JSON.stringify(placesData, null, 2), 'utf-8');
      console.log('JSON: src/data/places.json mis à jour.');
    }
  }

  console.log('--- Mise à jour terminée ---');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
