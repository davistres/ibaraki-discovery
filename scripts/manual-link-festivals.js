import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 6 : Liaison des festivals ---');

  const data = [
    { id: 'itako-iris-festival', cats: [1918, 1966, 1977, 2007] },
    { id: 'kasama-chrysanthemum-festival', cats: [1920, 1966, 1977, 1972] },
    { id: 'kasama-lantern-illumination-festival', cats: [1920, 1969, 1980, 1971] },
    { id: 'koga-peach-blossom-festival', cats: [1918, 1966, 1977, 55] },
    { id: 'makabe-cherry-blossom-festival', cats: [1918, 1966, 1955, 1977] },
    { id: 'mito-plum-festival', cats: [1918, 1966, 1970, 1977] },
    { id: 'oarai-anko-festival', cats: [1921, 1968, 1977, 2017] },
    { id: 'rock-in-japan', cats: [1919, 1967, 1979, 1974] },
    { id: 'tsuchiura-fireworks', cats: [1920, 1969, 1970, 1952] },
    { id: 'tsukuba-festival', cats: [1919, 1969, 1977, 55] }
  ];

  for (const item of data) {
    await prisma.festival.update({
      where: { id: item.id },
      data: {
        categories: {
          set: item.cats.map(cid => ({ id: cid }))
        }
      }
    });
    console.log(`Festival ${item.id} mis à jour.`);
  }

  console.log('--- Phase 6 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
