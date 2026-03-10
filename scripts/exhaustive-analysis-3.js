import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Deep Analysis Batch 3 : 1955 - 1974 ---');

  const updates = [
    { id: 1955, places: ['ecole-kodokan', 'kairaku-en', 'kashima-jingu', 'koga-ville-musee', 'nishiyamaso', 'yuki-tsumugi-yakata'], festivals: ['makabe-cherry-blossom-festival'] },
    { id: 1956, places: ['village-nishiyama', 'yuki-tsumugi-yakata', 'musee-ceramique-ibaraki'] },
    { id: 1957, places: ['hitachi-seaside-park', 'lac-kasumigaura', 'mont-tsukuba'] },
    { id: 1958, places: ['lac-kasumigaura', 'gorges-kuji-gawa'] },
    { id: 1959, places: ['ecole-kodokan', 'jaxa-tsukuba', 'tsukuba-expo-center', 'jardin-botanique-tsukuba', 'hitachi-civic-center-science-museum'] },
    { id: 1960, places: ['lac-senba', 'temple-amabiki-kannon', 'parc-kasama-no-mori'] },
    { id: 1961, places: ['mont-tsukuba', 'pont-ryujin'] },
    { id: 1962, places: ['musee-art-moderne-ibaraki', 'musee-ceramique-ibaraki', 'village-nishiyama', 'colline-arts-kasama', 'cote-rocheuse-kitaiibaraki'] },
    { id: 1963, places: ['brasserie-inaba', 'brasserie-sudo-honke', 'plage-hiraiso'] },
    { id: 1964, places: ['jaxa-tsukuba', 'tsukuba-expo-center', 'hitachi-civic-center-science-museum'] },
    { id: 1965, places: ['lapoppo-namegata-farmers-village'] },
    { id: 1966, festivals: ['mito-plum-festival', 'itako-iris-festival', 'kasama-chrysanthemum-festival', 'koga-peach-blossom-festival', 'makabe-cherry-blossom-festival'] },
    { id: 1967, festivals: ['rock-in-japan'] },
    { id: 1968, festivals: ['oarai-anko-festival'] },
    { id: 1969, festivals: ['tsuchiura-fireworks', 'tsukuba-festival', 'kasama-lantern-illumination-festival'] },
    { id: 1970, places: ['hitachi-seaside-park', 'kairaku-en', 'mont-tsukuba', 'kashima-jingu', 'grand-bouddha-ushiku', 'chutes-fukuroda', 'oarai-isosaki'], festivals: ['mito-plum-festival', 'tsuchiura-fireworks'] },
    { id: 1971, places: ['hitachi-seaside-park', 'oarai-isosaki', 'lac-senba', 'pont-ryujin'], festivals: ['kasama-lantern-illumination-festival'] },
    { id: 1972, places: ['kairaku-en', 'ecole-kodokan', 'kashima-jingu', 'yuki-tsumugi-yakata', 'nishiyamaso'], festivals: ['kasama-chrysanthemum-festival'] },
    { id: 1973, places: ['kashima-jingu', 'kasama-inari', 'oarai-isosaki', 'sanctuaire-tsukuba', 'sanctuaire-oiwa', 'temple-amabiki-kannon', 'temple-shutokuji', 'temple-zuishoin', 'temple-sairenji-itako', 'temple-choso-ji', 'sanctuaire-hoshino'] },
    { id: 1974, places: ['grand-bouddha-ushiku', 'chutes-fukuroda', 'pont-ryujin', 'temple-zuishoin'], festivals: ['rock-in-japan'] }
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
  console.log('Batch 3 terminé.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
