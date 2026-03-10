import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Analyse et Liaison Approfondie : Bloc 1 & 2 (1-40) + Gastronomie ---');

  // 1. Création/Vérification des Tags Gastronomie spécifiques
  // Soba (2027) -> Fukuroda (Daigo), Ryujin (Hitachiota)
  await prisma.place.update({ where: { id: 'chutes-fukuroda' }, data: { categories: { connect: { id: 2027 } } } });
  await prisma.place.update({ where: { id: 'pont-ryujin' }, data: { categories: { connect: { id: 2027 } } } });

  // Natto (2023) -> Mito (Kodokan, Kairaku-en)
  await prisma.place.update({ where: { id: 'ecole-kodokan' }, data: { categories: { connect: { id: 2023 } } } });
  await prisma.place.update({ where: { id: 'kairaku-en' }, data: { categories: { connect: { id: 2023 } } } });
  await prisma.festival.update({ where: { id: 'mito-plum-festival' }, data: { categories: { connect: { id: 2023 } } } });

  // Melons (2026) -> Proche Ishioka (Flower Park)
  await prisma.place.update({ where: { id: 'parc-floral-ibaraki' }, data: { categories: { connect: { id: 2026 } } } });

  // Boeuf de Hitachi (2025) -> Tsukuba
  await prisma.festival.update({ where: { id: 'tsukuba-festival' }, data: { categories: { connect: { id: 2025 } } } });

  // 2. Création du Tag miroir "Famille" (ID 2042) pour tous les lieux ayant l'activité Famille (ID 55)
  const familyPlaces = await prisma.place.findMany({ where: { categories: { some: { id: 55 } } } });
  for (const p of familyPlaces) {
    await prisma.place.update({ where: { id: p.id }, data: { categories: { connect: { id: 2042 } } } });
  }
  const familyFestivals = await prisma.festival.findMany({ where: { categories: { some: { id: 55 } } } });
  for (const f of familyFestivals) {
    await prisma.festival.update({ where: { id: f.id }, data: { categories: { connect: { id: 2042 } } } });
  }

  // 3. Liaison systématique des Villes aux Tags (pour filtrage global)
  // Exemple: Mito (1922) lié à tous ses lieux
  const mitoPlaces = ['ecole-kodokan', 'kairaku-en', 'musee-art-moderne-ibaraki', 'lac-senba'];
  for (const id of mitoPlaces) {
    await prisma.place.update({ where: { id }, data: { categories: { connect: { id: 1922 } } } });
  }

  // Tsukuba (1924)
  const tsukubaPlaces = ['mont-tsukuba', 'sanctuaire-tsukuba', 'jaxa-tsukuba', 'tsukuba-expo-center', 'jardin-botanique-tsukuba', 'brasserie-inaba', 'temple-shutokuji'];
  for (const id of tsukubaPlaces) {
    await prisma.place.update({ where: { id }, data: { categories: { connect: { id: 1924 } } } });
  }

  console.log('--- Bloc 1 & 2 terminé ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
