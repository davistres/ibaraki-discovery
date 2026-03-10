import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 1 : Mise à jour Taxonomie (Activités vs Tags) - Lieux 1 à 10 ---');

  const data = [
    { id: 'hitachi-seaside-park', cats: [2045, 1957, 1952, 1960, 1948, 1954, 1970, 1971, 55] },
    { id: 'kairaku-en', cats: [2045, 2046, 1952, 1960, 1948, 1949, 1955, 1954, 1970, 1972, 1987, 2023] },
    { id: 'mont-tsukuba', cats: [1951, 1957, 1952, 1961, 2021, 1948, 1970, 1973, 2011, 2047] },
    { id: 'kashima-jingu', cats: [2045, 1994, 1960, 1949, 1950, 1955, 1970, 1972, 1973, 1977, 2011] },
    { id: 'grand-bouddha-ushiku', cats: [2045, 1952, 1960, 1949, 1950, 1954, 1970, 1973, 1974, 55, 1983] },
    { id: 'chutes-fukuroda', cats: [1951, 2045, 1952, 1948, 1970, 1974, 1975, 2027] },
    { id: 'kasama-inari', cats: [2045, 1994, 1949, 1950, 1970, 1973, 1977, 2006, 2011] },
    { id: 'oarai-isosaki', cats: [2045, 1952, 1994, 1949, 1950, 1971, 1973, 1975, 1988, 2011] },
    { id: 'aqua-world-oarai', cats: [2043, 1952, 1949, 1970, 1976, 2040, 55] },
    { id: 'lac-kasumigaura', cats: [1957, 1958, 2007, 2009, 1948, 1970, 2015, 2047] }
  ];

  for (const item of data) {
    // On utilise set pour écraser les anciens liens et être propre
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

  console.log('--- Phase 1 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
