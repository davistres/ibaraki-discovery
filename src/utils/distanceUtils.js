import distancesData from '../data/distances.json'

export async function getDistance(fromType, fromId, toType, toId) {
  try {
    const distance = distancesData.find(d =>
      d.fromType === fromType &&
      d.fromId === fromId &&
      d.toType === toType &&
      d.toId === toId
    )

    return distance || null
  } catch (error) {
    console.error('Error fetching distance:', error)
    return null
  }
}

export async function getDistancesFrom(type, id) {
  try {
    const distances = distancesData
      .filter(d => d.fromType === type && d.fromId === id)
      .sort((a, b) => a.distanceKm - b.distanceKm)

    return distances
  } catch (error) {
    console.error('Error fetching distances:', error)
    return []
  }
}

export async function getDistanceMatrix(locationIds) {
  try {
    const distances = distancesData.filter(d =>
      locationIds.includes(d.fromId) && locationIds.includes(d.toId)
    )

    return distances
  } catch (error) {
    console.error('Error fetching distance matrix:', error)
    return []
  }
}

export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  }
  return `${km.toFixed(1)} km`
}

export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (mins === 0) {
    return `${hours}h`
  }
  
  return `${hours}h${mins.toString().padStart(2, '0')}`
}

export function calculateTotalDistance(distances) {
  return distances.reduce((total, d) => total + d.distanceKm, 0)
}

export function calculateTotalDuration(distances) {
  return distances.reduce((total, d) => total + d.durationMinutes, 0)
}

export function sortLocationsByDistance(locations, fromLocation, distanceData) {
  const fromId = fromLocation.id
  const fromType = 'place'
  
  return locations
    .map(location => {
      const distance = distanceData.find(
        d => d.fromId === fromId && d.toId === location.id
      )
      
      return {
        ...location,
        distance: distance ? distance.distanceKm : Infinity,
        duration: distance ? distance.durationMinutes : Infinity
      }
    })
    .sort((a, b) => a.distance - b.distance)
}

export function findNearestLocations(fromLocation, allLocations, distanceData, limit = 5) {
  const sorted = sortLocationsByDistance(allLocations, fromLocation, distanceData)
  return sorted.slice(0, limit)
}

export function optimizeRoute(locations, distanceMatrix) {
  if (locations.length <= 2) {
    return locations
  }
  
  const visited = new Set()
  const route = []
  
  let current = locations[0]
  route.push(current)
  visited.add(current.id)
  
  while (visited.size < locations.length) {
    let nearest = null
    let minDistance = Infinity
    
    for (const location of locations) {
      if (visited.has(location.id)) continue
      
      const distance = distanceMatrix.find(
        d => d.fromId === current.id && d.toId === location.id
      )
      
      if (distance && distance.distanceKm < minDistance) {
        minDistance = distance.distanceKm
        nearest = location
      }
    }
    
    if (nearest) {
      route.push(nearest)
      visited.add(nearest.id)
      current = nearest
    } else {
      break
    }
  }
  
  return route
}

