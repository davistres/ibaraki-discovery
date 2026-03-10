import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 1 : Résolution doublon Famille et Liaison 10 premiers lieux ---');

  // 1. Fusion Famille (2041 -> 55)
  const placesWith2041 = await prisma.place.findMany({
    where: { categories: { some: { id: 2041 } } }
  });
  
  for (const p of placesWith2041) {
    await prisma.place.update({
      where: { id: p.id },
      data: {
        categories: {
          disconnect: { id: 2041 },
          connect: { id: 55 }
        }
      }
    });
  }
  
  try {
    await prisma.category.delete({ where: { id: 2041 } });
    console.log('Catégorie 2041 supprimée et fusionnée dans 55.');
  } catch (e) {
    console.log('Note: 2041 déjà traitée.');
  }

  // 2. Liaison des 10 premiers lieux
  const data = [
    { id: 'hitachi-seaside-park', cats: [1918, 1920, 1948, 1952, 1954, 1957, 55, 1970, 1971] },
    { id: 'kairaku-en', cats: [1918, 1948, 1949, 1954, 1955, 1970, 1972, 1987] },
    { id: 'mont-tsukuba', cats: [1918, 1919, 1920, 1921, 1948, 1950, 1951, 1952, 1961, 1970, 1973, 2011] },
    { id: 'kashima-jingu', cats: [1949, 1950, 1955, 1970, 1972, 1973, 1977, 2011] },
    { id: 'grand-bouddha-ushiku', cats: [1918, 1919, 1949, 1950, 1954, 1970, 1973, 1974, 55] },
    { id: 'chutes-fukuroda', cats: [1920, 1921, 1948, 1952, 1970, 1974, 1975] },
    { id: 'kasama-inari', cats: [1920, 1949, 1950, 1970, 1973, 1977, 2006, 2011] },
    { id: 'oarai-isosaki', cats: [1949, 1950, 1952, 1970, 1971, 1973, 1975, 1988, 2011] },
    { id: 'aqua-world-oarai', cats: [1949, 1959, 55, 1970, 1976, 2043] },
    { id: 'lac-kasumigaura', cats: [1919, 1948, 1957, 1958, 1970, 2007] }
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

  console.log('--- Phase 1 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
