import { useState, useMemo } from 'react'
import { Calendar, MapPin, Sparkles, Music, Flower2, UtensilsCrossed, Flame } from 'lucide-react'
import festivalsData from '../data/festivals.json'
import categoriesData from '../data/categories.json'

const Festivals = () => {
  const [selectedSaison, setSelectedSaison] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  // Data processing using useMemo for performance
  const { categoryMap, filterOptions, festivalsForDisplay } = useMemo(() => {
    const catMap = categoriesData.reduce((acc, category) => {
      acc[category.id] = category
      return acc
    }, {})

    const fOptions = {
      saisons: [{ id: 'all', nom: 'Toutes' }, ...categoriesData.filter(c => c.group === 'Saisons')],
      types: [{ id: 'all', nom: 'Tous' }, ...categoriesData.filter(c => c.group === 'Types de festival' || c.nom === 'Culture')] // Inclure Culture
    }

    const filtered = festivalsData.filter(festival => {
      const saisonMatch = selectedSaison === 'all' || festival.category_ids.includes(selectedSaison)
      const typeMatch = selectedType === 'all' || festival.category_ids.includes(selectedType)
      return saisonMatch && typeMatch
    })

    const displayFestivals = filtered.map(festival => {
      const allCategories = festival.category_ids.map(id => catMap[id]).filter(Boolean)
      const typeCat = allCategories.find(c => c.group === 'Types de festival' || c.nom === 'Culture')
      const saisonCat = allCategories.find(c => c.group === 'Saisons')

      return {
        ...festival,
        ville: catMap[festival.ville_id]?.nom || '',
        type: typeCat?.nom || 'Culture',
        saison: saisonCat?.nom || '',
        tags: allCategories.filter(c => c.group === 'Tags').map(c => c.nom)
      }
    })

    return { categoryMap: catMap, filterOptions: fOptions, festivalsForDisplay: displayFestivals }
  }, [selectedSaison, selectedType])


  const getTypeIcon = (type) => {
    switch (type) {
      case 'Floraison': return Flower2
      case 'Musique': return Music
      case 'Gastronomie': return UtensilsCrossed
      case 'Spectacle': return Flame
      case 'Culture': return Sparkles
      default: return Sparkles
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Floraison': return 'bg-pink-500'
      case 'Musique': return 'bg-purple-500'
      case 'Gastronomie': return 'bg-orange-500'
      case 'Spectacle': return 'bg-red-500'
      case 'Culture': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getSaisonColor = (saison) => {
    switch (saison) {
      case 'Printemps': return 'bg-pink-100 text-pink-700'
      case 'Été': return 'bg-yellow-100 text-yellow-700'
      case 'Automne': return 'bg-orange-100 text-orange-700'
      case 'Hiver': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getImagePath = (imageName) => `${import.meta.env.BASE_URL}Photo/${imageName}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-4">
            <Calendar className="w-16 h-16" />
          </div>
          <h1 className="font-display font-bold text-5xl mb-4">
            Festivals & Événements
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Découvrez les célébrations saisonnières et événements culturels d'Ibaraki tout au long de l'année
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saison Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Filtrer par saison</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.saisons.map((saison) => (
                  <button
                    key={saison.id}
                    onClick={() => setSelectedSaison(saison.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedSaison === saison.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {saison.nom}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Filtrer par type</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedType === type.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.nom}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{festivalsForDisplay.length}</span> festival{festivalsForDisplay.length > 1 ? 's' : ''} trouvé{festivalsForDisplay.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Festivals Grid */}
        {festivalsForDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {festivalsForDisplay.map((festival) => {
              const TypeIcon = getTypeIcon(festival.type)
              return (
                <div
                  key={festival.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImagePath(festival.image)}
                      alt={festival.nom}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Festival'
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`${getTypeColor(festival.type)} w-12 h-12 rounded-full flex items-center justify-center`}>
                        <TypeIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSaisonColor(festival.saison)}`}>
                        {festival.saison}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-1">
                      {festival.nom}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{festival.nomJaponais}</p>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {festival.description}
                    </p>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="font-semibold">{festival.periode}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="truncate">{festival.ville}</span>
                      </div>
                    </div>

                    {/* Activités */}
                    {festival.activites && festival.activites.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 mb-2">ACTIVITÉS</p>
                        <ul className="space-y-1">
                          {festival.activites.slice(0, 3).map((activite, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              <span className="line-clamp-1">{activite}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {festival.tags && festival.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {festival.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
              Aucun festival trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos filtres
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-4 text-center">
            Planifiez votre visite
          </h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto mb-6">
            Les festivals d'Ibaraki offrent une occasion unique de découvrir la culture locale, 
            les traditions ancestrales et la beauté naturelle de la région. Chaque saison apporte 
            son lot de célébrations colorées et d'expériences inoubliables.
          </p>
          <div className="text-center">
            <a
              href="/itineraire"
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span>Créer mon itinéraire personnalisé</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Festivals