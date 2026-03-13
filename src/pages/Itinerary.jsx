import { useState, useCallback, useMemo } from 'react'
import { Sparkles, Calendar, DollarSign, Mountain, Flower2, Landmark, UtensilsCrossed, Camera, ArrowRight, Download, Share2, Waves, Palette, Bike, Baby } from 'lucide-react'
import placesData from '../data/places.json'
import festivalsData from '../data/festivals.json'
import { useCategories } from '../hooks/useCategories'
import categoriesData from '../data/categories.json'
import { useTranslation } from '../contexts/LanguageContext'

// Calcul du nombre d'activités selon la règle:
// - Jours complets (entre 2 nuits) = 5 activités chacun
// - Jours partiels (arrivée / départ) = 3 activités chacun
const calculateActivitiesCount = (jours, nuits) => {
  const joursNum = Number.parseInt(jours)
  const nuitsNum = Number.parseInt(nuits)
  const fullDays = Math.max(0, nuitsNum - 1)
  const partialDays = Math.min(2, Math.max(0, joursNum - fullDays))
  return fullDays * 5 + partialDays * 3
}

const Itinerary = () => {
  const { t, td, language } = useTranslation()
  const { categories: categoriesDB } = useCategories()
  const [step, setStep] = useState(1)

  // getCategoryId cherche par nom FR dans categories.json (toujours stable)
  const getCategoryId = useCallback((name, group) => {
    const category = categoriesData.find(cat => cat.nom === name && cat.group === group)
    return category ? category.id : null
  }, [])

  const getActivityCategoryIds = useCallback((activityNames) => {
    return activityNames.map(name => getCategoryId(name, 'Activités')).filter(id => id !== null)
  }, [getCategoryId])

  const [preferences, setPreferences] = useState({
    jours: '',
    nuits: '',
    budget: '',
    interets: [],
    saison: '',
    accessibilite: []
  })
  const [generatedItinerary, setGeneratedItinerary] = useState(null)

  const interetsOptions = useMemo(() => [
    { id: 'nature',      label: t('itinerary.nature'),      icon: Mountain,        activites: ['Randonnée', 'Cyclisme / Vélo', 'Photo'] },
    { id: 'culture',     label: t('itinerary.culture'),     icon: Landmark,        activites: ['Culture', 'Spiritualité', 'Histoire'] },
    { id: 'gastronomie', label: t('itinerary.gastronomy'),  icon: UtensilsCrossed, activites: ['Ateliers culinaires', 'Dégustation'] },
    { id: 'photo',       label: t('itinerary.photography'), icon: Camera,          activites: ['Photo', 'Randonnée'] },
    { id: 'famille',     label: t('itinerary.family'),      icon: Baby,            activites: ['Balade', 'Aquarium', 'Cyclisme / Vélo'] },
    { id: 'detente',     label: t('itinerary.wellness'),    icon: Waves,           activites: ['Détente', 'Balade', 'Jogging'] },
    { id: 'art',         label: t('itinerary.art'),         icon: Palette,         activites: ['Cours', 'Ateliers culinaires', 'Dégustation'] },
    { id: 'sport',       label: t('itinerary.sports'),      icon: Bike,            activites: ['Sport', 'Sports nautiques', 'Cyclisme / Vélo', 'Randonnée'] },
    { id: 'jardins',     label: t('itinerary.gardens'),     icon: Flower2,         activites: ['Randonnée', 'Balade', 'Détente'] }
  ], [t])


  const toggleInteret = (interet) => {
    if (preferences.interets.includes(interet)) {
      setPreferences({
        ...preferences,
        interets: preferences.interets.filter(i => i !== interet)
      })
    } else {
      setPreferences({
        ...preferences,
        interets: [...preferences.interets, interet]
      })
    }
  }

  const handleAccessibiliteClick = (niveau) => {
    const niveaux = ['Facile', 'Modéré', 'Difficile']
    const currentSelection = preferences.accessibilite

    if (currentSelection.includes(niveau)) {
      setPreferences({
        ...preferences,
        accessibilite: currentSelection.filter(n => n !== niveau)
      })
    } else {
      const niveauIndex = niveaux.indexOf(niveau)
      const newSelection = [...currentSelection]

      for (let i = 0; i <= niveauIndex; i++) {
        if (!newSelection.includes(niveaux[i])) {
          newSelection.push(niveaux[i])
        }
      }

      setPreferences({
        ...preferences,
        accessibilite: newSelection
      })
    }
  }

  const calculateActivitiesCount = (jours, nuits) => {
    const joursNum = Number.parseInt(jours)
    const nuitsNum = Number.parseInt(nuits)

    if (joursNum === 1 && nuitsNum === 2) {
      return 5
    }

    if (joursNum === 1 && (nuitsNum === 0 || nuitsNum === 1)) {
      return 3
    }

    if (joursNum === 2 && nuitsNum === 2) {
      return 8
    }

    return joursNum * 5
  }

  const getMinimumInterets = (jours) => {
    const joursNum = Number.parseInt(jours)
    if (joursNum === 1) return 0
    if (joursNum >= 2 && joursNum <= 3) return 2
    if (joursNum >= 4 && joursNum <= 5) return 3
    if (joursNum >= 6 && joursNum <= 7) return 4
    return 0
  }

  const generateItinerary = () => {
    let recommendedPlaces = [...placesData]

    // --- Filtre SAISON ---
    // Utilise meilleuresSaisons (tableau de strings FR), plus fiable que category_ids
    if (preferences.saison) {
      const saisonFilter = recommendedPlaces.filter(place =>
        place.meilleuresSaisons && place.meilleuresSaisons.includes(preferences.saison)
      )
      // On applique le filtre seulement s'il y a des résultats
      if (saisonFilter.length > 0) {
        recommendedPlaces = saisonFilter
      }
    }

    // --- Filtre ACCESSIBILITÉ ---
    // Mapping direct des noms FR vers les noms de la DB
    if (preferences.accessibilite.length > 0) {
      const accessNomsFr = preferences.accessibilite // ['Facile', 'Modéré', 'Difficile']
      const accessIds = accessNomsFr
        .map(nom => getCategoryId(nom, 'Accessibilité'))
        .filter(Boolean)

      if (accessIds.length > 0) {
        const accessFilter = recommendedPlaces.filter(place =>
          accessIds.includes(place.accessibilite_id)
        )
        // Applique le filtre seulement s'il y a des résultats 
        if (accessFilter.length > 0) {
          recommendedPlaces = accessFilter
        }
      }
    }

    // --- Filtre INTÉRÊTS ---
    // Filtre par noms d'activités FR dans categories.json
    if (preferences.interets.length > 0) {
      const selectedActiviteNames = interetsOptions
        .filter(opt => preferences.interets.includes(opt.id))
        .flatMap(opt => opt.activites)

      const selectedActiviteIds = getActivityCategoryIds(selectedActiviteNames)

      if (selectedActiviteIds.length > 0) {
        const interetsFilter = recommendedPlaces.filter(place =>
          place.category_ids && selectedActiviteIds.some(id => place.category_ids.includes(id))
        )
        // Si le filtre donne des résultats, l'applique - sinon on garde tout
        if (interetsFilter.length > 0) {
          recommendedPlaces = interetsFilter
        }
      }
    }

    // Score par "Incontournable" (id 1970) et saison
    const incontournableId = getCategoryId('Incontournable', 'Tags')
    recommendedPlaces.sort((a, b) => {
      const saisonA = preferences.saison && a.meilleuresSaisons?.includes(preferences.saison) ? 5 : 0
      const saisonB = preferences.saison && b.meilleuresSaisons?.includes(preferences.saison) ? 5 : 0
      const aScore = (incontournableId && a.category_ids?.includes(incontournableId) ? 10 : 0) + saisonA
      const bScore = (incontournableId && b.category_ids?.includes(incontournableId) ? 10 : 0) + saisonB
      return bScore - aScore
    })

    const maxPlaces = calculateActivitiesCount(preferences.jours, preferences.nuits)

    // Si on n'a pas assez de lieux, on complète avec des lieux de la saison non encore inclus
    if (recommendedPlaces.length < maxPlaces) {
      const currentIds = new Set(recommendedPlaces.map(p => p.id))
      const saisonPool = preferences.saison
        ? placesData.filter(p => p.meilleuresSaisons?.includes(preferences.saison) && !currentIds.has(p.id))
        : placesData.filter(p => !currentIds.has(p.id))

      const needed = maxPlaces - recommendedPlaces.length
      recommendedPlaces = [...recommendedPlaces, ...saisonPool.slice(0, needed)]
    }

    recommendedPlaces = recommendedPlaces.slice(0, maxPlaces)

    // Festivals de la saison — filtre par catégorie de festival dans festivals.json
    const saisonIdForFestivals = getCategoryId(preferences.saison, 'Saisons')
    const seasonalFestivals = saisonIdForFestivals
      ? festivalsData.filter(f => f.category_ids && f.category_ids.includes(saisonIdForFestivals)).slice(0, 2)
      : festivalsData.slice(0, 2) // fallback : premiers festivals

    setGeneratedItinerary({
      places: recommendedPlaces,
      festivals: seasonalFestivals,
      jours: preferences.jours,
      nuits: preferences.nuits,
      budget: preferences.budget
    })
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display font-bold text-5xl mb-4">
            {t('itinerary.title')}
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            {t('itinerary.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-semibold hidden md:inline">{t('itinerary.stepDetails')}</span>
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-semibold hidden md:inline">{t('itinerary.stepInterests')}</span>
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-red-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-semibold hidden md:inline">{t('itinerary.stepItinerary')}</span>
            </div>
          </div>
        </div>

        {/* Step 1: Détails du voyage */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
              <h2 className="font-display font-bold text-3xl text-gray-900 mb-8 text-center">
                {t('itinerary.tripDetails')}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block font-semibold text-gray-900 mb-3">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    {t('itinerary.numberOfDays')}
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {['1', '2', '3', '4', '5', '6', '7'].map((jour) => (
                      <button
                        key={jour}
                        onClick={() => setPreferences({ ...preferences, jours: jour, nuits: '' })}
                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                          preferences.jours === jour
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {jour}
                      </button>
                    ))}
                  </div>
                </div>

                {preferences.jours && (
                  <div>
                    <div className="block font-semibold text-gray-900 mb-3">
                      {t('itinerary.numberOfNights')}
                    </div>
                    <div className="grid grid-cols-auto gap-2">
                      {(() => {
                        const joursNum = Number.parseInt(preferences.jours)
                        const minNuits = joursNum === 1 ? 0 : joursNum - 1
                        const maxNuits = joursNum + 1
                        const nuitsOptions = []
                        for (let i = minNuits; i <= maxNuits; i++) {
                          nuitsOptions.push(i.toString())
                        }
                        return nuitsOptions.map((nuit) => (
                          <button
                            key={nuit}
                            onClick={() => setPreferences({ ...preferences, nuits: nuit })}
                            className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                              preferences.nuits === nuit
                                ? 'border-red-600 bg-red-50 text-red-600'
                                : 'border-gray-200 hover:border-red-300'
                            }`}
                          >
                            {nuit}
                          </button>
                        ))
                      })()}
                    </div>
                    {preferences.nuits && (
                      <p className="text-sm text-gray-600 mt-2">
                        📍 {t('itinerary.suggestedActivities')} {calculateActivitiesCount(preferences.jours, preferences.nuits)}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-gray-900 mb-3">
                    <DollarSign className="w-5 h-5 inline mr-2" />
                    {t('itinerary.dailyBudget')}
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'Économique', label: t('itinerary.economic') },
                      { value: 'Moyen', label: t('itinerary.medium') },
                      { value: 'Confort', label: t('itinerary.comfort') }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setPreferences({ ...preferences, budget: value })}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          preferences.budget === value
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-900 mb-3">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    {t('itinerary.visitSeason')}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: 'Printemps', label: t('itinerary.spring') },
                      { value: 'Été', label: t('itinerary.summer') },
                      { value: 'Automne', label: t('itinerary.autumn') },
                      { value: 'Hiver', label: t('itinerary.winter') }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setPreferences({ ...preferences, saison: value })}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          preferences.saison === value
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-900 mb-3">
                    <Mountain className="w-5 h-5 inline mr-2" />
                    {t('itinerary.accessibilityLevel')}
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'Facile', label: t('itinerary.easy') },
                      { value: 'Modéré', label: t('itinerary.moderate') },
                      { value: 'Difficile', label: t('itinerary.difficult') }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => handleAccessibiliteClick(value)}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          preferences.accessibilite.includes(value)
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!preferences.jours || !preferences.nuits || !preferences.budget || !preferences.saison}
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
                >
                  <span>{t('itinerary.continue')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Centres d'intérêt */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
              <h2 className="font-display font-bold text-3xl text-gray-900 mb-4 text-center">
                {t('itinerary.interestsTitle')}
              </h2>
              {(() => {
                const minInterets = getMinimumInterets(preferences.jours)
                return minInterets > 0 ? (
                  <p className="text-center text-gray-600 mb-8">
                    {t('itinerary.interestsMinimum', { count: minInterets, days: preferences.jours, plural: preferences.jours > 1 ? 's' : '' })}
                  </p>
                ) : (
                  <p className="text-center text-gray-600 mb-8">
                    {t('itinerary.interestsSelect')}
                  </p>
                )
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {interetsOptions.map((interet) => {
                  const Icon = interet.icon
                  const isSelected = preferences.interets.includes(interet.id)
                  return (
                    <button
                      key={interet.id}
                      onClick={() => toggleInteret(interet.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <Icon className={`w-10 h-10 mx-auto mb-3 ${isSelected ? 'text-red-600' : 'text-gray-400'}`} />
                      <p className={`font-semibold ${isSelected ? 'text-red-600' : 'text-gray-700'}`}>
                        {interet.label}
                      </p>
                    </button>
                  )
                })}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  {t('itinerary.back')}
                </button>
                <button
                  onClick={generateItinerary}
                  disabled={preferences.interets.length < getMinimumInterets(preferences.jours)}
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t('itinerary.generate')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Itinéraire généré */}
        {step === 3 && generatedItinerary && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 mb-8">
              <div className="text-center mb-8">
                <h2 className="font-display font-bold text-4xl text-gray-900 mb-4">
                  {t('itinerary.resultTitle')}
                </h2>
                <p className="text-gray-600 text-lg">
                  {generatedItinerary.jours} {generatedItinerary.jours > 1 ? t('itinerary.days') : t('itinerary.day')} • {generatedItinerary.nuits} {generatedItinerary.nuits > 1 ? t('itinerary.nights') : t('itinerary.night')} • {t('itinerary.budget')} {({ 'Économique': t('itinerary.economic'), 'Moyen': t('itinerary.medium'), 'Confort': t('itinerary.comfort') })[generatedItinerary.budget]}
                </p>
              </div>

              {/* Lieux recommandés */}
              <div className="mb-8">
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-6">
                  {t('itinerary.placesToVisit', { count: generatedItinerary.places.length })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedItinerary.places.map((place, index) => (
                    <div key={place.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-red-300 transition-all">
                      <div className="flex items-start space-x-3">
                        <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{place.nom}</h4>
                          <p className="text-sm text-gray-600 mb-2">{td(place.ville)}</p>
                          <p className="text-xs text-gray-500">{td(place.dureeVisite)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Festivals */}
              {generatedItinerary.festivals.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-6">
                    {t('itinerary.festivalsTitle')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedItinerary.festivals.map((festival) => (
                      <div key={festival.id} className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">{festival.nom}</h4>
                        <p className="text-sm text-gray-600 mb-2">{td(festival.periode)}</p>
                        <p className="text-sm text-gray-700">{festival.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-4 pt-8 border-t border-gray-200">
                <button className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                  <Download className="w-5 h-5" />
                  <span>{t('itinerary.downloadPDF')}</span>
                </button>
                <button className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>{t('itinerary.share')}</span>
                </button>
                <button
                  onClick={() => {
                    setStep(1)
                    setGeneratedItinerary(null)
                    setPreferences({
                      jours: '',
                      nuits: '',
                      budget: '',
                      interets: [],
                      saison: '',
                      accessibilite: []
                    })
                  }}
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t('itinerary.newItinerary')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Itinerary

