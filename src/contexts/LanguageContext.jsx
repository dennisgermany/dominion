import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  // Auto-detect language from browser locale or localStorage
  const getInitialLanguage = () => {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('dominion-language')
    if (savedLanguage === 'de' || savedLanguage === 'en') {
      return savedLanguage
    }
    
    // Auto-detect from browser locale
    if (navigator.language && navigator.language.startsWith('de')) {
      return 'de'
    }
    
    // Default to English
    return 'en'
  }

  const [language, setLanguage] = useState(getInitialLanguage)

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('dominion-language', language)
  }, [language])

  const value = {
    language,
    setLanguage
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
