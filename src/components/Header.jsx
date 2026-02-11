import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Mountain, Globe } from 'lucide-react'
import { useTranslation } from '../contexts/LanguageContext'

const langLabels = { fr: 'FR', en: 'EN', ja: 'JA' }
const langFlags = { fr: '🇫🇷', en: '🇬🇧', ja: '🇯🇵' }

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const location = useLocation()
  const { t, language, setLanguage } = useTranslation()

  const navLinks = [
    { path: '/', label: t('header.home') },
    { path: '/decouverte', label: t('header.discovery') },
    { path: '/festivals', label: t('header.festivals') },
    { path: '/itineraire', label: t('header.itinerary') },
    { path: '/a-propos', label: t('header.about') },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Mountain className="w-8 h-8 text-red-600 group-hover:text-red-700 transition-colors" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-gray-900">
                IBARAKI DISCOVERY
              </span>
              <span className="text-xs text-gray-500">{t('header.tagline')}</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors relative group ${
                  isActive(link.path)
                    ? 'text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-red-600 transform origin-left transition-transform ${
                    isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-gray-200 hover:border-red-300 text-sm font-medium text-gray-600 hover:text-red-600 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>{langFlags[language]} {langLabels[language]}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-50">
                  {Object.keys(langLabels).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setIsLangOpen(false) }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors flex items-center space-x-2 ${language === lang ? 'text-red-600 font-semibold bg-red-50' : 'text-gray-700'}`}
                    >
                      <span>{langFlags[lang]}</span>
                      <span>{langLabels[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:hidden">
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600"
              >
                {langFlags[language]}
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-50">
                  {Object.keys(langLabels).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setIsLangOpen(false) }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors flex items-center space-x-2 ${language === lang ? 'text-red-600 font-semibold bg-red-50' : 'text-gray-700'}`}
                    >
                      <span>{langFlags[lang]}</span>
                      <span>{langLabels[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header

