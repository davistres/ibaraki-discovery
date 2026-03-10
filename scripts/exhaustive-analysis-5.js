import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Deep Analysis Batch 5 : 1995 - 2014 ---');

  const updates = [
    { id: 1995, places: ['brasserie-inaba', 'brasserie-sudo-honke'] },
    { id: 1996, places: ['brasserie-inaba', 'brasserie-sudo-honke'] },
    { id: 1997, places: ['brasserie-inaba', 'brasserie-sudo-honke', 'aqua-world-oarai', 'village-nishiyama'] },
    { id: 1998, places: ['jaxa-tsukuba', 'tsukuba-expo-center'] },
    { id: 1999, places: ['jaxa-tsukuba', 'tsukuba-expo-center'] },
    { id: 2000, places: ['tsukuba-expo-center', 'hitachi-civic-center-science-museum'] },
    { id: 2001, places: ['jardin-botanique-tsukuba', 'parc-floral-ibaraki'] },
    { id: 2002, places: ['village-nishiyama', 'musee-ceramique-ibaraki'] },
    { id: 2003, places: ['village-nishiyama', 'musee-ceramique-ibaraki'] },
    { id: 2004, places: ['village-nishiyama'] },
    { id: 2005, places: ['village-nishiyama', 'yuki-tsumugi-yakata'] },
    { id: 2006, places: ['kasama-inari'] },
    { id: 2007, places: ['lac-kasumigaura', 'ville-itako-canaux'] },
    { id: 2008, places: ['marais-watarase', 'lac-senba'] },
    { id: 2009, places: ['lac-kasumigaura', 'plage-hiraiso'] },
    { id: 2010, places: ['temple-amabiki-kannon', 'temple-shutokuji', 'temple-zuishoin', 'temple-sairenji-itako', 'temple-choso-ji'] },
    { id: 2011, places: ['kashima-jingu', 'kasama-inari', 'oarai-isosaki', 'sanctuaire-tsukuba', 'sanctuaire-oiwa', 'sanctuaire-hoshino'] },
    { id: 2012, places: ['lapoppo-namegata-farmers-village'] },
    { id: 2013, places: ['lapoppo-namegata-farmers-village'] },
    { id: 2014, places: ['lapoppo-namegata-farmers-village'] }
  ];

  for (const update of updates) {
    if (update.places) {
      for (const pid of update.places) {
        await prisma.place.update({ where: { id: pid }, data: { categories: { connect: { id: update.id } } } });
      }
    }
  }
  console.log('Batch 5 terminé.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
