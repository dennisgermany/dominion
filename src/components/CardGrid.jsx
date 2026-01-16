import Card from './Card'
import { useLanguage } from '../contexts/LanguageContext'

function CardGrid({ cards, editions, language, showCardImages, cardSizeFactor, onEditionClick, onImageLoad }) {
  const { language: contextLanguage } = useLanguage()
  const lang = language || contextLanguage
  
  if (cards.length === 0) {
    const message1 = lang === 'de' 
      ? 'Keine Karten gefunden, die Ihren Filtern entsprechen.'
      : 'No cards found matching your filters.'
    const message2 = lang === 'de'
      ? 'Versuchen Sie, Ihre Suche oder Filterkriterien anzupassen.'
      : 'Try adjusting your search or filter criteria.'
    
    return (
      <div className="no-cards">
        <p>{message1}</p>
        <p>{message2}</p>
      </div>
    )
  }

  return (
    <div className="card-grid" style={cardSizeFactor ? { '--cardSizeFactor': cardSizeFactor } : undefined}>
      {cards.map(card => (
        <Card 
          key={card.id} 
          card={card} 
          editions={editions}
          language={lang}
          showCardImages={showCardImages}
          onEditionClick={onEditionClick}
          onImageLoad={onImageLoad}
        />
      ))}
    </div>
  )
}

export default CardGrid
