import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cityCoordinates = {
  20: { lat: 36.3667, lng: 140.4667, nom: 'Mito' },
  21: { lat: 36.3967, lng: 140.5342, nom: 'Hitachinaka' },
  22: { lat: 36.0833, lng: 140.0833, nom: 'Tsukuba' },
  23: { lat: 35.9667, lng: 140.6333, nom: 'Kashima' },
  24: { lat: 35.9833, lng: 140.2167, nom: 'Ushiku' },
  25: { lat: 36.7667, lng: 140.3667, nom: 'Daigo' },
  26: { lat: 36.3833, lng: 140.2667, nom: 'Kasama' },
  27: { lat: 36.3167, lng: 140.5833, nom: 'Oarai' },
  28: { lat: 36.0833, lng: 140.2000, nom: 'Tsuchiura' },
  29: { lat: 35.9333, lng: 140.5500, nom: 'Itako' },
  30: { lat: 36.1833, lng: 139.7000, nom: 'Koga' },
  31: { lat: 36.5333, lng: 140.5167, nom: 'Hitachiota' },
  32: { lat: 36.6000, lng: 140.6500, nom: 'Hitachi' },
  33: { lat: 36.7167, lng: 140.7167, nom: 'Takahagi' },
  34: { lat: 36.1833, lng: 140.2833, nom: 'Ishioka' },
  35: { lat: 36.8000, lng: 140.7500, nom: 'KitaIbaraki' },
  36: { lat: 36.3000, lng: 139.8833, nom: 'Yuki' },
  37: { lat: 36.3167, lng: 140.1000, nom: 'Sakuragawa' },
  38: { lat: 36.0333, lng: 140.3833, nom: 'Kasumigaura' },
  39: { lat: 35.9500, lng: 140.4833, nom: 'Namegata' },
  40: { lat: 36.1667, lng: 140.5167, nom: 'Hokota' },
  41: { lat: 36.3167, lng: 140.4333, nom: 'Ibaraki-machi' }
}

async function main() {
  console.log('Mise à jour des coordonnées manquantes...')
  
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json')
  const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'))
  
  let updated = 0
  
  for (const place of placesData) {
    if (!place.coordonnees || !place.coordonnees.lat || !place.coordonnees.lng || 
        place.coordonnees.lat === 0 || place.coordonnees.lng === 0) {
      
      const cityCoord = cityCoordinates[place.ville_id]
      if (cityCoord) {
        const offset = (Math.random() - 0.5) * 0.02
        place.coordonnees = {
          lat: Number((cityCoord.lat + offset).toFixed(4)),
          lng: Number((cityCoord.lng + offset).toFixed(4))
        }
        console.log(`✓ ${place.nom} (${cityCoord.nom}): ${place.coordonnees.lat}, ${place.coordonnees.lng}`)
        updated++
      }
    }
  }
  
  fs.writeFileSync(placesPath, JSON.stringify(placesData, null, 2), 'utf-8')
  console.log(`\n✅ ${updated} lieux mis à jour avec des coordonnées estimées`)
  console.log(`📍 Total de lieux avec coordonnées: ${placesData.filter(p => p.coordonnees?.lat && p.coordonnees?.lng).length}/${placesData.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

