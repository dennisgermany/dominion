import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { storeImage, clearAllImages, getImageCount } from '../utils/imageStorage'

function SettingsOverlay({
  isOpen,
  onClose,
  showCardImages,
  onShowCardImagesChange,
  cardSizeFactor,
  onCardSizeFactorChange
}) {
  const { language } = useLanguage()
  const fileInputRef = useRef(null)
  const [uploadStatus, setUploadStatus] = useState(null) // { type: 'success'|'error'|'uploading', message: string, count?: number }
  const [uploadedCount, setUploadedCount] = useState(0)
  const [isClearing, setIsClearing] = useState(false)

  // Load uploaded image count on mount and when overlay opens
  useEffect(() => {
    if (isOpen) {
      getImageCount().then(count => {
        setUploadedCount(count)
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  const title = language === 'de' ? 'Einstellungen' : 'Settings'
  const showImagesLabel = language === 'de' ? 'Kartenbilder anzeigen' : 'Show card images'
  const cardSizeLabel = language === 'de' ? 'Kartengröße' : 'Card size'
  const resetLabel = language === 'de' ? 'Zurücksetzen' : 'Reset'
  const closeLabel = language === 'de' ? 'Schließen' : 'Close'
  const uploadLabel = language === 'de' ? 'Ordner mit Bildern hochladen' : 'Upload folder of images'
  const clearLabel = language === 'de' ? 'Hochgeladene Bilder löschen' : 'Clear uploaded images'
  const imageUploadLabel = language === 'de' ? 'Bild-Upload' : 'Image Upload'

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleFolderSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadStatus({ type: 'uploading', message: language === 'de' ? 'Bilder werden hochgeladen...' : 'Uploading images...' })

    try {
      let successCount = 0
      let errorCount = 0
      const invalidFiles = []

      for (const file of files) {
        // Validate file type - check both MIME type and extension
        const isImageByType = file.type.startsWith('image/')
        const isImageByExt = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.name)
        
        if (!isImageByType && !isImageByExt) {
          invalidFiles.push(file.name)
          errorCount++
          continue
        }

        // Extract card ID from filename
        // When using directory upload, file.name may include path, so extract just the filename
        const fullPath = file.name
        const filename = fullPath.split('/').pop() || fullPath.split('\\').pop() || fullPath
        
        // Remove file extension
        const nameWithoutExt = filename.replace(/\.[^.]+$/, '')
        
        // Card IDs in dominion.json are UUIDs, so try to match UUID first
        // UUID pattern: 8-4-4-4-12 hex digits (e.g., "d07e4264-98c8-4677-9492-b743f814eff9")
        const uuidMatch = nameWithoutExt.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i)
        
        let cardId = null
        
        if (uuidMatch) {
          // Filename is a UUID - use it directly as card ID
          cardId = uuidMatch[1]
        } else {
          // Fall back to numeric ID extraction for backward compatibility
          // Supports patterns like:
          // - "123.jpg" -> "123"
          // - "123 - Card Name.jpg" -> "123"
          // - "card_123.jpg" -> "123" (if number is at start)
          // - "123-something.png" -> "123"
          
          // Try to match number at the start of filename (most common pattern)
          let match = filename.match(/^(\d+)/)
          
          // If no match at start, try to find number anywhere before the extension
          if (!match) {
            match = nameWithoutExt.match(/(\d+)/)
          }
          
          if (match) {
            cardId = match[1]
          }
        }
        
        if (!cardId) {
          console.warn(`Could not extract card ID from filename: ${filename}`)
          invalidFiles.push(filename)
          errorCount++
          continue
        }

        try {
          await storeImage(cardId, file)
          successCount++
        } catch (error) {
          console.error(`Error storing image for card ${cardId} (${filename}):`, error)
          errorCount++
        }
      }

      // Log invalid files for debugging
      if (invalidFiles.length > 0 && invalidFiles.length <= 10) {
        console.warn('Invalid files (first 10):', invalidFiles)
      } else if (invalidFiles.length > 10) {
        console.warn(`Invalid files (showing first 10 of ${invalidFiles.length}):`, invalidFiles.slice(0, 10))
      }

      const newCount = await getImageCount()
      setUploadedCount(newCount)

      if (successCount > 0) {
        // Dispatch event to trigger card refresh
        window.dispatchEvent(new CustomEvent('dominion-images-updated'))
        
        setUploadStatus({
          type: 'success',
          message: language === 'de' 
            ? `${successCount} Bild(er) erfolgreich hochgeladen${errorCount > 0 ? `, ${errorCount} Fehler` : ''}`
            : `Successfully uploaded ${successCount} image(s)${errorCount > 0 ? `, ${errorCount} error(s)` : ''}`,
          count: successCount
        })
        } else {
          setUploadStatus({
            type: 'error',
            message: language === 'de' 
              ? `Fehler beim Hochladen: ${errorCount} ungültige Datei(en). Dateinamen müssen eine UUID (z.B. "d07e4264-98c8-4677-9492-b743f814eff9.jpg") oder eine Zahl enthalten.`
              : `Upload failed: ${errorCount} invalid file(s). Filenames must be a UUID (e.g., "d07e4264-98c8-4677-9492-b743f814eff9.jpg") or contain a number.`
          })
        }

      // Clear the input so the same folder can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Clear status message after 5 seconds
      setTimeout(() => {
        setUploadStatus(null)
      }, 5000)
    } catch (error) {
      console.error('Error uploading images:', error)
      setUploadStatus({
        type: 'error',
        message: language === 'de' 
          ? 'Fehler beim Hochladen der Bilder'
          : 'Error uploading images'
      })
      setTimeout(() => {
        setUploadStatus(null)
      }, 5000)
    }
  }

  const handleClearImages = async () => {
    if (!window.confirm(
      language === 'de' 
        ? 'Möchten Sie wirklich alle hochgeladenen Bilder löschen?'
        : 'Are you sure you want to clear all uploaded images?'
    )) {
      return
    }

    setIsClearing(true)
    try {
      await clearAllImages()
      setUploadedCount(0)
      // Dispatch event to trigger card refresh
      window.dispatchEvent(new CustomEvent('dominion-images-updated'))
      
      setUploadStatus({
        type: 'success',
        message: language === 'de' 
          ? 'Alle Bilder wurden gelöscht'
          : 'All images cleared'
      })
      setTimeout(() => {
        setUploadStatus(null)
      }, 3000)
    } catch (error) {
      console.error('Error clearing images:', error)
      setUploadStatus({
        type: 'error',
        message: language === 'de' 
          ? 'Fehler beim Löschen der Bilder'
          : 'Error clearing images'
      })
      setTimeout(() => {
        setUploadStatus(null)
      }, 3000)
    } finally {
      setIsClearing(false)
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

          <div className="settings-option">
            <div className="settings-upload-header">
              <span className="settings-upload-label">{imageUploadLabel}</span>
              {uploadedCount > 0 && (
                <span className="settings-upload-count">
                  ({uploadedCount} {language === 'de' ? 'Bilder' : 'images'})
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              accept="image/*"
              onChange={handleFolderSelect}
              style={{ display: 'none' }}
              id="folder-upload-input"
            />
            <label htmlFor="folder-upload-input" className="settings-upload-button">
              {uploadLabel}
            </label>
            {uploadedCount > 0 && (
              <button
                type="button"
                className="settings-clear-button"
                onClick={handleClearImages}
                disabled={isClearing}
              >
                {isClearing 
                  ? (language === 'de' ? 'Löschen...' : 'Clearing...')
                  : clearLabel
                }
              </button>
            )}
            {uploadStatus && (
              <div className={`settings-upload-status settings-upload-status-${uploadStatus.type}`}>
                {uploadStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsOverlay
