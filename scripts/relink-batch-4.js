import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 4 : Mise à jour Taxonomie (Activités vs Tags) - Lieux 31 à 40 ---');

  const data = [
    { id: 'ville-itako-canaux', cats: [2007, 2045, 1949, 1977, 2031] },
    { id: 'temple-sairenji-itako', cats: [2045, 1949, 1950, 1955, 1972, 1973, 2010] },
    { id: 'pont-ryujin', cats: [1951, 1961, 1952, 1948, 1971, 1974, 2027] },
    { id: 'nishiyamaso', cats: [2045, 1949, 1955, 1972, 1983] },
    { id: 'sanctuaire-oiwa', cats: [1951, 2045, 1948, 1950, 1973, 2011] },
    { id: 'hitachi-civic-center-science-museum', cats: [1952, 1959, 1964, 1976, 2000, 55] },
    { id: 'gorge-hananuki', cats: [1951, 2045, 1952, 1948] },
    { id: 'plage-takado-kohama', cats: [1989, 2045, 1948, 1988] },
    { id: 'parc-floral-ibaraki', cats: [2045, 2005, 1948, 1954, 2026, 55] },
    { id: 'koga-ville-musee', cats: [2045, 1949, 1955, 1972, 1982] }
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

  console.log('--- Phase 4 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
