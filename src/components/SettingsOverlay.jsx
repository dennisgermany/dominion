import { useLanguage } from '../contexts/LanguageContext'

function SettingsOverlay({
  isOpen,
  onClose,
  showCardImages,
  onShowCardImagesChange,
  cardSizeFactor,
  onCardSizeFactorChange
}) {
  const { language } = useLanguage()

  if (!isOpen) return null

  const title = language === 'de' ? 'Einstellungen' : 'Settings'
  const showImagesLabel = language === 'de' ? 'Kartenbilder anzeigen' : 'Show card images'
  const cardSizeLabel = language === 'de' ? 'Kartengröße' : 'Card size'
  const resetLabel = language === 'de' ? 'Zurücksetzen' : 'Reset'
  const closeLabel = language === 'de' ? 'Schließen' : 'Close'

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="settings-overlay-backdrop" onClick={handleBackdropClick}>
      <div className="settings-overlay-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-overlay-header">
          <h2>{title}</h2>
          <button 
            className="settings-overlay-close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            ✕
          </button>
        </div>
        
        <div className="settings-overlay-content">
          <div className="settings-option">
            <label className="settings-toggle-label">
              <input
                type="checkbox"
                checked={showCardImages}
                onChange={(e) => onShowCardImagesChange(e.target.checked)}
                className="settings-toggle-input"
              />
              <span className="settings-toggle-switch"></span>
              <span className="settings-toggle-text">{showImagesLabel}</span>
            </label>
          </div>

          <div className="settings-option">
            <div className="settings-range-header">
              <span className="settings-range-label">{cardSizeLabel}</span>
              <span className="settings-range-value">{(cardSizeFactor ?? 1).toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={cardSizeFactor ?? 1}
              onChange={(e) => onCardSizeFactorChange(Number.parseFloat(e.target.value))}
              className="settings-range-input"
              aria-label={cardSizeLabel}
            />
            <button
              type="button"
              className="settings-reset-button"
              onClick={() => onCardSizeFactorChange(1.0)}
            >
              {resetLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsOverlay
