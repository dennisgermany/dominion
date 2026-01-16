function SortControl({ sortField, sortDirection, onSortFieldChange, onSortDirectionChange }) {
  const sortFields = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'type', label: 'Type' },
    { value: 'edition', label: 'Edition' }
  ]

  return (
    <div className="filter-group">
      <label>Sort By:</label>
      <div className="sort-control">
        <div className="sort-buttons">
          {sortFields.map(field => (
            <button
              key={field.value}
              className={`sort-button ${sortField === field.value ? 'active' : ''}`}
              onClick={() => onSortFieldChange(field.value)}
            >
              {field.label}
            </button>
          ))}
        </div>
        <button
          className={`sort-direction-toggle ${sortDirection === 'desc' ? 'desc' : 'asc'}`}
          onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
          title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  )
}

export default SortControl
