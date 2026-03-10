import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const newPlace = {
  id: 'temple-yakuo-in',
  nom: "Le Temple Yakuō-in (薬王院)",
  nomJaponais: "薬王院",
  description: "Un très ancien temple de l'école Tendai entouré de nature, réputé pour son architecture remarquable, notamment son majestueux bâtiment principal (Hondō) et sa grande porte à toit de chaume.",
  descriptionLongue: "Le Yakuō-in est un temple historique dont la fondation remonte au début de l'époque Heian (autour du 9e siècle), sur ordre de l'empereur Kanmu. À l'époque d'Edo, il est devenu un lieu de culte profondément respecté par la famille Tokugawa de Mito, notamment par Tokugawa Mitsukuni. Son architecture est époustouflante pour les amateurs de sanctuaires traditionnels : son Hondō (salle principale) est classé Bien Culturel Important du Japon, et son impressionnante porte Niōmon (protégée par les statues des gardiens Niō) ainsi que sa statue principale du bouddha de la médecine (Yakushi Nyorai) sont des Biens Culturels de la préfecture. Le temple est peu touristique, ce qui offre une expérience mystique et silencieuse au milieu d'une belle végétation.",
  adresse: "682 Motoyoshidacho, Mito-shi, Ibaraki-ken 310-0836, Japon (〒310-0836 茨城県水戸市元吉田町682)",
  imagePrincipale: "",
  images: "[]", // Sérialisé en String pour SQLite
  lat: 36.3545,
  lng: 140.4785,
  horaires: "Enceinte accessible 24h/24 (Bureau Goshuin : 9h00-17h00)",
  tarif: "L'accès à l'enceinte est gratuit.",
  dureeVisite: "45 minutes à 1 heure",
  acces: "En bus : Depuis la gare JR de Mito, bus direction 'Daimachi' (台町経由), arrêt 'Yakuō-in-mae' (薬王院前). Environ 20 minutes de bus ou 25-30 minutes à pied.",
  siteWeb: "https://www.yakuouin.jp/",
  googleMaps: "https://www.google.com/maps/search/?api=1&query=Yakuō-in+Temple+Mito",
  region_id: 1915, // Centre
  ville_id: 1922,  // Mito
  accessibilite_id: 1945, // Facile
  nom_en: "Yakuō-in Temple",
  nom_ja: "薬王院",
  description_en: "An ancient Tendai school temple surrounded by nature, famous for its Hondo and thatched gate.",
  description_ja: "平安時代初期に建立された天台宗の古刹。本堂や茅葺きの仁王門など貴重な建築物で知られています。",
  category_ids: [2045, 1994, 1952, 1949, 1950, 1955, 1983, 2010, 1948] 
};

async function main() {
  console.log(`--- Création du nouveau lieu: ${newPlace.id} (Version 2) ---`);

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
    console.log('Prisma: Lieu créé ou mis à jour.');
  } catch (e) {
    console.error('Erreur Prisma:', e.message);
  }

  // 2. Ajouter à src/data/places.json
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json');
  if (fs.existsSync(placesPath)) {
    const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));
    const index = placesData.findIndex(p => p.id === newPlace.id);
    
    // Structure JSON frontend
    const jsonEntry = {
        ...newPlace,
        images: [], // Le frontend attend un vrai tableau
        coordonnees: { lat: newPlace.lat, lng: newPlace.lng },
        meilleuresSaisons: ["Printemps", "Automne"]
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
    console.log('JSON: src/data/places.json mis à jour.');
  }

  console.log('--- Création terminée ---');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
