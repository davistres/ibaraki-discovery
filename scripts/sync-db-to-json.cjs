/**
 * sync-db-to-json.cjs
 * 
 * Synchronise les fichiers JSON depuis la base de données Prisma.
 * À exécuter après chaque modification de la base de données :
 *   node scripts/sync-db-to-json.cjs
 * 
 * Fichiers mis à jour :
 *   - src/data/places.json
 *   - src/data/festivals.json
 *   - src/data/categories.json
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

const DATA_DIR = path.join(__dirname, '..', 'src', 'data')

// ── Utilitaires ────────────────────────────────────────────────────────────────

/** Parse une chaîne JSON ou retourne un tableau vide si invalide */
function parseJsonArray(str) {
  if (!str) return []
  try {
    const parsed = JSON.parse(str)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    // Si ce n'est pas du JSON, on retourne les valeurs séparées par des virgules
    return str.split(',').map(s => s.trim()).filter(Boolean)
  }
}

/** Sauvegarde un objet JSON dans un fichier avec formatage lisible */
function saveJson(filename, data) {
  const filepath = path.join(DATA_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`✅ ${filename} mis à jour (${data.length} entrées)`)
}

// ── Exports ────────────────────────────────────────────────────────────────────

async function exportCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' }
  })

  // Format : correspond exactement à la structure de categories.json
  const output = categories.map(cat => ({
    id: cat.id,
    group: cat.group,
    nom: cat.nom,
    // On inclut les traductions pour référence
    nom_en: cat.nom_en || undefined,
    nom_ja: cat.nom_ja || undefined,
  }))

  saveJson('categories.json', output)
  return categories
}

async function exportPlaces() {
  const places = await prisma.place.findMany({
    include: {
      region: true,
      ville: true,
      accessibilite: true,
      categories: true,
    },
    orderBy: { id: 'asc' }
  })

  const output = places.map(place => {
    // Reconstruire le tableau meilleuresSaisons depuis les catégories liées (groupe "Saisons")
    const meilleuresSaisons = place.categories
      .filter(cat => cat.group === 'Saisons')
      .map(cat => cat.nom)

    // Reconstruire les images depuis le champ JSON stocké en string
    let images = []
    try {
      images = JSON.parse(place.images)
    } catch {
      images = place.imagePrincipale ? [place.imagePrincipale] : []
    }

    return {
      id: place.id,
      nom: place.nom,
      nom_en: place.nom_en || undefined,
      nom_ja: place.nom_ja || undefined,
      nomJaponais: place.nomJaponais,
      description: place.description,
      description_en: place.description_en || undefined,
      description_ja: place.description_ja || undefined,
      descriptionLongue: place.descriptionLongue,
      descriptionLongue_en: place.descriptionLongue_en || undefined,
      descriptionLongue_ja: place.descriptionLongue_ja || undefined,
      imagePrincipale: place.imagePrincipale,
      images,
      adresse: place.adresse,
      adresse_en: place.adresse_en || undefined,
      adresse_ja: place.adresse_ja || undefined,
      coordonnees: {
        lat: place.lat,
        lng: place.lng,
      },
      horaires: place.horaires,
      horaires_en: place.horaires_en || undefined,
      horaires_ja: place.horaires_ja || undefined,
      tarif: place.tarif,
      tarif_en: place.tarif_en || undefined,
      tarif_ja: place.tarif_ja || undefined,
      dureeVisite: place.dureeVisite,
      dureeVisite_en: place.dureeVisite_en || undefined,
      dureeVisite_ja: place.dureeVisite_ja || undefined,
      acces: place.acces,
      acces_en: place.acces_en || undefined,
      acces_ja: place.acces_ja || undefined,
      siteWeb: place.siteWeb,
      googleMaps: place.googleMaps,
      region_id: place.region_id,
      ville_id: place.ville_id,
      accessibilite_id: place.accessibilite_id,
      meilleuresSaisons,
      // category_ids avec les vrais IDs de la DB
      category_ids: place.categories.map(cat => cat.id),
    }
  })

  saveJson('places.json', output)
}

async function exportFestivals() {
  const festivals = await prisma.festival.findMany({
    include: {
      region: true,
      ville: true,
      categories: true,
    },
    orderBy: { id: 'asc' }
  })

  const output = festivals.map(festival => ({
    id: festival.id,
    nom: festival.nom,
    nom_en: festival.nom_en || undefined,
    nom_ja: festival.nom_ja || undefined,
    nomJaponais: festival.nomJaponais,
    description: festival.description,
    description_en: festival.description_en || undefined,
    description_ja: festival.description_ja || undefined,
    lieu: festival.lieu,
    lieu_en: festival.lieu_en || undefined,
    lieu_ja: festival.lieu_ja || undefined,
    periode: festival.periode,
    periode_en: festival.periode_en || undefined,
    periode_ja: festival.periode_ja || undefined,
    mois: parseJsonArray(festival.mois),
    mois_en: festival.mois_en || undefined,
    mois_ja: festival.mois_ja || undefined,
    activites: parseJsonArray(festival.activites),
    activites_en: festival.activites_en || undefined,
    activites_ja: festival.activites_ja || undefined,
    image: festival.image,
    ville_id: festival.ville_id,
    region_id: festival.region_id,
    category_ids: festival.categories.map(cat => cat.id),
    coordonnees: {
      lat: festival.lat,
      lng: festival.lng,
    },
  }))

  saveJson('festivals.json', output)
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔄 Synchronisation DB → JSON en cours...\n')

  try {
    await exportCategories()
    await exportPlaces()
    await exportFestivals()

    console.log('\n✨ Synchronisation terminée avec succès !')
    console.log('   Les fichiers JSON sont maintenant à jour avec la base de données.\n')
  } catch (error) {
    console.error('\n❌ Erreur lors de la synchronisation :', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
