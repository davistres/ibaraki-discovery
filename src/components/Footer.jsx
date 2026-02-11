import { Link } from 'react-router-dom'
import { Mountain, Mail, MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react'
import { useTranslation } from '../contexts/LanguageContext'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="w-6 h-6 text-red-500" />
              <span className="font-display font-bold text-white text-lg">
                IBARAKI DISCOVERY
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-red-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors">
                  {t('header.home')}
                </Link>
              </li>
              <li>
                <Link to="/decouverte" className="hover:text-red-500 transition-colors">
                  {t('header.discovery')}
                </Link>
              </li>
              <li>
                <Link to="/festivals" className="hover:text-red-500 transition-colors">
                  {t('footer.festivalsEvents')}
                </Link>
              </li>
              <li>
                <Link to="/itineraire" className="hover:text-red-500 transition-colors">
                  {t('footer.createItinerary')}
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-red-500 transition-colors">
                  {t('header.about')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.ibarakiguide.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  {t('footer.tourismOffice')}
                </a>
              </li>
              <li>
                <a
                  href="https://www.japan.travel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  JNTO - Japan Travel
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  {t('footer.travelGuide')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-500 transition-colors">
                  {t('footer.practicalAdvice')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-red-500" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-red-500" />
                <a href="mailto:info@ibarakiguide.org" className="hover:text-red-500 transition-colors">
                  info@ibarakiguide.org
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-red-500" />
                <span>+81-29-226-3800</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
          <p>
            © {currentYear} Ibaraki Discovery. {t('footer.allRights')} |{' '}
            <a href="#" className="hover:text-red-500 transition-colors">
              {t('footer.privacy')}
            </a>{' '}
            |{' '}
            <a href="#" className="hover:text-red-500 transition-colors">
              {t('footer.terms')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

