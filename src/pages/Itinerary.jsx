import { useState } from 'react'
import { Sparkles, Calendar, DollarSign, Users, Heart, Mountain, Flower2, UtensilsCrossed, Camera, ArrowRight, Download, Share2 } from 'lucide-react'
import placesData from '../data/places.json'
import festivalsData from '../data/festivals.json'

const Itinerary = () => {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    duree: '',
    budget: '',
    interets: [],
    saison: '',
    accessibilite: '',
    voyageurs: ''
  })
  const [generatedItinerary, setGeneratedItinerary] = useState(null)

  const interetsOptions = [
    { id: 'nature', label: 'Nature & Aventure', icon: Mountain, activites: ['Nature', 'Randonnée', 'Cyclisme'] },
    { id: 'culture', label: 'Culture & Histoire', icon: Flower2, activites: ['Culture', 'Spiritualité', 'Histoire'] },
    { id: 'gastronomie', label: 'Gastronomie', icon: UtensilsCrossed, activites: ['Gastronomie'] },
    { id: 'photo', label: 'Photographie', icon: Camera, activites: ['Photo'] },
    { id: 'famille', label: 'Famille', icon: Users, activites: ['Famille'] }
  ]

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

  const generateItinerary = () => {
    // Logique de génération d'itinéraire basée sur les préférences
    let recommendedPlaces = [...placesData]

    // Filtrer par saison
    if (preferences.saison) {
      recommendedPlaces = recommendedPlaces.filter(place =>
        place.saisons.includes(preferences.saison)
      )
    }

    // Filtrer par accessibilité
    if (preferences.accessibilite) {
      recommendedPlaces = recommendedPlaces.filter(place =>
        place.accessibilite === preferences.accessibilite
      )
    }

    // Filtrer par intérêts
    if (preferences.interets.length > 0) {
      const selectedActivites = interetsOptions
        .filter(opt => preferences.interets.includes(opt.id))
        .flatMap(opt => opt.activites)
      
      recommendedPlaces = recommendedPlaces.filter(place =>
        place.activites.some(act => selectedActivites.includes(act))
      )
    }

    // Prioriser les lieux incontournables
    recommendedPlaces.sort((a, b) => {
      const aScore = (a.tags?.includes('Incontournable') ? 10 : 0) +
                     (a.meilleuresSaisons?.includes(preferences.saison) ? 5 : 0)
      const bScore = (b.tags?.includes('Incontournable') ? 10 : 0) +
                     (b.meilleuresSaisons?.includes(preferences.saison) ? 5 : 0)
      return bScore - aScore
    })

    // Limiter selon la durée
    const maxPlaces = preferences.duree === '3' ? 5 : preferences.duree === '5' ? 8 : 12
    recommendedPlaces = recommendedPlaces.slice(0, maxPlaces)

    // Festivals de la saison
    const seasonalFestivals = festivalsData.filter(festival =>
      festival.saison === preferences.saison
    ).slice(0, 2)

    setGeneratedItinerary({
      places: recommendedPlaces,
      festivals: seasonalFestivals,
      duree: preferences.duree,
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
            Créez Votre Itinéraire Personnalisé
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Répondez à quelques questions et nous créerons un itinéraire sur mesure pour votre aventure à Ibaraki
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
              <span className="font-semibold hidden md:inline">Préférences</span>
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-semibold hidden md:inline">Détails</span>
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-red-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-semibold hidden md:inline">Itinéraire</span>
            </div>
          </div>
        </div>

        {/* Step 1: Préférences */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
              <h2 className="font-display font-bold text-3xl text-gray-900 mb-8 text-center">
                Quels sont vos centres d'intérêt ?
              </h2>
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

              <div className="text-center">
                <button
                  onClick={() => setStep(2)}
                  disabled={preferences.interets.length === 0}
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Détails */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
              <h2 className="font-display font-bold text-3xl text-gray-900 mb-8 text-center">
                Détails de votre voyage
              </h2>

              <div className="space-y-6">
                {/* Durée */}
                <div>
                  <label className="block font-semibold text-gray-900 mb-3">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Durée du séjour
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['3', '5', '7'].map((duree) => (
                      <button
                        key={duree}
                        onClick={() => setPreferences({ ...preferences, duree })}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          preferences.duree === duree
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {duree} jours
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block font-semibold text-gray-900 mb-3">
                    <DollarSign className="w-5 h-5 inline mr-2" />
                    Budget par jour
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Économique', 'Moyen', 'Confort'].map((budget) => (
                      <button
                        key={budget}
                        onClick={() => setPreferences({ ...preferences, budget })}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          preferences.budget === budget
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saison */}
                <div>
                  <label className="block font-semibold text-gray-900 mb-3">
                    <Flower2 className="w-5 h-5 inline mr-2" />
                    Saison de visite
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Printemps', 'Été', 'Automne', 'Hiver'].map((saison) => (
                      <button
                        key={saison}
                        onClick={() => setPreferences({ ...preferences, saison })}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          preferences.saison === saison
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {saison}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accessibilité */}
                <div>
                  <label className="block font-semibold text-gray-900 mb-3">
                    <Mountain className="w-5 h-5 inline mr-2" />
                    Niveau d'accessibilité souhaité
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Facile', 'Modéré', 'Difficile'].map((acc) => (
                      <button
                        key={acc}
                        onClick={() => setPreferences({ ...preferences, accessibilite: acc })}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          preferences.accessibilite === acc
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {acc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={generateItinerary}
                  disabled={!preferences.duree || !preferences.budget || !preferences.saison}
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Générer mon itinéraire</span>
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
                  Votre Itinéraire Personnalisé
                </h2>
                <p className="text-gray-600 text-lg">
                  {generatedItinerary.duree} jours à Ibaraki • Budget {generatedItinerary.budget}
                </p>
              </div>

              {/* Lieux recommandés */}
              <div className="mb-8">
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-6">
                  Lieux à visiter ({generatedItinerary.places.length})
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
                          <p className="text-sm text-gray-600 mb-2">{place.ville}</p>
                          <p className="text-xs text-gray-500">{place.dureeVisite}</p>
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
                    Festivals pendant votre séjour
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedItinerary.festivals.map((festival) => (
                      <div key={festival.id} className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-2">{festival.nom}</h4>
                        <p className="text-sm text-gray-600 mb-2">{festival.periode}</p>
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
                  <span>Télécharger PDF</span>
                </button>
                <button className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Partager</span>
                </button>
                <button
                  onClick={() => {
                    setStep(1)
                    setGeneratedItinerary(null)
                    setPreferences({
                      duree: '',
                      budget: '',
                      interets: [],
                      saison: '',
                      accessibilite: '',
                      voyageurs: ''
                    })
                  }}
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Créer un nouvel itinéraire</span>
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

