import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function main() {
  console.log('Export des distances vers JSON...')
  
  try {
    const distances = await prisma.distance.findMany({
      orderBy: [
        { fromType: 'asc' },
        { fromId: 'asc' },
        { distanceKm: 'asc' }
      ]
    })
    
    console.log(`${distances.length} distances trouvées`)
    
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'distances.json')
    fs.writeFileSync(outputPath, JSON.stringify(distances, null, 2), 'utf-8')
    
    console.log(`✓ Distances exportées vers ${outputPath}`)
    console.log(`✓ Fichier créé avec succès!`)
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

