import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const placeId = 'sanctuaire-hoshino';

  console.log(`--- Suppression du lieu: ${placeId} ---`);

  // 1. Supprimer de Prisma
  try {
    // Supprimer d'abord les distances liées pour éviter les erreurs de clé étrangère
    const deletedDistances = await prisma.distance.deleteMany({
      where: {
        OR: [
          { fromId: placeId, fromType: 'place' },
          { toId: placeId, toType: 'place' }
        ]
      }
    });
    console.log(`Prisma: ${deletedDistances.count} distances supprimées.`);

    // Supprimer le lieu
    await prisma.place.delete({
      where: { id: placeId }
    });
    console.log(`Prisma: Lieu ${placeId} supprimé.`);
  } catch (e) {
    console.error(`Erreur Prisma (le lieu n'existait peut-être plus):`, e.message);
  }

  // 2. Supprimer de src/data/places.json
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json');
  if (fs.existsSync(placesPath)) {
    const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));
    const initialCount = placesData.length;
    const filteredPlaces = placesData.filter(p => p.id !== placeId);
    
    if (filteredPlaces.length < initialCount) {
      fs.writeFileSync(placesPath, JSON.stringify(filteredPlaces, null, 2), 'utf-8');
      console.log(`JSON: ${placeId} retiré de places.json.`);
    }
  }

  console.log('--- Suppression terminée ---');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
