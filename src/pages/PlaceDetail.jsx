import { useParams, Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Calendar, Train, Globe, ArrowLeft } from 'lucide-react'
import { usePlace } from '../hooks/usePlaces'
import { useTranslation } from '../contexts/LanguageContext'

const getAccessibilityBadgeClass = (values) => {
  const normalizedValues = values.map((value) => String(value).toLowerCase())

  if (normalizedValues.some((value) => value.startsWith('fac') || value === 'easy')) {
    return 'bg-green-100 text-green-700'
  }

  if (normalizedValues.some((value) => value.startsWith('mod'))) {
    return 'bg-yellow-100 text-yellow-700'
  }

  return 'bg-red-100 text-red-700'
}

const PlaceDetail = () => {
  const { t, td, language } = useTranslation()
  const { id } = useParams()
  const { place, loading } = usePlace(id)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('placeDetail.notFound')}</h1>
          <Link to="/decouverte" className="text-red-600 hover:text-red-700 font-semibold">
            {t('placeDetail.backToDiscovery')}
          </Link>
        </div>
      </div>
    )
  }

  const getImagePath = (imageName) => `${import.meta.env.BASE_URL}Photo/${imageName}`
  const displayVille = td(place.ville) || ''
  const displayRegion = td(place.region) || ''
  const displayName = place.nom || ''
  const displayDescription = place.descriptionLongue || place.description || ''
  const accessibilityLabel = td(place.accessibilite)
  const accessibilityValues = [
    place.accessibilite?.nom,
    place.accessibilite?.nom_en,
    place.accessibilite?.nom_ja,
    accessibilityLabel,
  ].filter(Boolean)
  const accessibilityBadgeClass = getAccessibilityBadgeClass(accessibilityValues)
  const activityCategories = place.categories?.filter((category) =>
    String(category.group || '').toLowerCase().startsWith('activit')
  ) || []
  const seasonCategories = place.categories?.filter((category) =>
    String(category.group || '').toLowerCase().startsWith('saison')
  ) || []
  const parseImages = (imagesData) => {
    if (!imagesData) return []
    if (Array.isArray(imagesData)) return imagesData
    if (typeof imagesData === 'string') {
      if (imagesData.startsWith('[') && imagesData.endsWith(']')) {
        try {
          return JSON.parse(imagesData)
        } catch (e) {
          console.error('Error parsing images JSON:', e)
        }
      }
      return imagesData.split(',').map((img) => img.trim()).filter(Boolean)
    }
    return []
  }

  const galleryImages = parseImages(place.images)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/decouverte"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">{t('placeDetail.backToDiscovery')}</span>
          </Link>
        </div>
      </div>

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

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {place.categories?.filter((category) => category.group === 'Tags').map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full"
                >
                  {tag.nom}
                </span>
              ))}
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">
              {displayName}
            </h1>

            {language !== 'ja' && (
              <p className="text-xl text-gray-200">{place.nomJaponais}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                {t('placeDetail.about')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {displayDescription}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                {t('placeDetail.activities')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {activityCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium"
                  >
                    {category.nom}
                  </span>
                ))}
              </div>
            </div>

            {place.meilleuresSaisons && place.meilleuresSaisons.length > 0 && seasonCategories.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                  {t('placeDetail.bestSeasons')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {seasonCategories.map((seasonCategory, index) => {
                    const isHighlighted = place.meilleuresSaisons?.some((season) => {
                      return season === seasonCategory.nom || td(season) === seasonCategory.nom
                    })

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg text-center font-semibold ${
                          isHighlighted ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {seasonCategory.nom}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {galleryImages.length > 1 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                  {t('placeDetail.gallery')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
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

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-display font-bold text-xl text-gray-900 mb-6">
                {t('placeDetail.practicalInfo')}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{t('placeDetail.location')}</p>
                    <p className="text-gray-600 text-sm">{displayVille}, {displayRegion}</p>
                    <p className="text-gray-500 text-xs mt-1">{place.adresse}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{t('placeDetail.hours')}</p>
                    <p className="text-gray-600 text-sm">{place.horaires}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{t('placeDetail.price')}</p>
                    <p className="text-gray-600 text-sm">{place.tarif}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{t('placeDetail.visitDuration')}</p>
                    <p className="text-gray-600 text-sm">{place.dureeVisite}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Train className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{t('placeDetail.access')}</p>
                    <p className="text-gray-600 text-sm">{place.acces}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{t('placeDetail.accessibility')}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${accessibilityBadgeClass}`}>
                      {accessibilityLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {place.googleMaps && (
                  <a
                    href={place.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>{t('placeDetail.viewOnMaps')}</span>
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
                    <span>{t('placeDetail.officialSite')}</span>
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
