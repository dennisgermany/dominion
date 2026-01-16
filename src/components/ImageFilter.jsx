import { useLanguage } from '../contexts/LanguageContext'

function ImageFilter({ imageFilter, onImageFilterChange }) {
  const { language } = useLanguage()
  
  const label = language === 'de' ? 'Bild-Filter:' : 'Image Filter:'
  const allLabel = language === 'de' ? 'Alle' : 'All'
  const withImagesLabel = language === 'de' ? 'Mit Bildern' : 'With Images'
  const withoutImagesLabel = language === 'de' ? 'Ohne Bilder' : 'Without Images'

  return (
    <div className="filter-group">
      <label>{label}</label>
      <div className="image-filter-buttons">
        <button
          className={`image-filter-button ${imageFilter === 'all' ? 'active' : ''}`}
          onClick={() => onImageFilterChange('all')}
        >
          {allLabel}
        </button>
        <button
          className={`image-filter-button ${imageFilter === 'with' ? 'active' : ''}`}
          onClick={() => onImageFilterChange('with')}
        >
          {withImagesLabel}
        </button>
        <button
          className={`image-filter-button ${imageFilter === 'without' ? 'active' : ''}`}
          onClick={() => onImageFilterChange('without')}
        >
          {withoutImagesLabel}
        </button>
      </div>
    </div>
  )
}

export default ImageFilter
