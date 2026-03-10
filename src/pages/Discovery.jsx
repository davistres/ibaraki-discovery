import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react'
import PlaceCard from '../components/PlaceCard'
import categoriesData from '../data/categories.json'
import { usePlaces } from '../hooks/usePlaces'
import { useTranslation } from '../contexts/LanguageContext'

const Discovery = () => {
  const { t, td } = useTranslation()
  const [searchParams] = useSearchParams()
  const { places, loading } = usePlaces()
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Crée un lookup map pour les catégories pour un accès facile
  const categoryMap = useMemo(() => {
    return categoriesData.reduce((acc, category) => {
      acc[category.id] = category
      return acc
    }, {})
  }, [])

  // Options de filtres générées depuis categories.json
  const filterOptions = useMemo(() => {
    // Liste des IDs à masquer dans les filtres (Bus, Voiture, Aéroport, Office de tourisme)
    const hiddenTagIds = [2032, 2033, 2035, 2039];
    
    return {
      activites: categoriesData.filter(c => c.group === 'Activités'),
      tags: categoriesData.filter(c => c.group === 'Tags' && !hiddenTagIds.includes(c.id)),
      regions: categoriesData.filter(c => c.group === 'Régions'),
      villes: categoriesData.filter(c => c.group === 'Villes'),
      saisons: categoriesData.filter(c => c.group === 'Saisons'),
      accessibilites: categoriesData.filter(c => c.group === 'Accessibilité')
    };
  }, [])

  // États des filtres (utilise les IDs)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedActivites, setSelectedActivites] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedVilles, setSelectedVilles] = useState([])
  const [selectedSaisons, setSelectedSaisons] = useState([])
  const [selectedAccessibilite, setSelectedAccessibilite] = useState([])

  // Appliquer les filtres (les données API ont déjà les champs traduits)
  useEffect(() => {
    let filtered = [...places]
    const lowercasedQuery = searchQuery.toLowerCase()

    if (lowercasedQuery) {
      filtered = filtered.filter(place => {
        if (place.nom.toLowerCase().includes(lowercasedQuery) || place.description.toLowerCase().includes(lowercasedQuery)) {
          return true
        }
        const cityName = (place.ville?.nom || '').toLowerCase()
        if (cityName && cityName.includes(lowercasedQuery)) return true
        return place.categories?.some(c => c.nom.toLowerCase().includes(lowercasedQuery))
      })
    }

    if (selectedActivites.length > 0) {
      filtered = filtered.filter(place =>
        place.categories?.some(c => selectedActivites.includes(c.id))
      )
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(place =>
        place.categories?.some(c => selectedTags.includes(c.id))
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
        place.categories?.some(c => selectedSaisons.includes(c.id))
      )
    }
    if (selectedAccessibilite.length > 0) {
      filtered = filtered.filter(place => selectedAccessibilite.includes(place.accessibilite_id))
    }

    setFilteredPlaces(filtered)
  }, [searchQuery, selectedActivites, selectedTags, selectedRegions, selectedVilles, selectedSaisons, selectedAccessibilite, places])

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedActivites([])
    setSelectedTags([])
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
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selected.includes(option.id)
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {td(option.nom)}
          </button>
        ))}
      </div>
    </div>
  )

  const activeFiltersCount =
    selectedActivites.length +
    selectedTags.length +
    selectedRegions.length +
    selectedVilles.length +
    selectedSaisons.length +
    selectedAccessibilite.length

  // Les données viennent déjà traduits depuis l'API
  const placesForDisplay = useMemo(() => {
    return filteredPlaces.map(place => ({
      ...place,
      // Champs déjà traduits par l'API selon la langue
      accessibiliteTranslated: place.accessibilite?.nom || '',
      activites: place.categories?.filter(c => c.group === 'Activités').map(c => c.nom) || [],
      activitesTranslated: place.categories?.filter(c => c.group === 'Activités').map(c => c.nom) || [],
      tags: place.categories?.filter(c => c.group === 'Tags' || c.group === 'Types de festival').map(c => c.nom) || [],
      tagsTranslated: place.categories?.filter(c => c.group === 'Tags' || c.group === 'Types de festival').map(c => c.nom) || [],
      regionTranslated: place.region?.nom || '',
      meilleuresSaisonsTranslated: place.meilleuresSaisons || [],
    }))
  }, [filteredPlaces])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-display font-bold text-4xl text-gray-900 mb-4">
            {t('discovery.title')}
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            {t('discovery.subtitle', { count: places.length })}
          </p>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('discovery.searchPlaceholder')}
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
              <span>{t('discovery.filters')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Filters Panel */}
            <div className={`bg-white rounded-lg shadow-md p-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>{t('discovery.filters')}</span>
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>{t('discovery.reset')}</span>
                  </button>
                )}
              </div>

              <FilterSection
                title={t('discovery.activities')}
                options={filterOptions.activites}
                selected={selectedActivites}
                setSelected={setSelectedActivites}
              />

              <FilterSection
                title={t('discovery.tags')}
                options={filterOptions.tags}
                selected={selectedTags}
                setSelected={setSelectedTags}
              />

              <FilterSection
                title={t('discovery.regions')}
                options={filterOptions.regions}
                selected={selectedRegions}
                setSelected={setSelectedRegions}
              />

              <FilterSection
                title={t('discovery.cities')}
                options={filterOptions.villes}
                selected={selectedVilles}
                setSelected={setSelectedVilles}
              />

              <FilterSection
                title={t('discovery.seasons')}
                options={filterOptions.saisons}
                selected={selectedSaisons}
                setSelected={setSelectedSaisons}
              />

              <FilterSection
                title={t('discovery.accessibility')}
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
                <span className="font-semibold text-gray-900">{placesForDisplay.length}</span> {t('discovery.results', { plural: placesForDisplay.length > 1 ? 's' : '' })}
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
                  {t('discovery.noResults')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('discovery.noResultsHint')}
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t('discovery.resetFilters')}
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