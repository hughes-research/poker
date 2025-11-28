import { Deck } from './deck';
import { compareHands } from './handEvaluator';
import {
  Card,
  GamePhase,
  Hand,
  Player,
  PlayerAction,
  BettingRound,
} from '@/types';

/**
 * GameEngine class for managing 5-card stud poker game logic.
 */
export class GameEngine {
  private deck: Deck;
  private phase: GamePhase;
  private player: Player;
  private opponent: Player;
  private pot: number;
  private bettingRound: BettingRound | null;
  private fixedLimit: { smallBet: number; bigBet: number };
  private bettingRoundNumber: number;

  constructor(
    initialChips: number = 1000,
    smallBet: number = 2,
    bigBet: number = 4
  ) {
    this.deck = new Deck();
    this.deck.shuffle();
    this.phase = 'IDLE';
    this.pot = 0;
    this.bettingRound = null;
    this.bettingRoundNumber = 0;
    this.fixedLimit = { smallBet, bigBet };

    this.player = {
      id: 'player',
      name: 'Player',
      chips: initialChips,
      hand: [],
      cardsFaceUp: [],
      isActive: false,
      hasFolded: false,
      currentBet: 0,
    };

    this.opponent = {
      id: 'opponent',
      name: 'Opponent',
      chips: initialChips,
      hand: [],
      cardsFaceUp: [],
      isActive: false,
      hasFolded: false,
      currentBet: 0,
    };
  }

  /**
   * Starts a new game by dealing cards.
   */
  startGame(): void {
    this.deck.reset();
    this.phase = 'DEALING';
    this.pot = 0;
    this.bettingRoundNumber = 0;
    this.player.hand = [];
    this.opponent.hand = [];
    this.player.cardsFaceUp = [];
    this.opponent.cardsFaceUp = [];
    this.player.hasFolded = false;
    this.opponent.hasFolded = false;
    this.player.currentBet = 0;
    this.opponent.currentBet = 0;

    // Deal 5 cards to each player
    // In 5-card stud: 1 card face down, 4 cards face up
    this.player.hand = this.deck.deal(5);
    this.opponent.hand = this.deck.deal(5);

    // First card face down, rest face up
    this.player.cardsFaceUp = [false, true, true, true, true];
    this.opponent.cardsFaceUp = [false, true, true, true, true];

    // Start first betting round
    this.startBettingRound();
  }

  /**
   * Starts a new betting round.
   */
  private startBettingRound(): void {
    this.bettingRoundNumber++;
    const isSmallBet = this.bettingRoundNumber <= 2;
    const currentBetLimit = isSmallBet ? this.fixedLimit.smallBet : this.fixedLimit.bigBet;

    this.bettingRound = {
      round: this.bettingRoundNumber,
      currentBet: 0,
      pot: this.pot,
      activePlayer: 'player', // Player acts first
      lastAction: null,
    };

    this.player.isActive = true;
    this.opponent.isActive = false;
    this.player.currentBet = 0;
    this.opponent.currentBet = 0;
    this.phase = 'BETTING';
  }

  /**
   * Player places a bet.
   */
  playerBet(amount: number): void {
    if (this.phase !== 'BETTING' || !this.player.isActive) {
      throw new Error('Not player\'s turn to bet');
    }

    const isSmallBet = this.bettingRoundNumber <= 2;
    const maxBet = isSmallBet ? this.fixedLimit.smallBet : this.fixedLimit.bigBet;

    if (amount > maxBet) {
      throw new Error(`Bet amount exceeds limit: ${maxBet}`);
    }

    if (amount > this.player.chips) {
      throw new Error('Insufficient chips');
    }

    this.player.chips -= amount;
    this.player.currentBet = amount;
    this.pot += amount;
    this.bettingRound!.currentBet = amount;
    this.bettingRound!.lastAction = 'BET';
    this.player.isActive = false;
    this.opponent.isActive = true;

    // Check if opponent should act
    if (!this.opponent.hasFolded) {
      // Opponent will act (handled by AI)
    } else {
      this.endBettingRound();
    }
  }

  /**
   * Player checks (only if no bet has been placed).
   */
  playerCheck(): void {
    if (this.phase !== 'BETTING' || !this.player.isActive) {
      throw new Error('Not player\'s turn');
    }

    if (this.bettingRound!.currentBet > 0) {
      throw new Error('Cannot check when there is a bet');
    }

    this.bettingRound!.lastAction = 'CHECK';
    this.player.isActive = false;
    this.opponent.isActive = true;

    if (this.opponent.hasFolded) {
      this.endBettingRound();
    }
  }

  /**
   * Player calls (matches the current bet).
   */
  playerCall(): void {
    if (this.phase !== 'BETTING' || !this.player.isActive) {
      throw new Error('Not player\'s turn');
    }

    const amountToCall = this.bettingRound!.currentBet - this.player.currentBet;
    if (amountToCall <= 0) {
      throw new Error('No bet to call');
    }

    if (amountToCall > this.player.chips) {
      throw new Error('Insufficient chips to call');
    }

    this.player.chips -= amountToCall;
    this.player.currentBet = this.bettingRound!.currentBet;
    this.pot += amountToCall;
    this.bettingRound!.lastAction = 'CALL';
    this.player.isActive = false;
    this.opponent.isActive = true;

    if (this.opponent.hasFolded) {
      this.endBettingRound();
    }
  }

  /**
   * Player raises the bet.
   */
  playerRaise(amount: number): void {
    if (this.phase !== 'BETTING' || !this.player.isActive) {
      throw new Error('Not player\'s turn');
    }

    const isSmallBet = this.bettingRoundNumber <= 2;
    const maxBet = isSmallBet ? this.fixedLimit.smallBet : this.fixedLimit.bigBet;
    const newBet = this.bettingRound!.currentBet + amount;

    if (newBet > maxBet) {
      throw new Error(`Raise exceeds limit: ${maxBet}`);
    }

    const totalNeeded = newBet - this.player.currentBet;
    if (totalNeeded > this.player.chips) {
      throw new Error('Insufficient chips');
    }

    this.player.chips -= totalNeeded;
    this.player.currentBet = newBet;
    this.pot += totalNeeded;
    this.bettingRound!.currentBet = newBet;
    this.bettingRound!.lastAction = 'RAISE';
    this.player.isActive = false;
    this.opponent.isActive = true;
  }

  /**
   * Player folds.
   */
  playerFold(): void {
    if (this.phase !== 'BETTING' || !this.player.isActive) {
      throw new Error('Not player\'s turn');
    }

    this.player.hasFolded = true;
    this.bettingRound!.lastAction = 'FOLD';
    this.phase = 'SHOWDOWN';
    this.endGame();
  }

  /**
   * Opponent places a bet (called by AI).
   */
  opponentBet(amount: number): void {
    if (this.phase !== 'BETTING' || !this.opponent.isActive) {
      throw new Error('Not opponent\'s turn');
    }

    const isSmallBet = this.bettingRoundNumber <= 2;
    const maxBet = isSmallBet ? this.fixedLimit.smallBet : this.fixedLimit.bigBet;

    if (amount > maxBet) {
      amount = maxBet;
    }

    if (amount > this.opponent.chips) {
      amount = this.opponent.chips;
    }

    this.opponent.chips -= amount;
    this.opponent.currentBet = amount;
    this.pot += amount;
    this.bettingRound!.currentBet = amount;
    this.bettingRound!.lastAction = 'BET';
    this.opponent.isActive = false;
    this.player.isActive = true;
  }

  /**
   * Opponent checks.
   */
  opponentCheck(): void {
    if (this.phase !== 'BETTING' || !this.opponent.isActive) {
      throw new Error('Not opponent\'s turn');
    }

    if (this.bettingRound!.currentBet > 0) {
      throw new Error('Cannot check when there is a bet');
    }

    this.bettingRound!.lastAction = 'CHECK';
    this.opponent.isActive = false;
    this.player.isActive = true;
  }

  /**
   * Opponent calls.
   */
  opponentCall(): void {
    if (this.phase !== 'BETTING' || !this.opponent.isActive) {
      throw new Error('Not opponent\'s turn');
    }

    const amountToCall = this.bettingRound!.currentBet - this.opponent.currentBet;
    if (amountToCall <= 0) {
      this.opponentCheck();
      return;
    }

    if (amountToCall > this.opponent.chips) {
      // All-in
      const allInAmount = this.opponent.chips;
      this.opponent.chips = 0;
      this.opponent.currentBet += allInAmount;
      this.pot += allInAmount;
      this.bettingRound!.lastAction = 'CALL';
      this.endBettingRound();
      return;
    }

    this.opponent.chips -= amountToCall;
    this.opponent.currentBet = this.bettingRound!.currentBet;
    this.pot += amountToCall;
    this.bettingRound!.lastAction = 'CALL';
    this.opponent.isActive = false;
    this.player.isActive = true;
  }

  /**
   * Opponent raises.
   */
  opponentRaise(amount: number): void {
    if (this.phase !== 'BETTING' || !this.opponent.isActive) {
      throw new Error('Not opponent\'s turn');
    }

    const isSmallBet = this.bettingRoundNumber <= 2;
    const maxBet = isSmallBet ? this.fixedLimit.smallBet : this.fixedLimit.bigBet;
    const newBet = this.bettingRound!.currentBet + amount;

    if (newBet > maxBet) {
      this.opponentBet(maxBet);
      return;
    }

    const totalNeeded = newBet - this.opponent.currentBet;
    if (totalNeeded > this.opponent.chips) {
      // All-in
      const allInAmount = this.opponent.chips;
      this.opponent.chips = 0;
      this.opponent.currentBet += allInAmount;
      this.pot += allInAmount;
      this.bettingRound!.currentBet = this.opponent.currentBet;
      this.bettingRound!.lastAction = 'RAISE';
      this.opponent.isActive = false;
      this.player.isActive = true;
      return;
    }

    this.opponent.chips -= totalNeeded;
    this.opponent.currentBet = newBet;
    this.pot += totalNeeded;
    this.bettingRound!.currentBet = newBet;
    this.bettingRound!.lastAction = 'RAISE';
    this.opponent.isActive = false;
    this.player.isActive = true;
  }

  /**
   * Opponent folds.
   */
  opponentFold(): void {
    if (this.phase !== 'BETTING' || !this.opponent.isActive) {
      throw new Error('Not opponent\'s turn');
    }

    this.opponent.hasFolded = true;
    this.bettingRound!.lastAction = 'FOLD';
    this.phase = 'SHOWDOWN';
    this.endGame();
  }

  /**
   * Ends the current betting round.
   */
  private endBettingRound(): void {
    // Check if both players have matched bets
    if (this.player.currentBet === this.opponent.currentBet && 
        (this.bettingRound!.lastAction === 'CHECK' || this.bettingRound!.lastAction === 'CALL')) {
      // Reveal next card if applicable
      if (this.bettingRoundNumber < 5) {
        // In 5-card stud, all cards are dealt at start, so we just move to next betting round
        // or showdown if all betting rounds are complete
        if (this.bettingRoundNumber >= 4) {
          this.phase = 'SHOWDOWN';
          this.endGame();
        } else {
          this.startBettingRound();
        }
      } else {
        this.phase = 'SHOWDOWN';
        this.endGame();
      }
    }
  }

  /**
   * Ends the game and determines the winner.
   */
  private endGame(): void {
    this.phase = 'SHOWDOWN';

    // Reveal all cards
    this.player.cardsFaceUp = [true, true, true, true, true];
    this.opponent.cardsFaceUp = [true, true, true, true, true];

    if (this.player.hasFolded) {
      // Opponent wins
      this.opponent.chips += this.pot;
      this.phase = 'GAME_OVER';
      return;
    }

    if (this.opponent.hasFolded) {
      // Player wins
      this.player.chips += this.pot;
      this.phase = 'GAME_OVER';
      return;
    }

    // Compare hands
    const comparison = compareHands(this.player.hand, this.opponent.hand);
    if (comparison > 0) {
      // Player wins
      this.player.chips += this.pot;
    } else if (comparison < 0) {
      // Opponent wins
      this.opponent.chips += this.pot;
    } else {
      // Tie - split pot
      this.player.chips += Math.floor(this.pot / 2);
      this.opponent.chips += Math.ceil(this.pot / 2);
    }

    this.pot = 0;
    this.phase = 'GAME_OVER';
  }

  /**
   * Reveals a specific card for a player.
   */
  revealCard(playerId: 'player' | 'opponent', cardIndex: number): void {
    const player = playerId === 'player' ? this.player : this.opponent;
    if (cardIndex >= 0 && cardIndex < player.cardsFaceUp.length) {
      player.cardsFaceUp[cardIndex] = true;
    }
  }

  // Getters
  getPhase(): GamePhase {
    return this.phase;
  }

  getPlayer(): Player {
    return { ...this.player };
  }

  getOpponent(): Player {
    return { ...this.opponent };
  }

  getPot(): number {
    return this.pot;
  }

  getBettingRound(): BettingRound | null {
    return this.bettingRound ? { ...this.bettingRound } : null;
  }

  getFixedLimit(): { smallBet: number; bigBet: number } {
    return { ...this.fixedLimit };
  }
}

