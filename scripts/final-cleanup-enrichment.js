import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Nettoyage et Enrichissement de la Base de Données ---');

  // 1. Fusion "Famille" (2042 -> 55)
  const placesWith2042 = await prisma.place.findMany({ where: { categories: { some: { id: 2042 } } } });
  for (const p of placesWith2042) {
    await prisma.place.update({
      where: { id: p.id },
      data: { categories: { disconnect: { id: 2042 }, connect: { id: 55 } } }
    });
  }
  try {
    await prisma.category.delete({ where: { id: 2042 } });
    console.log('Doublon Famille (2042) supprimé.');
  } catch (e) {}

  // 2. Liaisons spécifiques demandées
  const updates = [
    { id: 1981, places: ['kairaku-en', 'hitachi-seaside-park', 'ecole-kodokan', 'temple-amabiki-kannon'], festivals: ['koga-peach-blossom-festival', 'makabe-cherry-blossom-festival'] }, // Hanami
    { id: 1986, places: ['oarai-marine-tower', 'oarai-isosaki', 'lac-kasumigaura', 'plage-ajigaura', 'lac-senba', 'cote-rocheuse-kitaiibaraki'] }, // Coucher de soleil
    { id: 2044, places: ['aqua-world-oarai', 'hitachi-civic-center-science-museum', 'tsukuba-expo-center', 'hitachi-seaside-park', 'parc-floral-ibaraki', 'grand-bouddha-ushiku'] }, // Enfant
    { id: 2028, places: ['chutes-fukuroda'] }, // Kenchin-jiru
    { id: 2020, places: ['gorges-kuji-gawa', 'vallee-mont-yamizo'] }, // Camping
    { id: 1944, places: ['temple-zuishoin'] } // Inashiki
  ];

  for (const u of updates) {
    if (u.places) {
      for (const pid of u.places) {
        await prisma.place.update({ where: { id: pid }, data: { categories: { connect: { id: u.id } } } });
      }
    }
    if (u.festivals) {
      for (const fid of u.festivals) {
        await prisma.festival.update({ where: { id: fid }, data: { categories: { connect: { id: u.id } } } });
      }
    }
    console.log(`Tag ID ${u.id} enrichi.`);
  }

  // S'assurer que le Temple Zuishoin est bien lié à la ville Inashiki (id 1944)
  await prisma.place.update({
    where: { id: 'temple-zuishoin' },
    data: { ville_id: 1944 }
  });

  console.log('--- Fin de l enrichment ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
