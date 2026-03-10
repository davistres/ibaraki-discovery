import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const newPlace = {
  id: 'etowa-kasama',
  nom: "ETOWA KASAMA (エトワ笠間)",
  nomJaponais: "エトワ笠間",
  description: "Un luxueux 'Glamping' perché au sommet d'une montagne, offrant une évasion parfaite en pleine nature avec design nordique et feux de camp.",
  descriptionLongue: "Situé près du sommet du mont Atago dans la ville de Kasama, Etowa Kasama propose une expérience de plein air haut de gamme, combinant l'immersion en forêt avec le confort d'un hôtel de luxe. Les hébergements, décorés par la marque ACTUS, incluent des tentes élégantes et des cabanes panoramiques avec terrasses. L'expérience est axée sur la convivialité : bar en plein air sous les étoiles, feux de camp pour griller des guimauves, et dîners BBQ mettant à l'honneur le bœuf de Hitachi. C'est un lieu idéal pour vivre le Japon sauvage sans sacrifier son confort.",
  adresse: "2775-7 Kamigo, Kasama, Ibaraki 319-0201, Japon (〒319-0201 茨城県笠間市上郷2775-7)",
  imagePrincipale: "",
  images: "[]",
  lat: 36.2855,
  lng: 140.2815,
  horaires: "Check-in : 16h00-18h00 | Check-out : jusqu'à 11h00",
  tarif: "Nuit seule : à partir de 15 000 ¥ | Demi-pension (BBQ) : 21 000 ¥ à 34 000 ¥ par personne.",
  dureeVisite: "1 nuit ou plus",
  acces: "En train + Taxi : Gare JR Iwama (ligne Joban), puis 11 min de taxi. En voiture : Sortie 'Iwama IC' sur l'autoroute Jōban, puis 13 min de route. Parking gratuit sur place.",
  siteWeb: "https://www.cigr.co.jp/etowa/kasama/",
  googleMaps: "https://www.google.com/maps/search/?api=1&query=ETOWA+KASAMA+エトワ笠間",
  region_id: 1915, // Centre
  ville_id: 1928,  // Kasama
  accessibilite_id: 1946, // Modéré (car en montagne)
  nom_en: "ETOWA KASAMA",
  nom_ja: "エトワ笠間",
  description_en: "A luxury glamping site on Mount Atago, featuring Nordic-style cabins and outdoor bonfires.",
  description_ja: "愛宕山の山頂付近に位置する、空に近いグランピング施設。北欧テイストのキャビンや星空の下での焚き火が楽しめます。",
  category_ids: [2020, 1960, 1996, 2045, 1952, 2037, 55, 1948, 1983, 1986, 1971, 2025, 2050, 2051] 
};

async function main() {
  console.log(`--- Création de ETOWA KASAMA ---`);

  // 1. Ajouter à Prisma
  try {
    const { category_ids, ...data } = newPlace;
    await prisma.place.upsert({
      where: { id: newPlace.id },
      update: {
        ...data,
        categories: { set: category_ids.map(id => ({ id })) }
      },
      create: {
        ...data,
        categories: { connect: category_ids.map(id => ({ id })) }
      }
    });
    console.log('Prisma: Lieu créé avec succès.');
  } catch (e) {
    console.error('Erreur Prisma:', e.message);
  }

  // 2. Ajouter à src/data/places.json
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json');
  if (fs.existsSync(placesPath)) {
    const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));
    const index = placesData.findIndex(p => p.id === newPlace.id);
    
    const jsonEntry = {
        ...newPlace,
        images: [],
        coordonnees: { lat: newPlace.lat, lng: newPlace.lng },
        meilleuresSaisons: ["Été", "Automne"]
    };
    delete jsonEntry.lat;
    delete jsonEntry.lng;
    delete jsonEntry.nom_en;
    delete jsonEntry.nom_ja;
    delete jsonEntry.description_en;
    delete jsonEntry.description_ja;

    if (index !== -1) {
      placesData[index] = jsonEntry;
    } else {
      placesData.push(jsonEntry);
    }
    
    fs.writeFileSync(placesPath, JSON.stringify(placesData, null, 2), 'utf-8');
    console.log('JSON: places.json mis à jour.');
  }

  console.log('--- Opération terminée ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
