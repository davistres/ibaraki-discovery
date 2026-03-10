import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Deep Analysis Batch 4 : 1975 - 1994 ---');

  const updates = [
    { id: 1975, places: ['oarai-isosaki', 'chutes-fukuroda', 'plage-takado-kohama'] },
    { id: 1976, places: ['aqua-world-oarai', 'musee-art-moderne-ibaraki', 'jaxa-tsukuba', 'tsukuba-expo-center', 'hitachi-civic-center-science-museum', 'musee-ceramique-ibaraki', 'koga-ville-musee'] },
    { id: 1977, places: ['kairaku-en', 'ecole-kodokan', 'kashima-jingu', 'kasama-inari', 'yuki-tsumugi-yakata'], festivals: ['itako-iris-festival', 'kasama-chrysanthemum-festival'] },
    { id: 1978, places: ['tsukuba-expo-center', 'hitachi-civic-center-science-museum', 'aqua-world-oarai'], festivals: ['rock-in-japan'] },
    { id: 1979, places: ['jaxa-tsukuba', 'hitachi-seaside-park'], festivals: ['rock-in-japan'] },
    { id: 1980, places: ['oarai-marine-tower'], festivals: ['kasama-lantern-illumination-festival', 'tsuchiura-fireworks'] },
    { id: 1981, places: ['kairaku-en'], festivals: ['makabe-cherry-blossom-festival', 'koga-peach-blossom-festival'] },
    { id: 1982, places: ['musee-art-moderne-ibaraki', 'musee-ceramique-ibaraki', 'koga-ville-musee', 'jaxa-tsukuba', 'hitachi-civic-center-science-museum'] },
    { id: 1983, places: ['grand-bouddha-ushiku', 'musee-art-moderne-ibaraki', 'nishiyamaso', 'pont-ryujin', 'oarai-marine-tower'] },
    { id: 1984, places: ['temple-shutokuji', 'temple-zuishoin', 'sanctuaire-oiwa', 'kairaku-en'] },
    { id: 1985, places: ['lac-senba', 'lac-kasumigaura'] },
    { id: 1986, places: ['lac-kasumigaura', 'oarai-marine-tower', 'plage-ajigaura'] },
    { id: 1987, places: ['kairaku-en'] },
    { id: 1988, places: ['plage-ajigaura', 'oarai-isosaki', 'plage-hiraiso', 'plage-takado-kohama'] },
    { id: 1989, places: ['plage-ajigaura', 'plage-hiraiso', 'plage-takado-kohama'] },
    { id: 1990, places: ['chateau-oda'] },
    { id: 1991, places: ['chateau-oda'] },
    { id: 1992, places: ['chateau-oda', 'ecole-kodokan'] },
    { id: 1993, places: ['temple-shutokuji', 'temple-zuishoin'] },
    { id: 1994, places: ['temple-shutokuji', 'temple-zuishoin', 'sanctuaire-oiwa'] }
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
  console.log('Batch 4 terminé.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
