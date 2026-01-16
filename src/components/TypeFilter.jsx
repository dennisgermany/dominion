import { useState, useEffect, useRef } from 'react'

function TypeFilter({ types, selectedTypes, onTypesChange }) {
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
      <div className="type-dropdown-wrapper" ref={dropdownRef}>
        <button
          className="add-types-button"
          onClick={handleToggleDropdown}
          aria-label="Add types"
        >
          {isDropdownOpen ? '− Close' : '+ Add Types'}
        </button>

        {isDropdownOpen && (
          <div className="type-dropdown">
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
          </div>
        )}
      </div>
    </div>
  )
}

export default TypeFilter
