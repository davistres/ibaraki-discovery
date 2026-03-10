import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Deep Analysis Batch 6 : 2015 - 2044 ---');

  const updates = [
    { id: 2015, places: ['lac-kasumigaura'] }, // Lac saumâtre
    { id: 2016, places: ['marais-watarase'] }, // Site Ramsar
    { id: 2017, places: ['oarai-isosaki', 'plage-hiraiso', 'cote-rocheuse-kitaiibaraki'] }, // Villages de pêcheurs
    { id: 2019, places: ['cote-rocheuse-kitaiibaraki', 'oarai-isosaki'] }, // Côte sauvage
    { id: 2020, places: ['gorges-kuji-gawa', 'vallee-mont-yamizo'] }, // Camping
    { id: 2021, places: ['mont-tsukuba'] }, // Obs. astronomique
    { id: 2022, places: ['vallee-mont-yamizo', 'chutes-fukuroda'] }, // Source d'eau
    { id: 2023, places: ['kairaku-en', 'ecole-kodokan'] }, // Nattō (Mito)
    { id: 2025, places: ['kairaku-en', 'mont-tsukuba'] }, // Boeuf de Hitachi
    { id: 2026, places: ['parc-floral-ibaraki'] }, // Melons
    { id: 2027, places: ['chutes-fukuroda', 'pont-ryujin'] }, // Soba
    { id: 2028, places: ['chutes-fukuroda'] }, // Kenchin-jiru
    { id: 2029, places: ['plage-hiraiso', 'lapoppo-namegata-farmers-village'] }, // Marché local
    { id: 2030, places: ['lapoppo-namegata-farmers-village'] }, // Restau de ferme
    { id: 2031, places: ['ville-itako-canaux', 'ecole-kodokan'] }, // Train
    { id: 2032, places: ['hitachi-seaside-park', 'chutes-fukuroda'] }, // Bus
    { id: 2033, places: ['vallee-mont-yamizo', 'sanctuaire-oiwa'] }, // Voiture
    { id: 2034, places: ['lac-kasumigaura', 'mont-tsukuba'] }, // Vélo
    { id: 2035, places: ['oarai-marine-tower'] }, // Aéroport
    { id: 2036, places: ['plage-ajigaura', 'chutes-fukuroda'] }, // Ryokan
    { id: 2037, places: ['lac-senba'] }, // Hôtel
    { id: 2038, places: ['plage-ajigaura'] }, // Minshuku
    { id: 2039, places: ['ecole-kodokan', 'mont-tsukuba'] }, // Office de tourisme
    { id: 2040, places: ['temple-amabiki-kannon', 'aqua-world-oarai'] }, // Animaux
    { id: 2042, places: ['hitachi-seaside-park', 'grand-bouddha-ushiku', 'aqua-world-oarai', 'tsukuba-expo-center', 'hitachi-civic-center-science-museum', 'parc-floral-ibaraki', 'lapoppo-namegata-farmers-village'] }, // Tag Famille
    { id: 2043, places: ['aqua-world-oarai'] }, // Aquarium
    { id: 2044, places: ['aqua-world-oarai', 'hitachi-civic-center-science-museum', 'tsukuba-expo-center'] } // Enfant
  ];

  for (const update of updates) {
    if (update.places) {
      for (const pid of update.places) {
        await prisma.place.update({ where: { id: pid }, data: { categories: { connect: { id: update.id } } } });
      }
    }
  }
  console.log('Batch 6 terminé. Toutes les catégories ont été analysées.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
