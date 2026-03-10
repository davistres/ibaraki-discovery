import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Deep Analysis Batch 2 : 1934 - 1954 + Gastronomie ---');

  const updates = [
    { id: 1934, places: ['sanctuaire-oiwa', 'hitachi-civic-center-science-museum'] },
    { id: 1935, places: ['gorge-hananuki'] },
    { id: 1936, places: ['parc-floral-ibaraki'] },
    { id: 1937, places: ['cote-rocheuse-kitaiibaraki', 'plage-takado-kohama'] },
    { id: 1938, places: ['yuki-tsumugi-yakata'] },
    { id: 1939, places: ['temple-amabiki-kannon'], festivals: ['makabe-cherry-blossom-festival'] },
    { id: 1940, places: ['lac-kasumigaura'] },
    { id: 1941, places: ['lapoppo-namegata-farmers-village'] },
    { id: 1944, places: ['temple-zuishoin'] },
    { id: 1945, places: ['hitachi-seaside-park', 'kairaku-en', 'grand-bouddha-ushiku', 'aqua-world-oarai', 'ecole-kodokan', 'lac-senba', 'musee-art-moderne-ibaraki', 'jaxa-tsukuba', 'tsukuba-expo-center', 'jardin-botanique-tsukuba', 'brasserie-sudo-honke', 'oarai-marine-tower', 'nishiyamaso', 'hitachi-civic-center-science-museum', 'parc-floral-ibaraki', 'koga-ville-musee', 'yuki-tsumugi-yakata', 'temple-amabiki-kannon', 'sanctuaire-hoshino'] },
    { id: 1946, places: ['mont-tsukuba', 'chutes-fukuroda', 'pont-ryujin', 'sanctuaire-oiwa', 'gorge-hananuki', 'village-nishiyama', 'temple-shutokuji', 'brasserie-inaba', 'chutes-tsukimachi', 'temple-sairenji-itako', 'temple-choso-ji', 'temple-zuishoin'] },
    { id: 1947, places: ['vallee-mont-yamizo'] },
    { id: 1948, places: ['hitachi-seaside-park', 'kairaku-en', 'mont-tsukuba', 'chutes-fukuroda', 'lac-kasumigaura', 'lac-senba', 'parc-floral-ibaraki', 'marais-watarase', 'gorge-hananuki', 'chutes-tsukimachi', 'gorges-kuji-gawa', 'vallee-mont-yamizo', 'plage-ajigaura', 'plage-takado-kohama', 'sanctuaire-oiwa'] },
    { id: 1949, places: ['ecole-kodokan', 'kairaku-en', 'kashima-jingu', 'kasama-inari', 'yuki-tsumugi-yakata', 'koga-ville-musee', 'musee-art-moderne-ibaraki', 'musee-ceramique-ibaraki', 'village-nishiyama', 'nishiyamaso', 'jaxa-tsukuba'] },
    { id: 1950, places: ['kashima-jingu', 'kasama-inari', 'oarai-isosaki', 'sanctuaire-tsukuba', 'sanctuaire-oiwa', 'temple-amabiki-kannon', 'temple-shutokuji', 'temple-zuishoin', 'temple-sairenji-itako', 'temple-choso-ji', 'sanctuaire-hoshino'] },
    { id: 1951, places: ['mont-tsukuba', 'vallee-mont-yamizo', 'pont-ryujin', 'sanctuaire-oiwa', 'gorge-hananuki'] },
    { id: 1952, places: ['oarai-isosaki', 'hitachi-seaside-park', 'chutes-fukuroda', 'pont-ryujin', 'lac-senba', 'gorge-hananuki', 'chutes-tsukimachi'] },
    { id: 1954, places: ['kairaku-en', 'hitachi-seaside-park', 'parc-floral-ibaraki', 'jardin-botanique-tsukuba', 'grand-bouddha-ushiku'] },
    // Spécial Gastronomie
    { id: 2023, places: ['ecole-kodokan', 'kairaku-en'], festivals: ['mito-plum-festival'] }, // Natto
    { id: 2027, places: ['chutes-fukuroda', 'pont-ryujin'] }, // Soba
    { id: 2026, places: ['parc-floral-ibaraki'] } // Melon
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
  console.log('Batch 2 terminé.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
