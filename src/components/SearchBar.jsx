import { useLanguage } from '../contexts/LanguageContext'

function SearchBar({ searchQuery, onSearchChange }) {
  const { language } = useLanguage()
  
  const label = language === 'de' ? 'Karten suchen:' : 'Search Cards:'
  const placeholder = language === 'de' 
    ? 'Nach Kartenname suchen (Englisch oder Deutsch)...'
    : 'Search by card name (English or German)...'

  return (
    <div className="filter-group">
      <label htmlFor="search-bar">{label}</label>
      <input
        id="search-bar"
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  )
}

export default SearchBar
