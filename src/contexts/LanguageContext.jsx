import { createContext, useState, useContext, useCallback } from 'react'
import fr from '../locales/fr.json'
import en from '../locales/en.json'
import ja from '../locales/ja.json'
import placeDescriptions from '../locales/places-descriptions.json'
import categoriesData from '../data/categories.json'

const translations = { fr, en, ja }

const categoryLookupMap = new Map()
categoriesData.forEach((category) => {
  if (typeof category.nom === 'object' && category.nom.fr) {
    categoryLookupMap.set(category.nom.fr, category)
  } else if (typeof category.nom === 'string') {
    categoryLookupMap.set(category.nom, category)
  }
})

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

  const td = useCallback((data) => {
    if (!data) return data

    if (typeof data === 'object') {
      if (data[language]) {
        return data[language]
      }

      if (typeof data.nom === 'string' && data.nom) {
        return data.nom
      }

      if (data.nom && typeof data.nom === 'object') {
        return data.nom[language] || data.nom.fr || Object.values(data.nom).find(Boolean) || data
      }
    }

    const category = categoryLookupMap.get(data)
    if (category && typeof category.nom === 'object') {
      return category.nom[language] || category.nom.fr
    }

    const dataMap = translations[language]?.data
    if (dataMap && dataMap[data]) {
      return dataMap[data]
    }

    return data
  }, [language])

  const translateDescription = useCallback((placeId, fallbackDescription) => {
    if (!placeId) return fallbackDescription
    if (language === 'fr') return fallbackDescription

    const placeTranslation = placeDescriptions.places?.[placeId]?.[language]
    if (placeTranslation) return placeTranslation

    const festivalTranslation = placeDescriptions.festivals?.[placeId]?.[language]
    if (festivalTranslation) return festivalTranslation

    return fallbackDescription
  }, [language])

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
