/**
 * One-time script: add "kingdom" boolean to each card in dominion.json.
 * - kingdom: false for basic cards (Copper, Silver, Gold, Estate, Duchy, Province, Curse)
 * - kingdom: false for cards whose type contains only Event, Landmark, and/or Project
 * - kingdom: true for all other cards
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const jsonPath = join(rootDir, 'dominion.json')

const BASIC_CARD_NAMES = new Set([
  'Copper', 'Silver', 'Gold', 'Estate', 'Duchy', 'Province', 'Curse'
])
const NON_SUPPLY_TYPES = new Set(['Event', 'Landmark', 'Project'])

function isKingdomCard(card) {
  if (BASIC_CARD_NAMES.has(card.en)) return false
  const types = card.type || []
  const onlyNonSupply = types.length > 0 && types.every(t => NON_SUPPLY_TYPES.has(t))
  if (onlyNonSupply) return false
  return true
}

const data = JSON.parse(readFileSync(jsonPath, 'utf8'))
for (const card of data.cards) {
  card.kingdom = isKingdomCard(card)
}
writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8')
console.log(`Updated ${data.cards.length} cards with kingdom field.`)
