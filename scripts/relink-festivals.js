import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 6 : Mise à jour Taxonomie (Activités vs Tags) - Festivals ---');

  const data = [
    { id: 'mito-plum-festival', cats: [2045, 1952, 1949, 1977, 1970, 2023, 1966] },
    { id: 'itako-iris-festival', cats: [2007, 2045, 1949, 1977, 1966] },
    { id: 'rock-in-japan', cats: [1952, 1967, 1979, 1974, 1978] },
    { id: 'oarai-anko-festival', cats: [1996, 1963, 1977, 2017, 1968] },
    { id: 'kasama-chrysanthemum-festival', cats: [2045, 1952, 1949, 1977, 1972, 1966] },
    { id: 'tsuchiura-fireworks', cats: [1952, 1969, 1970, 1980] },
    { id: 'koga-peach-blossom-festival', cats: [2045, 1966, 1977, 55] },
    { id: 'tsukuba-festival', cats: [2045, 1969, 1977, 55, 2025] },
    { id: 'makabe-cherry-blossom-festival', cats: [2045, 1949, 1955, 1977, 1966] },
    { id: 'kasama-lantern-illumination-festival', cats: [2045, 1952, 1969, 1980, 1971] }
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
    console.log(`Festival ${item.id} réorganisé.`);
  }

  console.log('--- Phase 6 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
