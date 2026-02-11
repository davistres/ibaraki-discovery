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

  const td = useCallback((frenchText) => {
    if (!frenchText) return frenchText
    const dataMap = translations[language]?.data
    if (!dataMap) return frenchText
    return dataMap[frenchText] || frenchText
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

