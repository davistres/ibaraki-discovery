import { useState, useEffect } from 'react'
import { MapPin, Clock, Route } from 'lucide-react'
import placesData from '../data/places.json'
import { getDistancesFrom, formatDistance, formatDuration } from '../utils/distanceUtils'

const DistanceDemo = () => {
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [distances, setDistances] = useState([])
  const [loading, setLoading] = useState(false)

  const topPlaces = placesData.slice(0, 10)

  useEffect(() => {
    if (selectedPlace) {
      loadDistances()
    }
  }, [selectedPlace])

  const loadDistances = async () => {
    setLoading(true)
    try {
      const data = await getDistancesFrom('place', selectedPlace.id)
      setDistances(data.slice(0, 10))
    } catch (error) {
      console.error('Erreur lors du chargement des distances:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPlaceName = (placeId) => {
    const place = placesData.find(p => p.id === placeId)
    return place ? place.nom : placeId
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <Route className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display font-bold text-5xl mb-4">
            Démo : Système de Distances
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Testez le calcul des distances et temps de trajet entre les lieux d'Ibaraki
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
              Sélectionnez un lieu de départ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topPlaces.map((place) => (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPlace?.id === place.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{place.nom}</h3>
                  <p className="text-sm text-gray-600">{place.ville}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedPlace && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
                Distances depuis {selectedPlace.nom}
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Calcul des distances...</p>
                </div>
              ) : distances.length > 0 ? (
                <div className="space-y-3">
                  {distances.map((distance, index) => (
                    <div
                      key={distance.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {getPlaceName(distance.toId)}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{formatDistance(distance.distanceKm)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{formatDuration(distance.durationMinutes)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">
                  Aucune distance disponible
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DistanceDemo

