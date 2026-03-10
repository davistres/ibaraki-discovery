import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear database in an order that respects constraints
  await prisma.distance.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.festival.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('Database cleared.');

  // Load translations
  const placesTranslationsPath = path.join(__dirname, '..', 'src', 'locales', 'places-descriptions.json');
  let placesTranslations = { places: {} };
  if (fs.existsSync(placesTranslationsPath)) {
    placesTranslations = JSON.parse(fs.readFileSync(placesTranslationsPath, 'utf-8'));
  }

  // 1. Seed Categories
  const categoriesPath = path.join(__dirname, '..', 'src', 'data', 'categories.json');
  const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  
  const categoryIdMap = new Map();

  for (const category of categoriesData) {
    const nomFr = typeof category.nom === 'object' ? category.nom.fr : category.nom;
    const nomEn = typeof category.nom === 'object' ? category.nom.en : '';
    const nomJa = typeof category.nom === 'object' ? category.nom.ja : '';

    const createdCategory = await prisma.category.create({
      data: {
        group: category.group,
        nom: nomFr,
        nom_en: nomEn,
        nom_ja: nomJa,
      },
    });
    categoryIdMap.set(category.id, createdCategory.id);
  }
  console.log(`${categoriesData.length} categories seeded.`);

  // 2. Seed Places
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json');
  const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));

  for (const place of placesData) {
    if (!place.id || !categoryIdMap.has(place.region_id) || !categoryIdMap.has(place.ville_id) || !categoryIdMap.has(place.accessibilite_id)) {
        console.warn(`Skipping place with missing ID or invalid foreign key: ${place.nom}`);
        continue;
    }
    
    const trans = placesTranslations.places[place.id] || {};
    
    const connectCategories = place.category_ids
        .map(id => categoryIdMap.get(id))
        .filter(id => id)
        .map(id => ({ id }));

    await prisma.place.create({
      data: {
        id: place.id,
        nom: place.nom || '',
        nomJaponais: place.nomJaponais || '',
        description: place.description || '',
        descriptionLongue: place.descriptionLongue || '',
        imagePrincipale: place.imagePrincipale || '',
        images: place.images ? place.images.join(',') : '',
        adresse: place.adresse || '',
        lat: place.coordonnees?.lat || 0,
        lng: place.coordonnees?.lng || 0,
        horaires: place.horaires || '',
        tarif: place.tarif || '',
        dureeVisite: place.dureeVisite || '',
        acces: place.acces || '',
        siteWeb: place.siteWeb || '',
        googleMaps: place.googleMaps || '',
        // Translations from places-descriptions.json
        nom_en: trans.nom?.en || '',
        nom_ja: trans.nom?.ja || '',
        description_en: trans.en || '',
        description_ja: trans.ja || '',
        // Foreign keys
        region_id: categoryIdMap.get(place.region_id),
        ville_id: categoryIdMap.get(place.ville_id),
        accessibilite_id: categoryIdMap.get(place.accessibilite_id),
        categories: {
          connect: connectCategories,
        },
      },
    });
  }
  console.log(`${placesData.length} places seeded.`);

  // 3. Seed Festivals
  const festivalsPath = path.join(__dirname, '..', 'src', 'data', 'festivals.json');
  const festivalsData = JSON.parse(fs.readFileSync(festivalsPath, 'utf-8'));

  for (const festival of festivalsData) {
     if (!festival.id || !categoryIdMap.has(festival.region_id) || !categoryIdMap.has(festival.ville_id)) {
        console.warn(`Skipping festival with missing ID or invalid foreign key: ${festival.nom}`);
        continue;
    }

    const connectCategories = festival.category_ids
        .map(id => categoryIdMap.get(id))
        .filter(id => id)
        .map(id => ({ id }));

    await prisma.festival.create({
      data: {
        id: festival.id,
        nom: festival.nom || '',
        nomJaponais: festival.nomJaponais || '',
        description: festival.description || '',
        lieu: festival.lieu || '',
        periode: festival.periode || '',
        mois: festival.mois ? festival.mois.join(',') : '',
        activites: festival.activites ? festival.activites.join(',') : '',
        image: festival.image || '',
        ville_id: categoryIdMap.get(festival.ville_id),
        region_id: categoryIdMap.get(festival.region_id),
        categories: {
          connect: connectCategories,
        },
      },
    });
  }
  console.log(`${festivalsData.length} festivals seeded.`);

  // 4. Seed Distances (if file exists)
  const distancesPath = path.join(__dirname, '..', 'src', 'data', 'distances.json');
  if (fs.existsSync(distancesPath)) {
    const distancesData = JSON.parse(fs.readFileSync(distancesPath, 'utf-8'));
    for (const d of distancesData) {
      // Validate that the linked places/festivals exist to avoid foreign key errors
      // (Simplified for now, assuming JSON is valid)
      await prisma.distance.create({
        data: {
          fromType: d.fromType,
          fromId: d.fromId,
          toType: d.toType,
          toId: d.toId,
          distanceKm: d.distanceKm,
          durationMinutes: d.durationMinutes,
          placeFromId: d.fromType === 'place' ? d.fromId : null,
          placeToId: d.toType === 'place' ? d.toId : null,
          festivalFromId: d.fromType === 'festival' ? d.fromId : null,
          festivalToId: d.toType === 'festival' ? d.toId : null,
        }
      });
    }
    console.log(`${distancesData.length} distances seeded.`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
