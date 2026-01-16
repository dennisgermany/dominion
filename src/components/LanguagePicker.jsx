import { useLanguage } from '../contexts/LanguageContext'

function LanguagePicker() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en')
  }

  return (
    <button
      className="language-picker"
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === 'en' ? 'German' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'German' : 'English'}`}
    >
      {language === 'en' ? '🇬🇧 EN' : '🇩🇪 DE'}
    </button>
  )
}

export default LanguagePicker
