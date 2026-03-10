import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('--- Démarrage de la réparation chirurgicale (Correction finale) ---');

  // Récupérer les IDs valides dès le début
  const validPlaceIds = new Set((await prisma.place.findMany({ select: { id: true } })).map(p => p.id));
  const validFestivalIds = new Set((await prisma.festival.findMany({ select: { id: true } })).map(f => f.id));

  // 1. Réparation de la catégorie "Famille"
  console.log('1. Réparation de la catégorie "Famille"...');
  await prisma.category.upsert({
    where: { id: 55 },
    update: { group: 'Activités', nom: 'Famille', nom_en: 'Family', nom_ja: 'ファミリー' },
    create: { id: 55, group: 'Activités', nom: 'Famille', nom_en: 'Family', nom_ja: 'ファミリー' }
  });

  // 2. Restauration de la table Distance
  console.log('2. Restauration de la table Distance...');
  const distancesPath = path.join(__dirname, '..', 'src', 'data', 'distances.json');
  if (fs.existsSync(distancesPath)) {
    const distancesData = JSON.parse(fs.readFileSync(distancesPath, 'utf-8'));
    if (distancesData.length > 0) {
      await prisma.distance.deleteMany({});
      let restoredCount = 0;
      let skippedCount = 0;
      const batchSize = 100;
      for (let i = 0; i < distancesData.length; i += batchSize) {
        const batch = distancesData.slice(i, i + batchSize);
        const validBatch = batch.filter(d => {
            const fromValid = d.fromType === 'place' ? validPlaceIds.has(d.fromId) : validFestivalIds.has(d.fromId);
            const toValid = d.toType === 'place' ? validPlaceIds.has(d.toId) : validFestivalIds.has(d.toId);
            return fromValid && toValid;
        });
        skippedCount += (batch.length - validBatch.length);
        await Promise.all(validBatch.map(d => 
          prisma.distance.create({
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
          }).catch(() => skippedCount++)
        ));
        restoredCount += validBatch.length;
      }
      console.log(`${restoredCount} distances restaurées.`);
    }
  }

  // 3. Restauration des traductions et mise à jour Kasama Inari
  console.log('3. Restauration des traductions et mise à jour des lieux...');
  const translationsPath = path.join(__dirname, '..', 'src', 'locales', 'places-descriptions.json');
  const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf-8')).places;
  const placesJsonPath = path.join(__dirname, '..', 'src', 'data', 'places.json');
  const placesJson = JSON.parse(fs.readFileSync(placesJsonPath, 'utf-8'));

  for (const p of placesJson) {
    if (!validPlaceIds.has(p.id)) continue;

    const trans = translations[p.id] || {};
    const updateData = {
      nom_en: trans.nom?.en || '',
      nom_ja: trans.nom?.ja || '',
      description_en: trans.en || '',
      description_ja: trans.ja || '',
    };

    if (p.id === 'kasama-inari') {
      updateData.siteWeb = "http://www.kasama.or.jp/sanpai/keidai.html";
      updateData.googleMaps = "https://www.google.com/maps/search/?api=1&query=Kasama+Inari+Shrine+Sanctuary";
    }

    if (p.category_ids) {
        updateData.categories = {
            set: p.category_ids.map(id => ({ id }))
        };
    }

    await prisma.place.update({
      where: { id: p.id },
      data: updateData
    });
  }
  
  try {
      await prisma.category.delete({ where: { id: 2041 } });
      console.log('Ancienne catégorie 2041 supprimée.');
  } catch (e) {}

  console.log('--- Réparation terminée avec succès ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
