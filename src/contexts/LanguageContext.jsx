import { createContext, useState, useContext, useCallback } from 'react'
import fr from '../locales/fr.json'
import en from '../locales/en.json'
import ja from '../locales/ja.json'

const translations = { fr, en, ja }

const detectLanguage = () => {
  try {
    const saved = localStorage.getItem('ibaraki-lang')
    if (saved && translations[saved]) return saved
  } catch (e) {}

  const browserLang = navigator.language || navigator.languages?.[0] || 'en'
  if (browserLang.startsWith('fr')) return 'fr'
  if (browserLang.startsWith('ja')) return 'ja'
  return 'en'
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(detectLanguage)

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('ibaraki-lang', lang)
    } catch (e) {}
  }, [])

  // Traduit les clés de l'interface utilisateur (menus, boutons, labels...)
  const t = useCallback((key, params) => {
    const keys = key.split('.')
    let value = translations[language]

    for (const currentKey of keys) {
      value = value?.[currentKey]
    }

    if (value === undefined) return key

    if (params && typeof value === 'string') {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) => str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue),
        value
      )
    }

    return value
  }, [language])

  // Traduit une valeur de donnée dynamique (ex: nom d'une catégorie)
  // Les données viennent de l'API déjà traduites, donc cette fonction
  // est utilisée comme fallback pour les cas où la donnée est un objet ou une chaîne brute.
  const td = useCallback((data) => {
    if (!data) return data

    // Si c'est un objet avec la langue courante directement (ex: { fr: '...', en: '...' })
    if (typeof data === 'object') {
      if (data[language]) return data[language]
      if (typeof data.nom === 'string' && data.nom) return data.nom
      if (data.nom && typeof data.nom === 'object') {
        return data.nom[language] || data.nom.fr || Object.values(data.nom).find(Boolean) || data
      }
    }

    // Fallback : cherche dans la section "data" des fichiers de traduction UI
    const dataMap = translations[language]?.data
    if (dataMap && dataMap[data]) {
      return dataMap[data]
    }

    // Retourne la chaîne telle quelle (déjà traduite par l'API normalement)
    return data
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, td }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useTranslation must be used within LanguageProvider')
  return context
}

export default LanguageContext
