import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 3 : Liaison des lieux 21 à 30 ---');

  const data = [
    { id: 'village-nishiyama', cats: [1949, 1956, 1962, 1977, 2002, 2003, 2004] },
    { id: 'colline-arts-kasama', cats: [1918, 1919, 1920, 1948, 1962, 55, 1983] },
    { id: 'musee-ceramique-ibaraki', cats: [1949, 1956, 1962, 1976, 1982] },
    { id: 'parc-kasama-no-mori', cats: [1920, 1948, 1951] },
    { id: 'brasserie-sudo-honke', cats: [1949, 1955, 1963, 1995, 1996, 1972] },
    { id: 'chutes-tsukimachi', cats: [1948, 1952, 1974, 1975] },
    { id: 'gorges-kuji-gawa', cats: [1920, 1948, 1958, 1971] },
    { id: 'vallee-mont-yamizo', cats: [1918, 1919, 1920, 1921, 1948, 1951, 2022] },
    { id: 'plage-hiraiso', cats: [1919, 1948, 1963, 1988, 55, 2029] },
    { id: 'oarai-marine-tower', cats: [1949, 1952, 1976, 55] }
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
    console.log(`Lieu ${item.id} mis à jour.`);
  }

  console.log('--- Phase 3 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
