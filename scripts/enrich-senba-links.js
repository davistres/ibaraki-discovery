import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Liaison des nouveaux tags et enrichissement du Lac Senba ---');

  const links = [
    { id: 'lac-senba', cats: [1957, 1961, 1960, 2034, 1971, 1985, 2045, 2046, 2047] },
    { id: 'kairaku-en', cats: [2045, 2046] },
    { id: 'hitachi-seaside-park', cats: [2045] },
    { id: 'lac-kasumigaura', cats: [2034, 1957] },
    { id: 'oarai-marine-tower', cats: [2047] }
  ];

  for (const link of links) {
    await prisma.place.update({
      where: { id: link.id },
      data: {
        categories: {
          connect: link.cats.map(id => ({ id }))
        }
      }
    });
    console.log(`Lieu ${link.id} mis à jour.`);
  }

  console.log('--- Liaisons terminées ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
