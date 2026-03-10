import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Deep Analysis Batch 1 : 1914 - 1933 ---');

  const updates = [
    { id: 1914, places: ['chutes-fukuroda', 'chutes-tsukimachi', 'gorges-kuji-gawa', 'pont-ryujin', 'nishiyamaso', 'sanctuaire-oiwa', 'hitachi-civic-center-science-museum', 'gorge-hananuki', 'plage-takado-kohama', 'vallee-mont-yamizo'] },
    { id: 1915, places: ['ecole-kodokan', 'kairaku-en', 'musee-art-moderne-ibaraki', 'lac-senba', 'kasama-inari', 'village-nishiyama', 'colline-arts-kasama', 'musee-ceramique-ibaraki', 'parc-kasama-no-mori', 'brasserie-sudo-honke', 'oarai-isosaki', 'aqua-world-oarai', 'oarai-marine-tower'] },
    { id: 1916, places: ['mont-tsukuba', 'sanctuaire-tsukuba', 'jaxa-tsukuba', 'tsukuba-expo-center', 'jardin-botanique-tsukuba', 'brasserie-inaba', 'temple-shutokuji', 'grand-bouddha-ushiku', 'lac-kasumigaura', 'ville-itako-canaux', 'koga-ville-musee', 'yuki-tsumugi-yakata', 'temple-amabiki-kannon', 'temple-choso-ji', 'sanctuaire-hoshino', 'lapoppo-namegata-farmers-village', 'temple-zuishoin'] },
    { id: 1917, places: ['hitachi-seaside-park', 'plage-ajigaura', 'plage-hiraiso', 'oarai-isosaki', 'aqua-world-oarai', 'oarai-marine-tower', 'cote-rocheuse-kitaiibaraki', 'plage-takado-kohama'] },
    { id: 1918, places: ['kairaku-en', 'ecole-kodokan', 'hitachi-seaside-park', 'parc-floral-ibaraki', 'temple-amabiki-kannon'], festivals: ['mito-plum-festival', 'itako-iris-festival', 'koga-peach-blossom-festival', 'makabe-cherry-blossom-festival'] },
    { id: 1919, places: ['plage-ajigaura', 'plage-takado-kohama', 'lac-kasumigaura'], festivals: ['rock-in-japan', 'tsukuba-festival'] },
    { id: 1920, places: ['chutes-fukuroda', 'gorge-hananuki', 'pont-ryujin', 'hitachi-seaside-park', 'parc-kasama-no-mori'], festivals: ['kasama-chrysanthemum-festival', 'tsuchiura-fireworks', 'kasama-lantern-illumination-festival'] },
    { id: 1921, places: ['chutes-fukuroda'], festivals: ['oarai-anko-festival'] },
    { id: 1922, places: ['ecole-kodokan', 'kairaku-en', 'musee-art-moderne-ibaraki', 'lac-senba'], festivals: ['mito-plum-festival'] },
    { id: 1923, places: ['hitachi-seaside-park', 'plage-ajigaura', 'plage-hiraiso'], festivals: ['rock-in-japan'] },
    { id: 1924, places: ['mont-tsukuba', 'sanctuaire-tsukuba', 'jaxa-tsukuba', 'tsukuba-expo-center', 'jardin-botanique-tsukuba', 'brasserie-inaba', 'temple-shutokuji'], festivals: ['tsukuba-festival'] },
    { id: 1925, places: ['kashima-jingu'] },
    { id: 1926, places: ['grand-bouddha-ushiku'] },
    { id: 1927, places: ['chutes-fukuroda', 'chutes-tsukimachi', 'gorges-kuji-gawa', 'vallee-mont-yamizo'] },
    { id: 1928, places: ['kasama-inari', 'village-nishiyama', 'colline-arts-kasama', 'musee-ceramique-ibaraki', 'parc-kasama-no-mori', 'brasserie-sudo-honke'], festivals: ['kasama-chrysanthemum-festival', 'kasama-lantern-illumination-festival'] },
    { id: 1929, places: ['oarai-isosaki', 'aqua-world-oarai', 'oarai-marine-tower'], festivals: ['oarai-anko-festival'] },
    { id: 1930, places: ['lac-kasumigaura'], festivals: ['tsuchiura-fireworks'] },
    { id: 1931, places: ['ville-itako-canaux'], festivals: ['itako-iris-festival'] },
    { id: 1932, places: ['koga-ville-musee'], festivals: ['koga-peach-blossom-festival'] },
    { id: 1933, places: ['pont-ryujin', 'nishiyamaso'] }
  ];

  for (const update of updates) {
    if (update.places) {
      for (const pid of update.places) {
        await prisma.place.update({ where: { id: pid }, data: { categories: { connect: { id: update.id } } } });
      }
    }
    if (update.festivals) {
      for (const fid of update.festivals) {
        await prisma.festival.update({ where: { id: fid }, data: { categories: { connect: { id: update.id } } } });
      }
    }
  }
  console.log('Batch 1 terminé.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
