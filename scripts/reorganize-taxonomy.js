import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Phase 1 : Basculement des groupes Activités vs Tags ---');

  // 1. Passage de "Activités" vers "Tags" (Ce que c'est)
  const toTags = [
    'Nature', 'Culture', 'Spiritualité', 'Histoire', 'Art', 
    'Gastronomie', 'Science & Technologie', 'Éducation', 
    'Jardins', 'Artisanat'
  ];
  
  for (const name of toTags) {
    await prisma.category.updateMany({
      where: { nom: name, group: 'Activités' },
      data: { group: 'Tags' }
    });
    console.log(`[Tag] ${name} déplacé.`);
  }

  // 2. Passage de "Tags" vers "Activités" (Ce que l'on fait)
  const toActivites = [
    'Observation d\'oiseaux', 'Vélo', 'Balade', 'Jogging', 
    'Méditation', 'Dégustation', 'Cueillette', 'Camping', 
    'Baignade', 'Pêche', 'Cours', 'Observation astronomique',
    'Hobikibune'
  ];

  for (const name of toActivites) {
    await prisma.category.updateMany({
      where: { nom: name, group: 'Tags' },
      data: { group: 'Activités' }
    });
    console.log(`[Activité] ${name} déplacée.`);
  }

  // 3. Cas spécial : Fusionner "Cyclisme" (Activité) et "Vélo" (Activité)
  // On va garder "Cyclisme" comme nom principal car c'est plus générique
  const velo = await prisma.category.findFirst({ where: { nom: 'Vélo' } });
  const cyclisme = await prisma.category.findFirst({ where: { nom: 'Cyclisme' } });

  if (velo && cyclisme) {
    console.log('Fusion de Vélo dans Cyclisme...');
    // Transférer les liens
    const places = await prisma.place.findMany({ where: { categories: { some: { id: velo.id } } } });
    for (const p of places) {
      await prisma.place.update({
        where: { id: p.id },
        data: { categories: { connect: { id: cyclisme.id } } }
      });
    }
    // Supprimer Vélo
    await prisma.category.delete({ where: { id: velo.id } });
    await prisma.category.update({ where: { id: cyclisme.id }, data: { nom: 'Cyclisme / Vélo' } });
  }

  console.log('--- Phase 1 terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
