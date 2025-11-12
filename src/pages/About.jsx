import { Mountain, Target, Heart, Users, Mail, MapPin, Phone } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <Mountain className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display font-bold text-5xl mb-4">
            À Propos d'Ibaraki Discovery
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Votre portail vers une expérience japonaise authentique
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mission */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-8 h-8 text-red-600" />
              <h2 className="font-display font-bold text-3xl text-gray-900">
                Notre Mission
              </h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Ibaraki Discovery est né d'une vision : <strong>promouvoir un tourisme durable et authentique</strong> en redirigeant les visiteurs des destinations surpeuplées comme Tokyo et Kyoto vers les trésors 
              cachés de la préfecture d'Ibaraki.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Située à seulement 1h-1h30 de Tokyo, Ibaraki offre une alternative paisible et culturellement 
              riche, avec des paysages naturels spectaculaires, un patrimoine historique profond, et une 
              gastronomie unique.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Notre plateforme vous permet de <strong>créer des itinéraires personnalisés</strong> basés sur 
              vos préférences, votre budget, la durée de votre séjour et la saison de votre visite.
            </p>
          </div>
        </div>

        {/* Valeurs */}
        <div className="mb-16">
          <h2 className="font-display font-bold text-4xl text-gray-900 text-center mb-12">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                Authenticité
              </h3>
              <p className="text-gray-600">
                Nous mettons en avant les expériences locales authentiques et les traditions 
                préservées d'Ibaraki.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                Durabilité
              </h3>
              <p className="text-gray-600">
                Nous promouvons un tourisme responsable qui respecte l'environnement et 
                les communautés locales.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                Personnalisation
              </h3>
              <p className="text-gray-600">
                Chaque voyageur est unique. Nous créons des expériences sur mesure adaptées 
                à vos envies.
              </p>
            </div>
          </div>
        </div>

        {/* Pourquoi Ibaraki */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 md:p-12">
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-6 text-center">
              Pourquoi Choisir Ibaraki ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Proximité de Tokyo</h4>
                  <p className="text-gray-700 text-sm">
                    Accessible en 1h-1h30 depuis Tokyo, parfait pour une escapade
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Nature Spectaculaire</h4>
                  <p className="text-gray-700 text-sm">
                    Parcs floraux, montagnes sacrées, chutes d'eau et plages
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Patrimoine Culturel</h4>
                  <p className="text-gray-700 text-sm">
                    Sanctuaires anciens, temples, musées et traditions vivantes
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Gastronomie Unique</h4>
                  <p className="text-gray-700 text-sm">
                    Spécialités locales comme la baudroie (anko) et produits frais
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Moins de Touristes</h4>
                  <p className="text-gray-700 text-sm">
                    Profitez d'une expérience paisible loin des foules
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  6
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Festivals Toute l'Année</h4>
                  <p className="text-gray-700 text-sm">
                    Événements saisonniers et célébrations traditionnelles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-8 text-center">
              Contactez-Nous
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Adresse</h4>
                <p className="text-gray-600 text-sm">
                  Préfecture d'Ibaraki<br />
                  Japon
                </p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                <a href="mailto:info@ibarakiguide.org" className="text-red-600 hover:text-red-700 text-sm">
                  info@ibarakiguide.org
                </a>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Téléphone</h4>
                <a href="tel:+81292263800" className="text-red-600 hover:text-red-700 text-sm">
                  +81-29-226-3800
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                Pour plus d'informations sur le tourisme à Ibaraki, visitez :
              </p>
              <a
                href="https://www.ibarakiguide.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span>Office de Tourisme d'Ibaraki</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

