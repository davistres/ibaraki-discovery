import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Création de l activité Saut à l élastique ---');

  // 1. Créer la catégorie
  const bungeeCat = await prisma.category.create({
    data: {
      group: 'Activités',
      nom: 'Saut à l\'élastique',
      nom_en: 'Bungee Jumping',
      nom_ja: 'バンジージャンプ'
    }
  });
  console.log(`Activité créée avec l ID: ${bungeeCat.id}`);

  // 2. Lier au Pont Ryujin
  await prisma.place.update({
    where: { id: 'pont-ryujin' },
    data: {
      categories: {
        connect: { id: bungeeCat.id }
      }
    }
  });
  console.log('Lieu pont-ryujin lié au Saut à l\'élastique.');

  console.log('--- Fin de l opération ---');
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
