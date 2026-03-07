import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Sparkles, ArrowRight, Mountain, Waves, Landmark, UtensilsCrossed } from 'lucide-react'
import PlaceCard from '../components/PlaceCard'
import { usePlaces } from '../hooks/usePlaces'
import { useTranslation } from '../contexts/LanguageContext'

const Home = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const { places, loading } = usePlaces()
  const [featuredPlaces, setFeaturedPlaces] = useState([])

  useEffect(() => {
    // Filtre les lieux taggés 'Incontournable' via category_ids
    // Les catégories Incontournable ont des IDs dans la plage Tags
    const featured = places
      .filter(place =>
        place.categories?.some(c => c.nom === 'Incontournable' || c.nom_en === 'Must-see')
      )
      .slice(0, 3)
    setFeaturedPlaces(featured)
  }, [places])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/decouverte?search=${encodeURIComponent(searchQuery)}`)
  }

  const categories = [
    {
      icon: Mountain,
      title: t('home.natureTitle'),
      description: t('home.natureDesc'),
      color: 'bg-green-500',
      link: '/decouverte?activite=Nature'
    },
    {
      icon: Landmark,
      title: t('home.cultureTitle'),
      description: t('home.cultureDesc'),
      color: 'bg-purple-500',
      link: '/decouverte?activite=Culture'
    },
    {
      icon: UtensilsCrossed,
      title: t('home.gastronomyTitle'),
      description: t('home.gastronomyDesc'),
      color: 'bg-orange-500',
      link: '/decouverte?activite=Gastronomie'
    },
    {
      icon: Waves,
      title: t('home.relaxTitle'),
      description: t('home.relaxDesc'),
      color: 'bg-blue-500',
      link: '/decouverte?activite=Détente'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={`${import.meta.env.BASE_URL}Photo/hitachi-seaside-park-kochia-ibaraki-1024x819.jpg`}
            alt="Ibaraki"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1920&q=80'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-6 animate-fadeIn">
            {t('home.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100 animate-fadeIn">
            {t('home.heroSubtitle')}
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-fadeIn">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="w-full px-6 py-4 pr-32 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-red-500/50 shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>{t('home.search')}</span>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4 animate-fadeIn">
            <Link
              to="/decouverte"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-all flex items-center space-x-2 border border-white/30"
            >
              <MapPin className="w-5 h-5" />
              <span>{t('home.explorePlaces')}</span>
            </Link>
            <Link
              to="/festivals"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-all flex items-center space-x-2 border border-white/30"
            >
              <Calendar className="w-5 h-5" />
              <span>{t('home.festivalsEvents')}</span>
            </Link>
            <Link
              to="/itineraire"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-all flex items-center space-x-2 shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t('home.createItinerary')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-gray-900 mb-4">
              {t('home.categoryTitle')}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('home.categorySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Link
                  key={index}
                  to={category.link}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`${category.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-red-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                    <span>{t('home.explore')}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Places Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-gray-900 mb-4">
              {t('home.featuredTitle')}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('home.featuredSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/decouverte"
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg"
            >
              <span>{t('home.viewAll')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Ibaraki Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-4xl text-gray-900 mb-6">
              {t('home.whyTitle')}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {t('home.whyText')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl font-bold text-red-600 mb-2">{t('home.fromTokyoValue')}</div>
                <p className="text-gray-600">{t('home.fromTokyo')}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl font-bold text-red-600 mb-2">{t('home.mustSeeCount')}</div>
                <p className="text-gray-600">{t('home.mustSee')}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl font-bold text-red-600 mb-2">{t('home.festivalsCount')}</div>
                <p className="text-gray-600">{t('home.annualFestivals')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

