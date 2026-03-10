import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 5 : Fusion Spiritualité et Liaison derniers lieux ---');

  // 1. Fusion "Spirituel" (1973) vers "Spiritualité" (1950)
  const spirituelId = 1973;
  const spiritualiteId = 1950;

  // On récupère les lieux et festivals liés à 1973
  const places = await prisma.place.findMany({ where: { categories: { some: { id: spirituelId } } } });
  const festivals = await prisma.festival.findMany({ where: { categories: { some: { id: spirituelId } } } });

  for (const p of places) {
    await prisma.place.update({
      where: { id: p.id },
      data: { categories: { connect: { id: spiritualiteId } } }
    });
  }
  for (const f of festivals) {
    await prisma.festival.update({
      where: { id: f.id },
      data: { categories: { connect: { id: spiritualiteId } } }
    });
  }

  try {
    await prisma.category.delete({ where: { id: spirituelId } });
    console.log('Catégorie "Spirituel" fusionnée dans "Spiritualité".');
  } catch (e) {
    console.log('Note: "Spirituel" déjà supprimé.');
  }

  // 2. Liaisons Bloc 5
  const data = [
    { id: 'marais-watarase', cats: [2008, 2045, 1948, 2016] },
    { id: 'cote-rocheuse-kitaiibaraki', cats: [2045, 1952, 1948, 1949, 1962, 1972, 2017, 2019] },
    { id: 'yuki-tsumugi-yakata', cats: [2005, 1949, 1956, 1972, 1977] },
    { id: 'temple-amabiki-kannon', cats: [2045, 1949, 1950, 2040, 2010] },
    { id: 'temple-choso-ji', cats: [2045, 1949, 1950, 1955, 2010] },
    { id: 'sanctuaire-hoshino', cats: [2045, 1948, 1950, 2011] },
    { id: 'lapoppo-namegata-farmers-village', cats: [2014, 1965, 1949, 2012, 2013, 2029, 2030, 55] },
    { id: 'temple-zuishoin', cats: [2045, 1994, 1949, 1950, 1974, 1984, 1993, 2010] },
    { id: 'sanctuaire-tsukuba', cats: [2045, 1951, 1950, 2011] }
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

  console.log('--- Phase 5 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
