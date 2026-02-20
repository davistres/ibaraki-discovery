import { createContext, useState, useContext, useCallback } from 'react'
import fr from '../locales/fr.json'
import en from '../locales/en.json'
import ja from '../locales/ja.json'
import placeDescriptions from '../locales/places-descriptions.json'
import categoriesData from '../data/categories.json'

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
    try { localStorage.setItem('ibaraki-lang', lang) } catch (e) {}
  }, [])

  const t = useCallback((key, params) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    if (value === undefined) return key
    if (params && typeof value === 'string') {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), v), value
      )
    }
    return value
  }, [language])

  // Traduit les tags/catégories/données
  const td = useCallback((data) => {
    if (!data) return data
    
    // Si c'est déjà un objet avec la langue demandée
    if (typeof data === 'object' && data[language]) {
      return data[language]
    }

    // Recherche dans categories.json (par nom français ou nom direct)
    const category = categoriesData.find(c => 
      (typeof c.nom === 'object' && c.nom.fr === data) || c.nom === data
    )
    if (category && typeof category.nom === 'object') {
      return category.nom[language] || category.nom.fr
    }

    // Fallback : recherche dans le dictionnaire 'data' des locales (pour prix, horaires, etc.)
    const dataMap = translations[language]?.data
    if (dataMap && dataMap[data]) {
      return dataMap[data]
    }

    return data
  }, [language])

  // Traduit les descriptions de lieux et festivals
  const translateDescription = useCallback((placeId, fallbackDescription) => {
    if (!placeId) return fallbackDescription
    
    // Si la langue est français, retourner la description originale
    if (language === 'fr') return fallbackDescription
    
    // Chercher dans les traductions de places
    const placeTrans = placeDescriptions.places?.[placeId]?.[language]
    if (placeTrans) return placeTrans
    
    // Chercher dans les traductions de festivals
    const festivalTrans = placeDescriptions.festivals?.[placeId]?.[language]
    if (festivalTrans) return festivalTrans
    
    // Sinon retourner la description originale (fallback)
    return fallbackDescription
  }, [language])

  // Traduit les noms de lieux et festivals
  const translateName = useCallback((id, fallbackName) => {
    if (!id || language === 'fr') return fallbackName
    
    const placeName = placeDescriptions.places?.[id]?.nom?.[language]
    if (placeName) return placeName
    
    const festivalName = placeDescriptions.festivals?.[id]?.nom?.[language]
    if (festivalName) return festivalName
    
    return fallbackName
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, td, translateDescription, translateName }}>
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
