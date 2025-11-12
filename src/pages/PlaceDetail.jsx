import { useParams, Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Calendar, Train, Globe, ExternalLink, ArrowLeft, Star, Share2 } from 'lucide-react'
import placesData from '../data/places.json'

const PlaceDetail = () => {
  const { id } = useParams()
  const place = placesData.find(p => p.id === id)

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lieu non trouvé</h1>
          <Link to="/decouverte" className="text-red-600 hover:text-red-700 font-semibold">
            Retour à la découverte
          </Link>
        </div>
      </div>
    )
  }

  const getImagePath = (imageName) => `/Photo/${imageName}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/decouverte"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Retour à la découverte</span>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={getImagePath(place.imagePrincipale)}
          alt={place.nom}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x600?text=Ibaraki+Discovery'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {place.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">
              {place.nom}
            </h1>
            <p className="text-xl text-gray-200">{place.nomJaponais}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                À propos
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {place.descriptionLongue}
              </p>
            </div>

            {/* Activités */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                Activités
              </h2>
              <div className="flex flex-wrap gap-3">
                {place.activites?.map((activite, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium"
                  >
                    {activite}
                  </span>
                ))}
              </div>
            </div>

            {/* Saisons */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                Meilleures saisons
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {place.saisons?.map((saison, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center font-semibold ${
                      place.meilleuresSaisons?.includes(saison)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {saison}
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {place.images && place.images.length > 1 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                  Galerie
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {place.images.map((image, index) => (
                    <img
                      key={index}
                      src={getImagePath(image)}
                      alt={`${place.nom} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Infos Pratiques */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-display font-bold text-xl text-gray-900 mb-6">
                Informations Pratiques
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Localisation</p>
                    <p className="text-gray-600 text-sm">{place.ville}, {place.region}</p>
                    <p className="text-gray-500 text-xs mt-1">{place.adresse}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Horaires</p>
                    <p className="text-gray-600 text-sm">{place.horaires}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Tarif</p>
                    <p className="text-gray-600 text-sm">{place.tarif}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Durée de visite</p>
                    <p className="text-gray-600 text-sm">{place.dureeVisite}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Train className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Accès</p>
                    <p className="text-gray-600 text-sm">{place.acces}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Accessibilité</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      place.accessibilite === 'Facile' 
                        ? 'bg-green-100 text-green-700'
                        : place.accessibilite === 'Modéré'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {place.accessibilite}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {place.googleMaps && (
                  <a
                    href={place.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Voir sur Google Maps</span>
                  </a>
                )}
                {place.siteWeb && (
                  <a
                    href={place.siteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Site officiel</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceDetail

