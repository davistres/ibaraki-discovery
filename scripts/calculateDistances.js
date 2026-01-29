import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

function calculateDrivingTime(distanceKm) {
  const roadFactor = 1.3
  const actualDistance = distanceKm * roadFactor
  const averageSpeedKmh = 50
  const durationHours = actualDistance / averageSpeedKmh
  const durationMinutes = Math.round(durationHours * 60)
  
  return durationMinutes
}

async function main() {
  console.log('Chargement des données...')
  
  const placesPath = path.join(__dirname, '..', 'src', 'data', 'places.json')
  const festivalsPath = path.join(__dirname, '..', 'src', 'data', 'festivals.json')
  
  const placesData = JSON.parse(fs.readFileSync(placesPath, 'utf-8'))
  const festivalsData = JSON.parse(fs.readFileSync(festivalsPath, 'utf-8'))
  
  const locations = []
  
  for (const place of placesData) {
    if (place.coordonnees && place.coordonnees.lat && place.coordonnees.lng) {
      locations.push({
        type: 'place',
        id: place.id,
        nom: place.nom,
        lat: place.coordonnees.lat,
        lng: place.coordonnees.lng
      })
    }
  }
  
  for (const festival of festivalsData) {
    if (festival.coordonnees && festival.coordonnees.lat && festival.coordonnees.lng) {
      locations.push({
        type: 'festival',
        id: festival.id,
        nom: festival.nom,
        lat: festival.coordonnees.lat,
        lng: festival.coordonnees.lng
      })
    }
  }
  
  console.log(`${locations.length} lieux avec coordonnées trouvés`)
  console.log(`Calcul de ${locations.length * (locations.length - 1)} distances...`)
  
  await prisma.distance.deleteMany({})
  console.log('Anciennes distances supprimées')
  
  let count = 0
  const batchSize = 100
  const distances = []
  
  for (let i = 0; i < locations.length; i++) {
    for (let j = 0; j < locations.length; j++) {
      if (i === j) continue
      
      const from = locations[i]
      const to = locations[j]
      
      const distanceKm = haversineDistance(from.lat, from.lng, to.lat, to.lng)
      const durationMinutes = calculateDrivingTime(distanceKm)
      
      const distanceData = {
        fromType: from.type,
        fromId: from.id,
        toType: to.type,
        toId: to.id,
        distanceKm: Math.round(distanceKm * 100) / 100,
        durationMinutes: durationMinutes
      }
      
      if (from.type === 'place') distanceData.placeFromId = from.id
      if (to.type === 'place') distanceData.placeToId = to.id
      if (from.type === 'festival') distanceData.festivalFromId = from.id
      if (to.type === 'festival') distanceData.festivalToId = to.id
      
      distances.push(distanceData)
      count++
      
      if (distances.length >= batchSize) {
        await prisma.distance.createMany({ data: distances })
        distances.length = 0
        console.log(`${count} distances calculées...`)
      }
    }
  }
  
  if (distances.length > 0) {
    await prisma.distance.createMany({ data: distances })
  }
  
  console.log(`✅ ${count} distances calculées et enregistrées !`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

