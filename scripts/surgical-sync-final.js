import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase finale de réparation (Traductions + Kasama) ---');

  const validPlaceIds = new Set((await prisma.place.findMany({ select: { id: true } })).map(p => p.id));
  const existingCategories = new Set((await prisma.category.findMany({ select: { id: true } })).map(c => c.id));

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
        // On ne connecte que les catégories qui existent dans la base
        const availableCategories = p.category_ids.filter(id => existingCategories.has(id));
        updateData.categories = {
            set: availableCategories.map(id => ({ id }))
        };
    }

    await prisma.place.update({
      where: { id: p.id },
      data: updateData
    });
  }
  
  console.log('--- Réparation des traductions et de Kasama Inari terminée ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
