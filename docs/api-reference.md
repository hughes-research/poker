# API Reference

Complete API documentation for all modules, functions, and classes in the poker game.

## Table of Contents

- [Game Engine](#game-engine)
- [Hand Evaluator](#hand-evaluator)
- [AI Opponent](#ai-opponent)
- [Deck Management](#deck-management)
- [Game Store](#game-store)
- [Type Definitions](#type-definitions)
- [Utility Functions](#utility-functions)

## Game Engine

### Class: `GameEngine`

Manages the core poker game logic, betting rounds, and game flow.

#### Constructor

```typescript
constructor(
  initialChips?: number,
  smallBet?: number,
  bigBet?: number
)
```

**Parameters:**
- `initialChips` (optional): Starting chip count for each player (default: 1000)
- `smallBet` (optional): Small bet limit (default: 2)
- `bigBet` (optional): Big bet limit (default: 4)

**Example:**
```typescript
const engine = new GameEngine(100, 2, 4);
```

#### Methods

##### `startGame(): void`

Starts a new game by dealing cards and initializing the first betting round.

**Throws:** None

**Example:**
```typescript
engine.startGame();
```

##### `playerBet(amount: number): void`

Player places a bet.

**Parameters:**
- `amount`: Bet amount (must not exceed current betting limit)

**Throws:**
- `Error`: If not player's turn, amount exceeds limit, or insufficient chips

**Example:**
```typescript
engine.playerBet(2);
```

##### `playerCheck(): void`

Player checks (only valid when no bet has been placed).

**Throws:**
- `Error`: If not player's turn or if a bet exists

**Example:**
```typescript
engine.playerCheck();
```

##### `playerCall(): void`

Player calls (matches the current bet).

**Throws:**
- `Error`: If not player's turn, no bet to call, or insufficient chips

**Example:**
```typescript
engine.playerCall();
```

##### `playerRaise(amount: number): void`

Player raises the bet.

**Parameters:**
- `amount`: Additional amount to raise (total bet = currentBet + amount)

**Throws:**
- `Error`: If not player's turn, raise exceeds limit, or insufficient chips

**Example:**
```typescript
engine.playerRaise(2);
```

##### `playerFold(): void`

Player folds, ending the hand.

**Throws:**
- `Error`: If not player's turn

**Example:**
```typescript
engine.playerFold();
```

##### `getPhase(): GamePhase`

Returns the current game phase.

**Returns:** `GamePhase` - Current phase ('IDLE' | 'DEALING' | 'BETTING' | 'DRAWING' | 'SHOWDOWN' | 'GAME_OVER')

##### `getPlayer(): Player`

Returns a copy of the player state.

**Returns:** `Player` - Player object

##### `getOpponent(): Player`

Returns a copy of the opponent state.

**Returns:** `Player` - Opponent object

##### `getPot(): number`

Returns the current pot size.

**Returns:** `number` - Pot amount

##### `getBettingRound(): BettingRound | null`

Returns the current betting round state.

**Returns:** `BettingRound | null` - Betting round object or null

## Hand Evaluator

### Function: `evaluateHand(hand: Hand): HandEvaluation`

Evaluates a 5-card poker hand and returns its rank and value.

**Parameters:**
- `hand`: Array of exactly 5 cards

**Returns:** `HandEvaluation` - Object containing:
  - `rank`: HandRank (e.g., 'ROYAL_FLUSH', 'PAIR', etc.)
  - `value`: Numeric value for comparison (higher = better)
  - `cards`: Sorted array of cards
  - `kickers`: Array of kicker cards for tie-breaking

**Throws:**
- `Error`: If hand doesn't contain exactly 5 cards

**Example:**
```typescript
const hand = [
  { rank: 'ace', suit: 'spades' },
  { rank: 'king', suit: 'spades' },
  { rank: 'queen', suit: 'spades' },
  { rank: 'jack', suit: 'spades' },
  { rank: '10', suit: 'spades' }
];
const evaluation = evaluateHand(hand);
// Returns: { rank: 'ROYAL_FLUSH', value: 9000, ... }
```

### Function: `compareHands(hand1: Hand, hand2: Hand): number`

Compares two hands and returns the comparison result.

**Parameters:**
- `hand1`: First hand (5 cards)
- `hand2`: Second hand (5 cards)

**Returns:** `number`
  - `1`: hand1 wins
  - `0`: tie
  - `-1`: hand2 wins

**Example:**
```typescript
const result = compareHands(playerHand, opponentHand);
if (result > 0) {
  console.log('Player wins!');
}
```

## AI Opponent

### Function: `makeAIDecision(gameEngine: GameEngine): { action: PlayerAction; amount?: number }`

Determines the AI opponent's action based on game state.

**Parameters:**
- `gameEngine`: GameEngine instance with current game state

**Returns:** Object with:
  - `action`: PlayerAction ('BET' | 'CHECK' | 'CALL' | 'RAISE' | 'FOLD')
  - `amount`: Optional bet/raise amount

**Example:**
```typescript
const decision = makeAIDecision(gameEngine);
if (decision.action === 'BET') {
  gameEngine.opponentBet(decision.amount!);
}
```

**Decision Logic:**
- Hand strength ≥ 0.8: Aggressive betting/raising
- Hand strength ≥ 0.6: Moderate betting, calls with good pot odds
- Hand strength ≥ 0.4: Calls only with favorable pot odds
- Hand strength < 0.4: Folds unless pot odds are very favorable

## Deck Management

### Class: `Deck`

Manages a deck of playing cards.

#### Constructor

```typescript
constructor(cards?: Card[])
```

**Parameters:**
- `cards` (optional): Pre-existing card array (default: creates new 52-card deck)

#### Methods

##### `shuffle(): void`

Shuffles the deck using Fisher-Yates algorithm.

##### `deal(count: number): Card[]`

Deals specified number of cards from the deck.

**Parameters:**
- `count`: Number of cards to deal

**Returns:** `Card[]` - Array of dealt cards

**Throws:**
- `Error`: If insufficient cards remaining

##### `dealOne(): Card`

Deals a single card from the deck.

**Returns:** `Card` - Single card

**Throws:**
- `Error`: If deck is empty

##### `remaining(): number`

Returns number of cards remaining in deck.

**Returns:** `number` - Card count

##### `reset(): void`

Resets deck to full 52-card deck and shuffles.

## Game Store

### Hook: `useGameStore()`

Zustand store hook for game state management.

**Returns:** `GameStore` - Store object with state and actions

#### State Properties

```typescript
interface GameStore {
  // Match state
  matchPlayerScore: number;
  matchOpponentScore: number;
  matchWinner: 'player' | 'opponent' | null;
  targetScore: number;
  
  // Game state
  phase: GamePhase;
  player: Player | null;
  opponent: Player | null;
  pot: number;
  bettingRound: BettingRound | null;
  selectedCards: number[];
  message: string;
  
  // Settings
  settings: Settings;
  gameHistory: GameHistory[];
}
```

#### Actions

##### `startNewMatch(): void`

Starts a new match (resets scores and begins first hand).

##### `startHand(): void`

Starts a new hand (deals cards, collects antes, initializes betting).

##### `playerBet(amount: number): void`

Player places a bet.

##### `playerCheck(): void`

Player checks.

##### `playerCall(): void`

Player calls the current bet.

##### `playerRaise(amount: number): void`

Player raises the bet.

##### `playerFold(): void`

Player folds.

##### `toggleCardSelection(cardIndex: number): void`

Toggles selection of a card for discarding.

##### `playerDraw(): void`

Player discards selected cards and draws new ones.

##### `continueToNextHand(): void`

Continues to next hand or shows intro if match is over.

##### `updateSettings(settings: Settings): void`

Updates game settings.

## Type Definitions

### `Card`

```typescript
interface Card {
  rank: Rank;
  suit: Suit;
}
```

### `Player`

```typescript
interface Player {
  id: string;
  name: string;
  chips: number;
  hand: Hand;
  cardsFaceUp: boolean[];
  isActive: boolean;
  hasFolded: boolean;
  currentBet: number;
}
```

### `BettingRound`

```typescript
interface BettingRound {
  round: number;
  currentBet: number;
  pot: number;
  activePlayer: 'player' | 'opponent';
  lastAction: PlayerAction | null;
}
```

### `HandEvaluation`

```typescript
interface HandEvaluation {
  rank: HandRank;
  value: number;
  cards: Card[];
  kickers: Card[];
}
```

### `GamePhase`

```typescript
type GamePhase = 'IDLE' | 'DEALING' | 'BETTING' | 'DRAWING' | 'SHOWDOWN' | 'GAME_OVER';
```

### `PlayerAction`

```typescript
type PlayerAction = 'BET' | 'FOLD' | 'CHECK' | 'CALL' | 'RAISE';
```

### `HandRank`

```typescript
type HandRank =
  | 'HIGH_CARD'
  | 'PAIR'
  | 'TWO_PAIR'
  | 'THREE_OF_A_KIND'
  | 'STRAIGHT'
  | 'FLUSH'
  | 'FULL_HOUSE'
  | 'FOUR_OF_A_KIND'
  | 'STRAIGHT_FLUSH'
  | 'ROYAL_FLUSH';
```

## Utility Functions

### `createDeck(): Card[]`

Creates a standard 52-card deck.

**Returns:** `Card[]` - Array of 52 cards

### `shuffleDeck(deck: Card[]): Card[]`

Shuffles a deck using Fisher-Yates algorithm.

**Parameters:**
- `deck`: Array of cards to shuffle

**Returns:** `Card[]` - New shuffled array

### `getCardPath(card: Card | 'back'): string`

Returns the public path to a card SVG file.

**Parameters:**
- `card`: Card object or 'back' for card back

**Returns:** `string` - Path to SVG file (e.g., '/cards/ace_of_spades.svg')

### `getCardFilename(card: Card): string`

Maps a Card object to its SVG filename.

**Parameters:**
- `card`: Card object

**Returns:** `string` - Filename (e.g., 'ace_of_spades.svg')

