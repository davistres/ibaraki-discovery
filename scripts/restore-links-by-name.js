import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('--- Restauration Intelligente des Liens (par Nom/Groupe) ---');

  // 1. Charger les données JSON
  const categoriesJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'categories.json'), 'utf-8'));
  const placesJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'places.json'), 'utf-8'));
  const festivalsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'festivals.json'), 'utf-8'));

  // 2. Créer une Map : ID_JSON -> { nom, group }
  const jsonCategoryMap = new Map();
  for (const cat of categoriesJson) {
    jsonCategoryMap.set(cat.id, { nom: cat.nom, group: cat.group });
  }

  // 3. Récupérer les catégories de la base de données
  const dbCategories = await prisma.category.findMany();
  
  // Créer une Map : "Groupe|Nom" -> ID_BASE
  const dbCategoryLookup = new Map();
  for (const cat of dbCategories) {
    const key = `${cat.group}|${cat.nom}`.toLowerCase();
    dbCategoryLookup.set(key, cat.id);
  }

  console.log(`Base de données : ${dbCategories.length} catégories trouvées.`);

  // 4. Mettre à jour les Places
  console.log('Mise à jour des liens pour les Lieux (Places)...');
  for (const p of placesJson) {
    const dbPlace = await prisma.place.findUnique({ where: { id: p.id } });
    if (!dbPlace) continue;

    const categoryIdsToConnect = [];

    // Conversion des IDs JSON vers IDs Base via Nom/Groupe
    if (p.category_ids) {
      for (const jsonId of p.category_ids) {
        const catInfo = jsonCategoryMap.get(jsonId);
        if (catInfo) {
          const key = `${catInfo.group}|${catInfo.nom}`.toLowerCase();
          const dbId = dbCategoryLookup.get(key);
          if (dbId) {
            categoryIdsToConnect.push({ id: dbId });
          }
        }
      }
    }

    // Gestion de la Région, Ville et Accessibilité (qui sont des relations directes)
    const updateData = {};
    
    const regionInfo = jsonCategoryMap.get(p.region_id);
    if (regionInfo) {
      const dbRegionId = dbCategoryLookup.get(`${regionInfo.group}|${regionInfo.nom}`.toLowerCase());
      if (dbRegionId) updateData.region_id = dbRegionId;
    }

    const villeInfo = jsonCategoryMap.get(p.ville_id);
    if (villeInfo) {
      const dbVilleId = dbCategoryLookup.get(`${villeInfo.group}|${villeInfo.nom}`.toLowerCase());
      if (dbVilleId) updateData.ville_id = dbVilleId;
    }

    const accessInfo = jsonCategoryMap.get(p.accessibilite_id);
    if (accessInfo) {
      const dbAccessId = dbCategoryLookup.get(`${accessInfo.group}|${accessInfo.nom}`.toLowerCase());
      if (dbAccessId) updateData.accessibilite_id = dbAccessId;
    }

    // Mise à jour de la relation many-to-many
    updateData.categories = {
      set: categoryIdsToConnect
    };

    await prisma.place.update({
      where: { id: p.id },
      data: updateData
    });
  }

  // 5. Mettre à jour les Festivals
  console.log('Mise à jour des liens pour les Festivals...');
  for (const f of festivalsJson) {
    const dbFestival = await prisma.festival.findUnique({ where: { id: f.id } });
    if (!dbFestival) continue;

    const categoryIdsToConnect = [];
    if (f.category_ids) {
      for (const jsonId of f.category_ids) {
        const catInfo = jsonCategoryMap.get(jsonId);
        if (catInfo) {
          const key = `${catInfo.group}|${catInfo.nom}`.toLowerCase();
          const dbId = dbCategoryLookup.get(key);
          if (dbId) {
            categoryIdsToConnect.push({ id: dbId });
          }
        }
      }
    }

    const updateData = {
      categories: { set: categoryIdsToConnect }
    };

    const regionInfo = jsonCategoryMap.get(f.region_id);
    if (regionInfo) {
      const dbRegionId = dbCategoryLookup.get(`${regionInfo.group}|${regionInfo.nom}`.toLowerCase());
      if (dbRegionId) updateData.region_id = dbRegionId;
    }

    const villeInfo = jsonCategoryMap.get(f.ville_id);
    if (villeInfo) {
      const dbVilleId = dbCategoryLookup.get(`${villeInfo.group}|${villeInfo.nom}`.toLowerCase());
      if (dbVilleId) updateData.ville_id = dbVilleId;
    }

    await prisma.festival.update({
      where: { id: f.id },
      data: updateData
    });
  }

  console.log('--- Restauration terminée ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
