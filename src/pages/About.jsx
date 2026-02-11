import { Mountain, Target, Heart, Users, Mail, MapPin, Phone } from 'lucide-react'
import { useTranslation } from '../contexts/LanguageContext'

const About = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <Mountain className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display font-bold text-5xl mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            {t('about.subtitle')}
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
                {t('about.missionTitle')}
              </h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {t('about.missionP1')}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {t('about.missionP2')}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              {t('about.missionP3')}
            </p>
          </div>
        </div>

        {/* Valeurs */}
        <div className="mb-16">
          <h2 className="font-display font-bold text-4xl text-gray-900 text-center mb-12">
            {t('about.valuesTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                {t('about.authenticityTitle')}
              </h3>
              <p className="text-gray-600">
                {t('about.authenticityDesc')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                {t('about.sustainabilityTitle')}
              </h3>
              <p className="text-gray-600">
                {t('about.sustainabilityDesc')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                {t('about.personalizationTitle')}
              </h3>
              <p className="text-gray-600">
                {t('about.personalizationDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Pourquoi Ibaraki */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 md:p-12">
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-6 text-center">
              {t('about.whyTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('about.why1Title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('about.why1Desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('about.why2Title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('about.why2Desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('about.why3Title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('about.why3Desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('about.why4Title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('about.why4Desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('about.why5Title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('about.why5Desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  6
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('about.why6Title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('about.why6Desc')}
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
              {t('about.contactTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('about.addressLabel')}</h4>
                <p className="text-gray-600 text-sm">
                  Préfecture d'Ibaraki<br />
                  Japon
                </p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('about.emailLabel')}</h4>
                <a href="mailto:info@ibarakiguide.org" className="text-red-600 hover:text-red-700 text-sm">
                  info@ibarakiguide.org
                </a>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('about.phoneLabel')}</h4>
                <a href="tel:+81292263800" className="text-red-600 hover:text-red-700 text-sm">
                  +81-29-226-3800
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                {t('about.moreInfo')}
              </p>
              <a
                href="https://www.ibarakiguide.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span>{t('about.tourismOffice')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

