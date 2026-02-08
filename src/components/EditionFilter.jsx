import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { getEditionColor } from '../constants/editionColors'
import { useLanguage } from '../contexts/LanguageContext'

function EditionFilter({ editions, selectedEditions, onEditionsChange }) {
  const { language } = useLanguage()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 })
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)

  // Position dropdown when it opens (for portal)
  useEffect(() => {
    if (isDropdownOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPosition({
        left: rect.right + 20,
        top: rect.bottom + 12
      })
    }
  }, [isDropdownOpen])

  // Close dropdown when clicking outside (trigger or portaled dropdown)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target
      const inTrigger = triggerRef.current && triggerRef.current.contains(target)
      const inDropdown = dropdownRef.current && dropdownRef.current.contains(target)
      if (!inTrigger && !inDropdown) {
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

  // Close dropdown on scroll or resize so it doesn't float in the wrong place
  useEffect(() => {
    if (!isDropdownOpen) return
    const handleScrollOrResize = () => {
      setIsDropdownOpen(false)
      setSearchQuery('')
    }
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
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
      <div className="edition-dropdown-wrapper">
        <button
          ref={triggerRef}
          className="add-editions-button"
          onClick={handleToggleDropdown}
          aria-label={language === 'de' ? 'Editionen hinzufügen' : 'Add editions'}
        >
          {isDropdownOpen 
            ? (language === 'de' ? '− Schließen' : '− Close')
            : (language === 'de' ? '+ Editionen hinzufügen' : '+ Add Editions')}
        </button>

        {isDropdownOpen && createPortal(
          <div
            ref={dropdownRef}
            className="edition-dropdown edition-dropdown-portal"
            style={{
              position: 'fixed',
              left: dropdownPosition.left,
              top: dropdownPosition.top,
              zIndex: 1000,
              minWidth: 320,
              width: 400
            }}
          >
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
          </div>,
          document.body
        )}
      </div>
    </div>
  )
}

export default EditionFilter
