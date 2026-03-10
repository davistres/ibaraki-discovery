import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const placeId = 'temple-choso-ji';
const updateData = {
  nom: "Temple Chōshō-ji (長勝寺)",
  nomJaponais: "長勝寺",
  description: "Un prestigieux temple zen fondé à la fin du XIIe siècle par le premier shogun du Japon. Célèbre pour ses cerisiers et son histoire liée aux samouraïs.",
  descriptionLongue: "Le temple Chōshō-ji a été fondé en 1185 par Minamoto no Yoritomo, juste avant qu'il ne s'installe à Kamakura, afin de prier pour la longévité de sa fortune militaire. Appartenant à l'école Rinzai (bouddhisme zen), le temple a traversé les siècles et a été largement restauré à l'époque d'Edo sous le patronage de Tokugawa Mitsukuni (le seigneur de Mito). Son hall principal (Butsuden), avec son toit de chaume d'influence architecturale chinoise, est un chef-d'œuvre. On y trouve également une monumentale cloche en bronze datant de 1330 (classée Bien Culturel Important National) ainsi qu'une stèle gravée d'un poème du célèbre haïkiste Matsuo Bashō, qui a visité la région.",
  adresse: "428 Itako, Itako-shi, Ibaraki-ken 311-2424, Japon (〒311-2424 茨城県潮来市潮来428)",
  tarif: "Gratuit (Visite guidée payante sur réservation)",
  horaires: "Enceinte en accès libre (Bureau Goshuin : 9h00-17h00)",
  dureeVisite: "30-45 minutes",
  acces: "En train : Descendez à la gare JR Itako (ligne Kashima), le temple se trouve à environ 10-15 minutes à pied. L'accès est simple et offre une belle promenade à travers Itako.",
  googleMaps: "https://www.google.com/maps/search/?api=1&query=Chōshō-ji+Temple+Itako",
  siteWeb: "https://www.city.itako.lg.jp/kankou/kankou-itakokankou/kankou-spot/kankou-mainspot/page001390.html"
};

async function main() {
  console.log(`--- Mise à jour complète pour ${placeId} ---`);

  // 1. Mettre à jour Prisma
  try {
    await prisma.place.update({
      where: { id: placeId },
      data: updateData
    });
    console.log(`Prisma: Lieu ${placeId} mis à jour.`);
  } catch (e) {
    console.error(`Erreur Prisma:`, e.message);
  }

  // 2. Mettre à jour src/data/places.json
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json');
  if (fs.existsSync(placesPath)) {
    const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));
    const place = placesData.find(p => p.id === placeId);
    if (place) {
      Object.assign(place, updateData);
      fs.writeFileSync(placesPath, JSON.stringify(placesData, null, 2), 'utf-8');
      console.log(`JSON: src/data/places.json mis à jour.`);
    }
  }

  console.log('--- Mise à jour terminée ---');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
