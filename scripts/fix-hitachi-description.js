import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const placeId = 'hitachi-civic-center-science-museum';
  const oldText = "Le Hitachi Civic Center Science Museum 'Sacrie'";
  const newText = "Le musée des sciences du centre civique Hitachi SAKURIE";

  console.log(`--- Mise à jour de la description pour ${placeId} ---`);

  // 1. Mettre à jour Prisma
  try {
    const place = await prisma.place.findUnique({ where: { id: placeId } });
    if (place) {
      const updatedDesc = place.descriptionLongue.replace(oldText, newText);
      await prisma.place.update({
        where: { id: placeId },
        data: { descriptionLongue: updatedDesc }
      });
      console.log(`Prisma: Description de ${placeId} mise à jour.`);
    }
  } catch (e) {
    console.error(`Erreur Prisma:`, e.message);
  }

  // 2. Mettre à jour src/data/places.json
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json');
  if (fs.existsSync(placesPath)) {
    const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));
    const place = placesData.find(p => p.id === placeId);
    if (place && place.descriptionLongue) {
      place.descriptionLongue = place.descriptionLongue.replace(oldText, newText);
      fs.writeFileSync(placesPath, JSON.stringify(placesData, null, 2), 'utf-8');
      console.log(`JSON: src/data/places.json mis à jour.`);
    }
  }

  console.log('--- Mise à jour terminée ---');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
