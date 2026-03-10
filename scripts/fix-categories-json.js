import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  
  // On reformate pour correspondre à ce que le frontend attend (si possible)
  // Ou on adapte le frontend. Ici, on va re-formater le JSON.
  const formatted = categories.map(c => ({
    id: c.id,
    group: c.group,
    nom: c.nom // On garde le nom FR par défaut pour l'affichage initial
  }));

  fs.writeFileSync('src/data/categories.json', JSON.stringify(formatted, null, 2), 'utf-8');
  console.log('categories.json mis à jour avec succès.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
