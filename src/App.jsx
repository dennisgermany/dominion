import { useState, useMemo, useCallback, useEffect } from 'react'
import dominionData from '../dominion.json'
import { useLanguage } from './contexts/LanguageContext'
import EditionFilter from './components/EditionFilter'
import SearchBar from './components/SearchBar'
import TypeFilter from './components/TypeFilter'
import ImageFilter from './components/ImageFilter'
import SortControl from './components/SortControl'
import CardGrid from './components/CardGrid'
import LanguagePicker from './components/LanguagePicker'
import FilterStats from './components/FilterStats'
import SettingsOverlay from './components/SettingsOverlay'
import Login from './components/Login'
import { REQUIRE_PASSWORD } from './config/auth'

function App() {
  const { language } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedEditions, setSelectedEditions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [imageFilter, setImageFilter] = useState('all') // 'all', 'with', 'without'
  const [sortField, setSortField] = useState('price')
  const [sortDirection, setSortDirection] = useState('asc')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cardsWithImages, setCardsWithImages] = useState(new Set())
  const [showCardImages, setShowCardImages] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [cardSizeFactor, setCardSizeFactor] = useState(1.0)

  // Check authentication status on mount
  useEffect(() => {
    if (!REQUIRE_PASSWORD) {
      // Password not required, automatically authenticate
      setIsAuthenticated(true)
      return
    }
    // Password required, check localStorage
    const authStatus = localStorage.getItem('authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Load persisted settings on mount
  useEffect(() => {
    const stored = localStorage.getItem('cardSizeFactor')
    if (stored != null) {
      const parsed = Number.parseFloat(stored)
      if (Number.isFinite(parsed)) {
        const clamped = Math.min(1.0, Math.max(0.5, parsed))
        setCardSizeFactor(clamped)
      }
    }
  }, [])

  // Persist settings
  useEffect(() => {
    localStorage.setItem('cardSizeFactor', String(cardSizeFactor))
  }, [cardSizeFactor])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  // Create card lookup map for efficient ID-based lookups
  const cardMap = useMemo(() => {
    const map = new Map()
    dominionData.cards.forEach(card => map.set(card.id, card))
    return map
  }, [])

  // Create edition name to ID lookup map (using current language)
  const editionNameToIdMap = useMemo(() => {
    const map = new Map()
    dominionData.editions.forEach(edition => {
      const editionName = language === 'de' ? edition.edition_de : edition.edition_en
      map.set(editionName, edition.id)
    })
    return map
  }, [language])

  // Extract all unique card types from all cards
  const allTypes = useMemo(() => {
    const types = new Set()
    dominionData.cards.forEach(card => {
      card.type.forEach(type => types.add(type))
    })
    return Array.from(types).sort()
  }, [])

  // Get all cards from selected edition(s)
  const cards = useMemo(() => {
    // Build a map of card ID -> Set of editions it appears in
    const cardEditionsMap = new Map()
    
    if (selectedEditions.length === 0) {
      // No editions selected - show all cards
      dominionData.editions.forEach(edition => {
        edition.card_ids.forEach(cardId => {
          if (!cardEditionsMap.has(cardId)) {
            cardEditionsMap.set(cardId, new Set())
          }
          const editionName = language === 'de' ? edition.edition_de : edition.edition_en
          cardEditionsMap.get(cardId).add(editionName)
        })
      })
    } else {
      // Get cards from selected editions (union - show cards that appear in ANY selected edition)
      selectedEditions.forEach(editionId => {
        const edition = dominionData.editions.find(e => e.id === editionId)
        if (edition) {
          edition.card_ids.forEach(cardId => {
            if (!cardEditionsMap.has(cardId)) {
              cardEditionsMap.set(cardId, new Set())
            }
            // Add the selected edition
            const editionName = language === 'de' ? edition.edition_de : edition.edition_en
            cardEditionsMap.get(cardId).add(editionName)
            // Also check if this card appears in other editions
            dominionData.editions.forEach(otherEdition => {
              if (otherEdition.card_ids.includes(cardId)) {
                const otherEditionName = language === 'de' ? otherEdition.edition_de : otherEdition.edition_en
                cardEditionsMap.get(cardId).add(otherEditionName)
              }
            })
          })
        }
      })
    }

    // Convert map to array of cards with editions
    let allCards = []
    cardEditionsMap.forEach((editionsSet, cardId) => {
      const card = cardMap.get(cardId)
      if (card) {
        const editions = Array.from(editionsSet).sort()
        allCards.push({ ...card, editions })
      }
    })

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      allCards = allCards.filter(card => 
        card.en.toLowerCase().includes(query) || 
        (card.de && card.de.toLowerCase().includes(query))
      )
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      allCards = allCards.filter(card => 
        card.type.some(type => selectedTypes.includes(type))
      )
    }

    // Apply image filter
    if (imageFilter !== 'all') {
      allCards = allCards.filter(card => {
        const hasImage = cardsWithImages.has(card.id)
        return imageFilter === 'with' ? hasImage : !hasImage
      })
    }

    // Apply sorting
    allCards.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'name':
          const nameA = language === 'de' ? (a.de || a.en) : a.en
          const nameB = language === 'de' ? (b.de || b.en) : b.en
          comparison = nameA.toLowerCase().localeCompare(nameB.toLowerCase())
          break
        case 'price':
          const priceA = parseInt(a.price) || 0
          const priceB = parseInt(b.price) || 0
          comparison = priceA - priceB
          break
        case 'type':
          const typeA = a.type[0] || ''
          const typeB = b.type[0] || ''
          comparison = typeA.localeCompare(typeB)
          // If types are equal, sort by name
          if (comparison === 0) {
            const nameA = language === 'de' ? (a.de || a.en) : a.en
            const nameB = language === 'de' ? (b.de || b.en) : b.en
            comparison = nameA.toLowerCase().localeCompare(nameB.toLowerCase())
          }
          break
        case 'edition':
          const editionA = a.editions && a.editions[0] ? a.editions[0] : ''
          const editionB = b.editions && b.editions[0] ? b.editions[0] : ''
          comparison = editionA.localeCompare(editionB)
          // If editions are equal, sort by name
          if (comparison === 0) {
            const nameA = language === 'de' ? (a.de || a.en) : a.en
            const nameB = language === 'de' ? (b.de || b.en) : b.en
            comparison = nameA.toLowerCase().localeCompare(nameB.toLowerCase())
          }
          break
        default:
          comparison = 0
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return allCards
  }, [selectedEditions, searchQuery, selectedTypes, imageFilter, cardsWithImages, sortField, sortDirection, cardMap, language])

  // Callback to track which cards have images
  const handleImageLoad = useCallback((cardId, hasImage) => {
    setCardsWithImages(prev => {
      const newSet = new Set(prev)
      if (hasImage) {
        newSet.add(cardId)
      } else {
        newSet.delete(cardId)
      }
      return newSet
    })
  }, [])

  const headerText = language === 'de' ? 'Dominion Karten-Browser' : 'Dominion Card Browser'

  // Show login screen if password is required and not authenticated
  if (REQUIRE_PASSWORD && !isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app" style={{ '--cardSizeFactor': cardSizeFactor }}>
      <header className="app-header">
        <div style={{ position: 'relative' }}>
          <LanguagePicker />
          <button
            className="settings-button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label={language === 'de' ? 'Einstellungen öffnen' : 'Open settings'}
            title={language === 'de' ? 'Einstellungen' : 'Settings'}
          >
            ⚙️
          </button>
          <h1>{headerText}</h1>
        </div>
      </header>
      
      <div className="app-content">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle filters menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'} Filters
        </button>
        
        <div className={`filters-container ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button 
            className="mobile-close-button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close filters menu"
          >
            ✕
          </button>
          
          <FilterStats
            selectedEditionsCount={selectedEditions.length}
            filteredCardsCount={cards.length}
            totalEditionsCount={dominionData.editions.length}
            totalCardsCount={dominionData.cards.length}
          />
          
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <EditionFilter
            editions={dominionData.editions}
            selectedEditions={selectedEditions}
            onEditionsChange={setSelectedEditions}
          />
          
          <TypeFilter
            types={allTypes}
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
          />
          
          <ImageFilter
            imageFilter={imageFilter}
            onImageFilterChange={setImageFilter}
          />
          
          <SortControl
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={setSortField}
            onSortDirectionChange={setSortDirection}
          />
        </div>

        <CardGrid 
          cards={cards}
          editions={dominionData.editions}
          language={language}
          showCardImages={showCardImages}
          cardSizeFactor={cardSizeFactor}
          onImageLoad={handleImageLoad}
          onEditionClick={(editionName) => {
            const editionId = editionNameToIdMap.get(editionName)
            if (editionId) {
              // Toggle edition selection
              if (selectedEditions.includes(editionId)) {
                setSelectedEditions(selectedEditions.filter(id => id !== editionId))
              } else {
                setSelectedEditions([...selectedEditions, editionId])
              }
            }
          }}
        />
      </div>

      <SettingsOverlay
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        showCardImages={showCardImages}
        onShowCardImagesChange={setShowCardImages}
        cardSizeFactor={cardSizeFactor}
        onCardSizeFactorChange={setCardSizeFactor}
      />
    </div>
  )
}

export default App
