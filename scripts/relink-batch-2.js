import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 2 : Mise à jour Taxonomie (Activités vs Tags) - Lieux 11 à 20 ---');

  const data = [
    { id: 'ecole-kodokan', cats: [2045, 1949, 1955, 1959, 1970, 1972, 1977, 2023] },
    { id: 'musee-art-moderne-ibaraki', cats: [2045, 1949, 1962, 1976, 1982, 1983] },
    { id: 'lac-senba', cats: [2045, 2046, 1957, 2008, 1960, 1961, 1948, 1971, 1985, 2047, 55] },
    { id: 'plage-ajigaura', cats: [1989, 2045, 1948, 1988, 55] },
    { id: 'chateau-oda', cats: [2045, 1949, 1955, 1972, 1990, 1991, 1992] },
    { id: 'temple-shutokuji', cats: [1994, 2045, 1949, 1950, 1973, 1984, 1993, 2010] },
    { id: 'brasserie-inaba', cats: [1996, 1949, 1956, 1963, 1995, 1997] },
    { id: 'jaxa-tsukuba', cats: [1952, 1949, 1959, 1964, 1976, 1998, 1999] },
    { id: 'tsukuba-expo-center', cats: [1952, 1959, 1964, 1976, 2000, 55] },
    { id: 'jardin-botanique-tsukuba', cats: [2045, 1948, 1954, 1959, 1976, 2001] }
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

  console.log('--- Phase 2 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
