import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Star } from 'lucide-react'
import { useTranslation } from '../contexts/LanguageContext'

const PlaceCard = ({ place }) => {
  const { t, td, language, translateDescription, translateName } = useTranslation()
  const getImagePath = (imageName) => {
    return `${import.meta.env.BASE_URL}Photo/${imageName}`
  }

  // Get translated name and description
  const displayName = translateName(place.id, place.nom)
  const displayDescription = translateDescription(place.id, place.description)

  return (
    <Link
      to={`/lieu/${place.id}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImagePath(place.imagePrincipale)}
          alt={place.nom}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Ibaraki+Discovery'
          }}
        />
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {place.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full"
            >
              {td(tag)}
            </span>
          ))}
        </div>
        {/* Saisons */}
        {place.meilleuresSaisons && place.meilleuresSaisons.length > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full">
              {td(place.meilleuresSaisons[0])}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Titre */}
        <h3 className="font-display font-bold text-xl text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
          {displayName}
        </h3>
        {language !== 'ja' && (
          <p className="text-sm text-gray-500 mb-3">{place.nomJaponais}</p>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {displayDescription}
        </p>

        {/* Activités */}
        <div className="flex flex-wrap gap-1 mb-4">
          {place.activites?.slice(0, 3).map((activite, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {td(activite)}
            </span>
          ))}
        </div>

        {/* Infos pratiques */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="truncate">{td(place.ville)}, {td(place.region)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{td(place.dureeVisite)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="font-semibold text-gray-900">{td(place.tarif)}</span>
            </div>
          </div>
        </div>

        {/* Accessibilité */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{t('placeCard.accessibility')}</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              place.accessibilite === 'Facile' 
                ? 'bg-green-100 text-green-700'
                : place.accessibilite === 'Modéré'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {td(place.accessibilite)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PlaceCard

