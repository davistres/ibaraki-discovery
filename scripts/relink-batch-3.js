import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 3 : Mise à jour Taxonomie (Activités vs Tags) - Lieux 21 à 30 ---');

  const data = [
    { id: 'village-nishiyama', cats: [2005, 2045, 1949, 1956, 1962, 1977, 2002, 2003, 2004] },
    { id: 'colline-arts-kasama', cats: [2045, 1952, 1948, 1962, 1983, 55] },
    { id: 'musee-ceramique-ibaraki', cats: [2045, 1949, 1956, 1962, 1976, 1982] },
    { id: 'parc-kasama-no-mori', cats: [2045, 1951, 1948] },
    { id: 'brasserie-sudo-honke', cats: [1996, 1949, 1955, 1963, 1995, 1972] },
    { id: 'chutes-tsukimachi', cats: [2045, 1952, 1948, 1974, 1975] },
    { id: 'gorges-kuji-gawa', cats: [1958, 2045, 1948, 1971] },
    { id: 'vallee-mont-yamizo', cats: [1951, 2045, 1948, 2022] },
    { id: 'plage-hiraiso', cats: [1989, 2045, 1948, 1963, 1988, 2029, 55] },
    { id: 'oarai-marine-tower', cats: [1952, 1949, 1976, 2047, 55] }
  ];

  for (const item of data) {
    await prisma.place.update({
      where: { id: item.id },
      data: {
        categories: {
          set: item.cats.map(cid => ({ id: cid }))
        }
      }
    });
    console.log(`Lieu ${item.id} réorganisé.`);
  }

  console.log('--- Phase 3 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
