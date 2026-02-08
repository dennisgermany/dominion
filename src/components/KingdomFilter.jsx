import { useLanguage } from '../contexts/LanguageContext'

function KingdomFilter({ showOnlyKingdomCards, onShowOnlyKingdomCardsChange }) {
  const { language } = useLanguage()

  const label =
    language === 'de'
      ? 'Nur Königreichkarten'
      : 'Show only kingdom cards'

  return (
    <div className="filter-group">
      <label className="kingdom-filter-label">
        <input
          type="checkbox"
          checked={showOnlyKingdomCards}
          onChange={(e) => onShowOnlyKingdomCardsChange(e.target.checked)}
          aria-label={label}
        />
        <span>{label}</span>
      </label>
    </div>
  )
}

export default KingdomFilter
