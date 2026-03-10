import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const updates = [
  {
    id: 'tsukuba-expo-center',
    descriptionLongue: "Le Tsukuba EXPO Center est un musée scientifique généraliste et familial. Construit pour l'Exposition internationale de la science de 1985 (Expo '85), il propose des expositions interactives sur l'espace, l'énergie et l'environnement, où l'on peut toucher et expérimenter divers principes physiques ou technologiques. Le centre est surtout célèbre pour abriter l'un des plus grands planétariums au monde, ainsi qu'une fusée H-II grandeur nature exposée à l'extérieur.",
    acces: 'L\'EXPO Center est situé dans le quartier d\'Azuma (2 Chome-9). C\'est en plein hyper-centre de la ville, à 5 minutes à pied de la gare principale "Tsukuba Station".'
  },
  {
    id: 'jaxa-tsukuba',
    descriptionLongue: "Le JAXA Tsukuba Space Center ('Space Dome') est le cœur de l'agence spatiale japonaise (l'équivalent de la NASA au Japon). Le 'Space Dome' est le hall d'exposition officiel situé directement sur leur complexe de recherche. Son thème est 100% centré sur l'espace. On y voit de véritables modèles de satellites, une reproduction grandeur nature du module expérimental japonais Kibo (qui est rattaché à la Station Spatiale Internationale), et une vraie fusée H-II de 50 mètres de long exposée à l'extérieur.",
    acces: 'Bus depuis la gare de Tsukuba. Le Centre de la JAXA est situé plus au sud, dans le quartier de Sengen (2 Chome-1-1). C\'est un immense campus de recherche excentré.'
  }
];

async function main() {
  console.log('--- Mise à jour des textes (A propos & Accès) ---');

  // 1. Mettre à jour Prisma
  for (const update of updates) {
    try {
      await prisma.place.update({
        where: { id: update.id },
        data: { 
          descriptionLongue: update.descriptionLongue,
          acces: update.acces
        }
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
        place.descriptionLongue = update.descriptionLongue;
        place.acces = update.acces;
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
