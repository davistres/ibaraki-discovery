import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 5 : Liaison du dernier bloc de lieux ---');

  const data = [
    { id: 'marais-watarase', cats: [1948, 2008, 2016, 1952] },
    { id: 'cote-rocheuse-kitaiibaraki', cats: [1948, 1949, 1952, 1962, 1972, 2017] },
    { id: 'yuki-tsumugi-yakata', cats: [1949, 1956, 1972, 1977] },
    { id: 'temple-amabiki-kannon', cats: [1918, 1949, 1950, 2040, 2010] },
    { id: 'temple-choso-ji', cats: [1949, 1950, 1955, 2010] },
    { id: 'sanctuaire-hoshino', cats: [1948, 1950, 2011] },
    { id: 'lapoppo-namegata-farmers-village', cats: [1949, 55, 2012, 2013, 2014] },
    { id: 'temple-zuishoin', cats: [1949, 1950, 1973, 1984, 1993, 2010] },
    { id: 'sanctuaire-tsukuba', cats: [1950, 1951, 1973, 2011, 1970] }
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

  console.log('--- Phase 5 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
