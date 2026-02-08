import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function TypeFilter({ types, selectedTypes, onTypesChange }) {
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

  // Get available (unselected) types filtered by search
  const availableTypes = types
    .filter(type => !selectedTypes.includes(type))
    .filter(type => 
      type.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const handleRemoveType = (type) => {
    onTypesChange(selectedTypes.filter(t => t !== type))
  }

  const handleAddType = (type) => {
    onTypesChange([...selectedTypes, type])
    // Keep dropdown open for adding more types
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
    onTypesChange([])
    setIsDropdownOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="filter-group">
      <div className="type-filter-header">
        <label>Filter by Type:</label>
        {selectedTypes.length > 0 && (
          <button onClick={handleClearAll} className="clear-button">
            Clear ({selectedTypes.length})
          </button>
        )}
      </div>

      {/* Selected Types as Badges */}
      {selectedTypes.length > 0 && (
        <div className="type-badges-container">
          {selectedTypes.map(type => (
            <div
              key={type}
              className="type-filter-badge"
            >
              <span>{type}</span>
              <button
                className="type-filter-badge-remove"
                onClick={() => handleRemoveType(type)}
                aria-label={`Remove ${type}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Types Button and Dropdown */}
      <div className="type-dropdown-wrapper">
        <button
          ref={triggerRef}
          className="add-types-button"
          onClick={handleToggleDropdown}
          aria-label="Add types"
        >
          {isDropdownOpen ? '− Close' : '+ Add Types'}
        </button>

        {isDropdownOpen && createPortal(
          <div
            ref={dropdownRef}
            className="type-dropdown type-dropdown-portal"
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
              className="type-dropdown-search"
              placeholder="Search types..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              autoFocus
            />
            <div className="type-dropdown-list">
              {availableTypes.length > 0 ? (
                availableTypes.map(type => (
                  <button
                    key={type}
                    className="type-dropdown-item"
                    onClick={() => handleAddType(type)}
                  >
                    <span>{type}</span>
                  </button>
                ))
              ) : (
                <div className="type-dropdown-empty">
                  {searchQuery 
                    ? 'No types found matching your search'
                    : 'No more types available'}
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

export default TypeFilter
