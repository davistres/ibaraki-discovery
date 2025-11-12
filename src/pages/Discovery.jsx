import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react'
import PlaceCard from '../components/PlaceCard'
import placesData from '../data/places.json'
import categoriesData from '../data/categories.json'

const Discovery = () => {
  const [searchParams] = useSearchParams()
  const [places] = useState(placesData)
  const [filteredPlaces, setFilteredPlaces] = useState(placesData)
  const [showFilters, setShowFilters] = useState(false)

  // Crée un lookup map pour les catégories pour un accès facile
  const categoryMap = useMemo(() => {
    return categoriesData.reduce((acc, category) => {
      acc[category.id] = category
      return acc
    }, {})
  }, [])

  // Options de filtres générées depuis categories.json
  const filterOptions = useMemo(() => ({
    activites: categoriesData.filter(c => c.group === 'Activités'),
    regions: categoriesData.filter(c => c.group === 'Régions'),
    villes: categoriesData.filter(c => c.group === 'Villes'),
    saisons: categoriesData.filter(c => c.group === 'Saisons'),
    accessibilites: categoriesData.filter(c => c.group === 'Accessibilité')
  }), [])

  // États des filtres (utilise les IDs)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedActivites, setSelectedActivites] = useState([])
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedVilles, setSelectedVilles] = useState([])
  const [selectedSaisons, setSelectedSaisons] = useState([])
  const [selectedAccessibilite, setSelectedAccessibilite] = useState([])

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...places]
    const lowercasedQuery = searchQuery.toLowerCase()

    // Recherche textuelle
    if (lowercasedQuery) {
      filtered = filtered.filter(place => {
        // Recherche dans le nom et la description du lieu
        if (place.nom.toLowerCase().includes(lowercasedQuery) || place.description.toLowerCase().includes(lowercasedQuery)) {
          return true
        }
        // Recherche dans le nom de la ville
        const cityName = categoryMap[place.ville_id]?.nom.toLowerCase()
        if (cityName && cityName.includes(lowercasedQuery)) {
          return true
        }
        // Recherche dans les noms des catégories associées
        return place.category_ids.some(catId =>
          categoryMap[catId]?.nom.toLowerCase().includes(lowercasedQuery)
        )
      })
    }

    // Filtres par sélection
    if (selectedActivites.length > 0) {
      filtered = filtered.filter(place =>
        place.category_ids.some(id => selectedActivites.includes(id))
      )
    }
    if (selectedRegions.length > 0) {
      filtered = filtered.filter(place => selectedRegions.includes(place.region_id))
    }
    if (selectedVilles.length > 0) {
      filtered = filtered.filter(place => selectedVilles.includes(place.ville_id))
    }
    if (selectedSaisons.length > 0) {
      filtered = filtered.filter(place =>
        place.category_ids.some(id => selectedSaisons.includes(id))
      )
    }
    if (selectedAccessibilite.length > 0) {
      filtered = filtered.filter(place => selectedAccessibilite.includes(place.accessibilite_id))
    }

    setFilteredPlaces(filtered)
  }, [searchQuery, selectedActivites, selectedRegions, selectedVilles, selectedSaisons, selectedAccessibilite, places, categoryMap])

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedActivites([])
    setSelectedRegions([])
    setSelectedVilles([])
    setSelectedSaisons([])
    setSelectedAccessibilite([])
  }

  // Toggle filter pour les IDs
  const toggleFilter = (id, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(id)) {
      setSelectedArray(selectedArray.filter(item => item !== id))
    } else {
      setSelectedArray([...selectedArray, id])
    }
  }

  const FilterSection = ({ title, options, selected, setSelected }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleFilter(option.id, selected, setSelected)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selected.includes(option.id)
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.nom}
          </button>
        ))}
      </div>
    </div>
  )

  const activeFiltersCount =
    selectedActivites.length +
    selectedRegions.length +
    selectedVilles.length +
    selectedSaisons.length +
    selectedAccessibilite.length

  const placesForDisplay = useMemo(() => {
    return filteredPlaces.map(place => {
      const allCategories = place.category_ids.map(id => categoryMap[id]).filter(Boolean)
      
      return {
        ...place,
        ville: categoryMap[place.ville_id]?.nom || '',
        region: categoryMap[place.region_id]?.nom || '',
        accessibilite: categoryMap[place.accessibilite_id]?.nom || '',
        activites: allCategories.filter(c => c.group === 'Activités').map(c => c.nom),
        tags: allCategories.filter(c => c.group === 'Tags' || c.group === 'Types de festival').map(c => c.nom),
      }
    })
  }, [filteredPlaces, categoryMap])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-display font-bold text-4xl text-gray-900 mb-4">
            Découvrez Ibaraki
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Explorez {places.length} lieux exceptionnels à travers la préfecture
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un lieu, une activité..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full mb-4 flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Filters Panel */}
            <div className={`bg-white rounded-lg shadow-md p-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filtres</span>
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Réinitialiser</span>
                  </button>
                )}
              </div>

              <FilterSection
                title="Activités"
                options={filterOptions.activites}
                selected={selectedActivites}
                setSelected={setSelectedActivites}
              />

              <FilterSection
                title="Régions"
                options={filterOptions.regions}
                selected={selectedRegions}
                setSelected={setSelectedRegions}
              />

              <FilterSection
                title="Villes"
                options={filterOptions.villes}
                selected={selectedVilles}
                setSelected={setSelectedVilles}
              />

              <FilterSection
                title="Saisons"
                options={filterOptions.saisons}
                selected={selectedSaisons}
                setSelected={setSelectedSaisons}
              />

              <FilterSection
                title="Accessibilité"
                options={filterOptions.accessibilites}
                selected={selectedAccessibilite}
                setSelected={setSelectedAccessibilite}
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{placesForDisplay.length}</span> résultat{placesForDisplay.length > 1 ? 's' : ''} trouvé{placesForDisplay.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Results Grid */}
            {placesForDisplay.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {placesForDisplay.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Discovery