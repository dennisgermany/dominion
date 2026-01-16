import { useLanguage } from '../contexts/LanguageContext'

function FilterStats({ selectedEditionsCount, filteredCardsCount, totalEditionsCount, totalCardsCount }) {
  const { language } = useLanguage()

  const editionsLabel = language === 'de' ? 'Editionen' : 'Editions'
  const cardsLabel = language === 'de' ? 'Karten' : 'Cards'

  // If no editions are selected, show total editions (all editions)
  const displayEditionsCount = selectedEditionsCount === 0 ? totalEditionsCount : selectedEditionsCount

  // Calculate percentages for progress rings
  // When no editions are selected, show 100% (all editions are available)
  const editionsPercentage = selectedEditionsCount === 0 
    ? 1.0 
    : (totalEditionsCount > 0 ? selectedEditionsCount / totalEditionsCount : 0)
  const cardsPercentage = totalCardsCount > 0 ? filteredCardsCount / totalCardsCount : 0

  // SVG circle parameters
  const circleRadius = 30
  const ringRadius = 34 // Larger than circle to wrap around it
  const centerX = 35
  const centerY = 35
  const editionsCircumference = 2 * Math.PI * ringRadius
  const cardsCircumference = 2 * Math.PI * ringRadius
  const editionsDashOffset = editionsCircumference * (1 - editionsPercentage)
  const cardsDashOffset = cardsCircumference * (1 - cardsPercentage)

  return (
    <div className="filter-stats">
      <div className="filter-stat-item">
        <div className="filter-stat-circle-wrapper">
          <div className="filter-stat-circle">
            {displayEditionsCount}
          </div>
          <svg className="filter-stat-ring" viewBox="0 0 70 70">
            <circle
              className="filter-stat-ring-bg"
              cx={centerX}
              cy={centerY}
              r={ringRadius}
              fill="none"
            />
            <circle
              className="filter-stat-ring-progress"
              cx={centerX}
              cy={centerY}
              r={ringRadius}
              fill="none"
              strokeDasharray={editionsCircumference}
              strokeDashoffset={editionsDashOffset}
              transform={`rotate(-90 ${centerX} ${centerY})`}
            />
          </svg>
        </div>
        <div className="filter-stat-label">{editionsLabel}</div>
      </div>
      <div className="filter-stat-item">
        <div className="filter-stat-circle-wrapper">
          <div className="filter-stat-circle">
            {filteredCardsCount}
          </div>
          <svg className="filter-stat-ring" viewBox="0 0 70 70">
            <circle
              className="filter-stat-ring-bg"
              cx={centerX}
              cy={centerY}
              r={ringRadius}
              fill="none"
            />
            <circle
              className="filter-stat-ring-progress"
              cx={centerX}
              cy={centerY}
              r={ringRadius}
              fill="none"
              strokeDasharray={cardsCircumference}
              strokeDashoffset={cardsDashOffset}
              transform={`rotate(-90 ${centerX} ${centerY})`}
            />
          </svg>
        </div>
        <div className="filter-stat-label">{cardsLabel}</div>
      </div>
    </div>
  )
}

export default FilterStats
