import { useState, useEffect } from 'react'
import { getEditionColor } from '../constants/editionColors'
import { useLanguage } from '../contexts/LanguageContext'
import { getImageURL } from '../utils/imageStorage'

function Card({ card, onEditionClick, editions, language: propLanguage, showCardImages = true, onImageLoad }) {
  const { language: contextLanguage } = useLanguage()
  const language = propLanguage || contextLanguage
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const [objectURL, setObjectURL] = useState(null)
  
  // Helper to get English edition name from localized name
  const getEnglishEditionName = (localizedName) => {
    if (!editions) return localizedName
    const edition = editions.find(e => 
      e.edition_en === localizedName || e.edition_de === localizedName
    )
    return edition ? edition.edition_en : localizedName
  }
  
  const primaryName = language === 'de' ? (card.de || card.en) : card.en
  const subtitleName = language === 'de' ? card.en : null
  const showSubtitle = language === 'de' && subtitleName && subtitleName !== primaryName
  const shouldReserveSubtitleSpace = language === 'de'

  const defaultImagePath = `/cards/${card.id}.jpg`

  // Load image from IndexedDB first, fall back to default path
  useEffect(() => {
    let isMounted = true
    let currentObjectURL = null

    const loadImage = async () => {
      // Revoke previous object URL if it exists
      if (objectURL) {
        URL.revokeObjectURL(objectURL)
        setObjectURL(null)
      }

      try {
        // Try to get image from IndexedDB first
        const url = await getImageURL(card.id)
        if (url && isMounted) {
          currentObjectURL = url
          setObjectURL(url)
          setImageSrc(url)
          setImageError(false)
          return
        }
      } catch (error) {
        console.error('Error loading image from IndexedDB:', error)
      }

      // Fall back to default path
      if (isMounted) {
        setImageSrc(defaultImagePath)
        setImageError(false)
      }
    }

    loadImage()

    // Cleanup: revoke object URL when component unmounts or card changes
    return () => {
      isMounted = false
      if (currentObjectURL) {
        URL.revokeObjectURL(currentObjectURL)
      }
    }
  }, [card.id, defaultImagePath])

  // Listen for image upload events to refresh
  useEffect(() => {
    const handleImageUpload = () => {
      // Reload image when new images are uploaded
      const loadImage = async () => {
        if (objectURL) {
          URL.revokeObjectURL(objectURL)
          setObjectURL(null)
        }
        try {
          const url = await getImageURL(card.id)
          if (url) {
            setObjectURL(url)
            setImageSrc(url)
            setImageError(false)
          } else {
            setImageSrc(defaultImagePath)
            setImageError(false)
          }
        } catch (error) {
          console.error('Error reloading image:', error)
          setImageSrc(defaultImagePath)
        }
      }
      loadImage()
    }

    window.addEventListener('dominion-images-updated', handleImageUpload)
    return () => {
      window.removeEventListener('dominion-images-updated', handleImageUpload)
    }
  }, [card.id, defaultImagePath, objectURL])

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-name">{primaryName}</h3>
        {shouldReserveSubtitleSpace && (
          <p className="card-name-de" style={{ visibility: showSubtitle ? 'visible' : 'hidden' }}>
            {subtitleName || '\u00A0'}
          </p>
        )}
      </div>
      
      {showCardImages && !imageError && imageSrc && (
        <div className="card-image-container">
          <img
            src={imageSrc}
            alt={primaryName}
            className="card-image"
            onLoad={() => {
              if (onImageLoad) {
                onImageLoad(card.id, true)
              }
            }}
            onError={() => {
              setImageError(true)
              if (onImageLoad) {
                onImageLoad(card.id, false)
              }
            }}
          />
        </div>
      )}
      
      <div className="card-body">
        <div className="card-price">
          <span className="price-label">{language === 'de' ? 'Preis:' : 'Price:'}</span>
          <span className="price-value">{card.price}</span>
        </div>
        
        {card.editions && card.editions.length > 0 && (
          <div className="card-edition">
            <span className="edition-label">
              {card.editions.length === 1 
                ? (language === 'de' ? 'Edition:' : 'Edition:')
                : (language === 'de' ? 'Editionen:' : 'Editions:')}
            </span>
            <div className="edition-badges">
              {card.editions.map((editionName, index) => {
                const englishEditionName = getEnglishEditionName(editionName)
                const color = getEditionColor(englishEditionName)
                return (
                  <button
                    key={index}
                    className="edition-badge"
                    style={{
                      backgroundColor: color.background,
                      color: color.text,
                      borderColor: color.border
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      if (onEditionClick) {
                        onEditionClick(editionName)
                      }
                    }}
                    title={language === 'de' ? `Nach ${editionName} filtern` : `Filter by ${editionName}`}
                  >
                    {editionName}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        
        <div className="card-types">
          {card.type.map(type => (
            <span key={type} className={`type-badge type-${type.toLowerCase().replace(/\s+/g, '-')}`}>
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Card
