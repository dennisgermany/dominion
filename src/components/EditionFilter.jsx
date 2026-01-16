import { useState, useEffect, useRef } from 'react'
import { getEditionColor } from '../constants/editionColors'
import { useLanguage } from '../contexts/LanguageContext'

function EditionFilter({ editions, selectedEditions, onEditionsChange }) {
  const { language } = useLanguage()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
        setSearchQuery('')
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Get selected edition objects
  const selectedEditionObjects = editions.filter(edition => 
    selectedEditions.includes(edition.id)
  )

  // Get available (unselected) editions filtered by search
  const availableEditions = editions
    .filter(edition => !selectedEditions.includes(edition.id))
    .filter(edition => {
      const editionName = language === 'de' ? edition.edition_de : edition.edition_en
      const editionNameEn = edition.edition_en
      const editionNameDe = edition.edition_de
      const query = searchQuery.toLowerCase()
      return (
        editionName.toLowerCase().includes(query) ||
        editionNameEn.toLowerCase().includes(query) ||
        editionNameDe.toLowerCase().includes(query) ||
        edition.release_date.includes(searchQuery)
      )
    })

  const handleRemoveEdition = (editionId) => {
    onEditionsChange(selectedEditions.filter(id => id !== editionId))
  }

  const handleAddEdition = (editionId) => {
    onEditionsChange([...selectedEditions, editionId])
    // Keep dropdown open for adding more editions
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
  }

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
    if (!isDropdownOpen) {
      setSearchQuery('')
    }
  }

  const handleClearAll = () => {
    onEditionsChange([])
    setIsDropdownOpen(false)
    setSearchQuery('')
  }

  const filterLabel = language === 'de' ? 'Nach Edition filtern:' : 'Filter by Edition:'
  const clearText = language === 'de' ? 'Löschen' : 'Clear'

  return (
    <div className="filter-group">
      <div className="type-filter-header">
        <label>{filterLabel}</label>
        {selectedEditions.length > 0 && (
          <button onClick={handleClearAll} className="clear-button">
            {clearText} ({selectedEditions.length})
          </button>
        )}
      </div>

      {/* Selected Editions as Badges */}
      {selectedEditionObjects.length > 0 && (
        <div className="edition-badges-container">
          {selectedEditionObjects.map(edition => {
            const editionName = language === 'de' ? edition.edition_de : edition.edition_en
            // Always use English name for color lookup
            const color = getEditionColor(edition.edition_en)
            return (
              <div
                key={edition.id}
                className="edition-filter-badge"
                style={{
                  backgroundColor: color.background,
                  borderColor: color.border,
                  color: color.text
                }}
              >
                <span>{editionName} ({edition.release_date})</span>
                <button
                  className="edition-filter-badge-remove"
                  onClick={() => handleRemoveEdition(edition.id)}
                  aria-label={`Remove ${editionName}`}
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Editions Button and Dropdown */}
      <div className="edition-dropdown-wrapper" ref={dropdownRef}>
        <button
          className="add-editions-button"
          onClick={handleToggleDropdown}
          aria-label={language === 'de' ? 'Editionen hinzufügen' : 'Add editions'}
        >
          {isDropdownOpen 
            ? (language === 'de' ? '− Schließen' : '− Close')
            : (language === 'de' ? '+ Editionen hinzufügen' : '+ Add Editions')}
        </button>

        {isDropdownOpen && (
          <div className="edition-dropdown">
            <input
              type="text"
              className="edition-dropdown-search"
              placeholder={language === 'de' ? 'Editionen suchen...' : 'Search editions...'}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              autoFocus
            />
            <div className="edition-dropdown-list">
              {availableEditions.length > 0 ? (
                availableEditions.map(edition => {
                  const editionName = language === 'de' ? edition.edition_de : edition.edition_en
                  // Always use English name for color lookup
                  const color = getEditionColor(edition.edition_en)
                  return (
                    <button
                      key={edition.id}
                      className="edition-dropdown-item"
                      onClick={() => handleAddEdition(edition.id)}
                      style={{
                        borderLeftColor: color.border
                      }}
                    >
                      <span>{editionName}</span>
                      <span className="edition-dropdown-date">{edition.release_date}</span>
                    </button>
                  )
                })
              ) : (
                <div className="edition-dropdown-empty">
                  {searchQuery 
                    ? (language === 'de' ? 'Keine Editionen gefunden, die Ihrer Suche entsprechen' : 'No editions found matching your search')
                    : (language === 'de' ? 'Keine weiteren Editionen verfügbar' : 'No more editions available')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditionFilter
