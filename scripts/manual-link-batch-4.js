import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 4 : Liaison des lieux 31 à 40 ---');

  const data = [
    { id: 'ville-itako-canaux', cats: [1918, 1949, 1958, 1977, 2007, 2031] },
    { id: 'temple-sairenji-itako', cats: [1949, 1950, 1955, 1972, 1973, 2010] },
    { id: 'pont-ryujin', cats: [1948, 1951, 1952, 1961, 1971, 1974] },
    { id: 'nishiyamaso', cats: [1949, 1955, 1972, 1983] },
    { id: 'sanctuaire-oiwa', cats: [1948, 1950, 1951, 1973, 2011] },
    { id: 'hitachi-civic-center-science-museum', cats: [1959, 1964, 55, 1976, 2000] },
    { id: 'gorge-hananuki', cats: [1920, 1948, 1951, 1952] },
    { id: 'plage-takado-kohama', cats: [1919, 1948, 1988, 1989] },
    { id: 'parc-floral-ibaraki', cats: [1918, 1919, 1920, 1948, 1954, 55] },
    { id: 'koga-ville-musee', cats: [1949, 1955, 1972, 1982] }
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

  console.log('--- Phase 4 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
