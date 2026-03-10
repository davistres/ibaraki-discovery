import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const placeId = 'temple-sairenji-itako';
  const newSiteWeb = 'https://sairen-ji.com/';
  const newGoogleMaps = 'https://www.google.com/maps/search/?api=1&query=Sairenji+西蓮寺';

  console.log(`--- Mise à jour pour Sairenji (${placeId}) ---`);

  // 1. Mettre à jour Prisma
  try {
    await prisma.place.update({
      where: { id: placeId },
      data: { 
        siteWeb: newSiteWeb,
        googleMaps: newGoogleMaps
      }
    });
    console.log(`Prisma: Lieu ${placeId} mis à jour.`);
  } catch (e) {
    console.error(`Erreur Prisma:`, e.message);
  }

  // 2. Mettre à jour src/data/places.json
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json');
  if (fs.existsSync(placesPath)) {
    const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));
    const place = placesData.find(p => p.id === placeId);
    if (place) {
      place.siteWeb = newSiteWeb;
      place.googleMaps = newGoogleMaps;
      fs.writeFileSync(placesPath, JSON.stringify(placesData, null, 2), 'utf-8');
      console.log(`JSON: src/data/places.json mis à jour.`);
    }
  }

  console.log('--- Mise à jour terminée ---');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
