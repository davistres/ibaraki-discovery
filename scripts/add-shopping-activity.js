import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Création et liaison de l activité Shopping ---');

  // 1. Créer la catégorie Shopping
  const shoppingCat = await prisma.category.create({
    data: {
      group: 'Activités',
      nom: 'Shopping',
      nom_en: 'Shopping',
      nom_ja: 'ショッピング'
    }
  });
  console.log(`Catégorie Shopping créée avec l ID: ${shoppingCat.id}`);

  // 2. Liste des lieux à lier
  const placeIds = [
    'brasserie-sudo-honke',
    'brasserie-inaba',
    'village-nishiyama',
    'yuki-tsumugi-yakata',
    'lapoppo-namegata-farmers-village',
    'aqua-world-oarai',
    'hitachi-seaside-park'
  ];

  for (const id of placeIds) {
    try {
      await prisma.place.update({
        where: { id: id },
        data: {
          categories: {
            connect: { id: shoppingCat.id }
          }
        }
      });
      console.log(`Lieu ${id} lié à Shopping.`);
    } catch (e) {
      console.warn(`Lieu ${id} non trouvé ou erreur.`);
    }
  }

  console.log('--- Fin des liaisons ---');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
