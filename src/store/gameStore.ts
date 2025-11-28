import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { compareHands, evaluateHand } from '@/lib/poker/handEvaluator';
import { createDeck, shuffleDeck } from '@/lib/utils/cardUtils';
import {
  Card,
  GamePhase,
  Player,
  BettingRound,
} from '@/types';

interface GameHistory {
  date: string;
  result: 'win' | 'loss';
  playerScore: number;
  opponentScore: number;
}

interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

interface GameStore {
  // Match state (first to 100)
  matchPlayerScore: number;
  matchOpponentScore: number;
  matchWinner: 'player' | 'opponent' | null;
  targetScore: number;
  
  // Game state
  showIntro: boolean;
  phase: GamePhase;
  deck: Card[];
  player: Player | null;
  opponent: Player | null;
  pot: number;
  bettingRound: BettingRound | null;
  fixedLimit: { smallBet: number; bigBet: number };
  winner: 'player' | 'opponent' | 'tie' | null;
  selectedCards: number[];
  message: string;
  
  // Settings & History
  settings: Settings;
  gameHistory: GameHistory[];
  
  // Actions
  showIntroScreen: () => void;
  startNewMatch: () => void;
  startHand: () => void;
  playerBet: (amount: number) => void;
  playerCheck: () => void;
  playerCall: () => void;
  playerRaise: (amount: number) => void;
  playerFold: () => void;
  toggleCardSelection: (cardIndex: number) => void;
  playerDraw: () => void;
  opponentAction: () => void;
  opponentDraw: () => void;
  continueToNextHand: () => void;
  updateSettings: (settings: Settings) => void;
  resetMatch: () => void;
}

const INITIAL_CHIPS = 100;
const SMALL_BET = 2;
const BIG_BET = 4;
const TARGET_SCORE = 100;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Match state
      matchPlayerScore: 0,
      matchOpponentScore: 0,
      matchWinner: null,
      targetScore: TARGET_SCORE,
      
      // Game state
      showIntro: true,
      phase: 'IDLE',
      deck: [],
      player: null,
      opponent: null,
      pot: 0,
      bettingRound: null,
      fixedLimit: { smallBet: SMALL_BET, bigBet: BIG_BET },
      winner: null,
      selectedCards: [],
      message: '',
      
      // Settings & History
      settings: {
        soundEnabled: true,
        musicEnabled: false,
        animationSpeed: 'normal',
      },
      gameHistory: [],

      showIntroScreen: () => {
        set({ showIntro: true });
      },

      startNewMatch: () => {
        set({
          matchPlayerScore: 0,
          matchOpponentScore: 0,
          matchWinner: null,
          showIntro: false,
        });
        get().startHand();
      },

      startHand: () => {
        const { matchPlayerScore, matchOpponentScore } = get();
        
        // Create players
        const player: Player = {
          id: 'player',
          name: 'You',
          chips: INITIAL_CHIPS,
          hand: [],
          cardsFaceUp: [true, true, true, true, true],
          isActive: false,
          hasFolded: false,
          currentBet: 0,
        };

        const opponent: Player = {
          id: 'opponent',
          name: 'Opponent',
          chips: INITIAL_CHIPS,
          hand: [],
          cardsFaceUp: [false, false, false, false, false],
          isActive: false,
          hasFolded: false,
          currentBet: 0,
        };

        // Create and shuffle deck
        let deck = shuffleDeck(createDeck());

        // Deal 5 cards to each player
        const playerHand = deck.splice(0, 5);
        const opponentHand = deck.splice(0, 5);

        // Ante up
        const ante = SMALL_BET;
        player.chips -= ante;
        opponent.chips -= ante;
        const pot = ante * 2;

        player.hand = playerHand;
        opponent.hand = opponentHand;
        player.isActive = true;

        set({
          showIntro: false,
          phase: 'BETTING',
          deck,
          player,
          opponent,
          pot,
          bettingRound: {
            round: 1,
            currentBet: 0,
            pot: pot,
            activePlayer: 'player',
            lastAction: null,
          },
          winner: null,
          selectedCards: [],
          message: '',
        });
      },

      playerBet: (amount: number) => {
        const { player, opponent, pot, bettingRound } = get();
        if (!player || !opponent || !bettingRound) return;

        const newPlayerChips = player.chips - amount;
        const newPot = pot + amount;

        set({
          player: { ...player, chips: newPlayerChips, currentBet: amount, isActive: false },
          opponent: { ...opponent, isActive: true },
          pot: newPot,
          bettingRound: { ...bettingRound, currentBet: amount, pot: newPot, activePlayer: 'opponent', lastAction: 'BET' },
        });

        setTimeout(() => get().opponentAction(), 1000);
      },

      playerCheck: () => {
        const { player, opponent, bettingRound } = get();
        if (!player || !opponent || !bettingRound) return;

        if (bettingRound.lastAction === 'CHECK') {
          set({
            phase: 'DRAWING',
            player: { ...player, isActive: true },
            opponent: { ...opponent, isActive: false },
            bettingRound: { ...bettingRound, lastAction: 'CHECK' },
            message: 'Select cards to discard, then click Draw',
          });
        } else {
          set({
            player: { ...player, isActive: false },
            opponent: { ...opponent, isActive: true },
            bettingRound: { ...bettingRound, activePlayer: 'opponent', lastAction: 'CHECK' },
          });
          setTimeout(() => get().opponentAction(), 1000);
        }
      },

      playerCall: () => {
        const { player, opponent, pot, bettingRound } = get();
        if (!player || !opponent || !bettingRound) return;

        const amountToCall = bettingRound.currentBet - player.currentBet;
        const newPlayerChips = player.chips - amountToCall;
        const newPot = pot + amountToCall;

        set({
          phase: 'DRAWING',
          player: { ...player, chips: newPlayerChips, currentBet: bettingRound.currentBet, isActive: true },
          opponent: { ...opponent, isActive: false },
          pot: newPot,
          bettingRound: { ...bettingRound, pot: newPot, lastAction: 'CALL' },
          message: 'Select cards to discard, then click Draw',
        });
      },

      playerRaise: (amount: number) => {
        const { player, opponent, pot, bettingRound } = get();
        if (!player || !opponent || !bettingRound) return;

        const totalBet = bettingRound.currentBet + amount;
        const amountToAdd = totalBet - player.currentBet;
        const newPlayerChips = player.chips - amountToAdd;
        const newPot = pot + amountToAdd;

        set({
          player: { ...player, chips: newPlayerChips, currentBet: totalBet, isActive: false },
          opponent: { ...opponent, isActive: true },
          pot: newPot,
          bettingRound: { ...bettingRound, currentBet: totalBet, pot: newPot, activePlayer: 'opponent', lastAction: 'RAISE' },
        });

        setTimeout(() => get().opponentAction(), 1000);
      },

      playerFold: () => {
        const { player, opponent, pot, matchOpponentScore } = get();
        if (!player || !opponent) return;

        const winnings = pot;
        const newOpponentScore = matchOpponentScore + winnings;
        const matchWinner = newOpponentScore >= TARGET_SCORE ? 'opponent' : null;

        set({
          phase: 'GAME_OVER',
          player: { ...player, hasFolded: true },
          opponent: { ...opponent, chips: opponent.chips + pot, cardsFaceUp: [true, true, true, true, true] },
          pot: 0,
          winner: 'opponent',
          matchOpponentScore: newOpponentScore,
          matchWinner,
          message: matchWinner ? 'Opponent wins the match!' : `Opponent wins $${winnings}!`,
        });
      },

      toggleCardSelection: (cardIndex: number) => {
        const { selectedCards, phase } = get();
        if (phase !== 'DRAWING') return;

        if (selectedCards.includes(cardIndex)) {
          set({ selectedCards: selectedCards.filter(i => i !== cardIndex) });
        } else {
          set({ selectedCards: [...selectedCards, cardIndex] });
        }
      },

      playerDraw: () => {
        const { player, deck, selectedCards } = get();
        if (!player) return;

        const newHand = [...player.hand];
        const newDeck = [...deck];

        selectedCards.forEach(index => {
          if (newDeck.length > 0) {
            newHand[index] = newDeck.shift()!;
          }
        });

        set({
          player: { ...player, hand: newHand },
          deck: newDeck,
          selectedCards: [],
          message: `Drew ${selectedCards.length} card${selectedCards.length !== 1 ? 's' : ''}. Waiting for opponent...`,
        });

        setTimeout(() => get().opponentDraw(), 1000);
      },

      opponentDraw: () => {
        const { opponent, deck, player, pot, fixedLimit } = get();
        if (!opponent || !player) return;

        const evaluation = evaluateHand(opponent.hand);
        const newHand = [...opponent.hand];
        const newDeck = [...deck];
        
        const cardsToDiscard: number[] = [];
        const rankCounts = new Map<string, number>();
        
        opponent.hand.forEach(card => {
          rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
        });

        opponent.hand.forEach((card, index) => {
          const count = rankCounts.get(card.rank) || 0;
          const isHighCard = ['ace', 'king', 'queen', 'jack'].includes(card.rank);
          
          if (count < 2 && !isHighCard && cardsToDiscard.length < 3) {
            cardsToDiscard.push(index);
          }
        });

        cardsToDiscard.forEach(index => {
          if (newDeck.length > 0) {
            newHand[index] = newDeck.shift()!;
          }
        });

        set({
          phase: 'BETTING',
          opponent: { ...opponent, hand: newHand, isActive: false },
          player: { ...player, isActive: true, currentBet: 0 },
          deck: newDeck,
          bettingRound: {
            round: 2,
            currentBet: 0,
            pot: pot,
            activePlayer: 'player',
            lastAction: null,
          },
          message: `Opponent drew ${cardsToDiscard.length} card${cardsToDiscard.length !== 1 ? 's' : ''}`,
        });
      },

      opponentAction: () => {
        const { opponent, player, pot, bettingRound, fixedLimit, matchPlayerScore, matchOpponentScore } = get();
        if (!opponent || !player || !bettingRound) return;

        const evaluation = evaluateHand(opponent.hand);
        const handStrength = evaluation.value / 10000;
        const currentBet = bettingRound.currentBet;
        const amountToCall = currentBet - opponent.currentBet;
        const isSecondRound = bettingRound.round === 2;
        const maxBet = isSecondRound ? fixedLimit.bigBet : fixedLimit.smallBet;

        let action: 'CHECK' | 'BET' | 'CALL' | 'FOLD' = 'CHECK';

        if (currentBet === 0) {
          if (handStrength > 0.5 || Math.random() < 0.3) {
            action = 'BET';
          } else {
            action = 'CHECK';
          }
        } else {
          if (handStrength > 0.6) {
            action = 'CALL';
          } else if (handStrength > 0.3) {
            action = Math.random() < 0.5 ? 'CALL' : 'FOLD';
          } else {
            action = 'FOLD';
          }
        }

        const determineWinner = (newPot: number, newOpponentChips: number) => {
          const comparison = compareHands(player.hand, opponent.hand);
          let winner: 'player' | 'opponent' | 'tie' = 'tie';
          let newPlayerScore = matchPlayerScore;
          let newOpponentScore = matchOpponentScore;
          let message = '';

          if (comparison > 0) {
            winner = 'player';
            newPlayerScore += newPot;
            message = `You win $${newPot}!`;
          } else if (comparison < 0) {
            winner = 'opponent';
            newOpponentScore += newPot;
            message = `Opponent wins $${newPot}!`;
          } else {
            const half = Math.floor(newPot / 2);
            newPlayerScore += half;
            newOpponentScore += half;
            message = `Tie! Split pot $${half} each`;
          }

          const matchWinner = newPlayerScore >= TARGET_SCORE ? 'player' : 
                            newOpponentScore >= TARGET_SCORE ? 'opponent' : null;

          if (matchWinner) {
            message = matchWinner === 'player' ? 'You win the match!' : 'Opponent wins the match!';
          }

          set({
            phase: 'GAME_OVER',
            player: winner === 'player' ? { ...player, chips: player.chips + newPot } : { ...player },
            opponent: { 
              ...opponent, 
              chips: winner === 'opponent' ? newOpponentChips + newPot : newOpponentChips,
              cardsFaceUp: [true, true, true, true, true] 
            },
            pot: 0,
            winner,
            matchPlayerScore: newPlayerScore,
            matchOpponentScore: newOpponentScore,
            matchWinner,
            message,
          });
        };

        switch (action) {
          case 'CHECK':
            if (bettingRound.lastAction === 'CHECK') {
              if (isSecondRound) {
                determineWinner(pot, opponent.chips);
              } else {
                set({
                  phase: 'DRAWING',
                  player: { ...player, isActive: true },
                  opponent: { ...opponent, isActive: false },
                  message: 'Select cards to discard, then click Draw',
                });
              }
            } else {
              set({
                player: { ...player, isActive: true },
                opponent: { ...opponent, isActive: false },
                bettingRound: { ...bettingRound, activePlayer: 'player', lastAction: 'CHECK' },
              });
            }
            break;

          case 'BET':
            const betAmount = Math.min(maxBet, opponent.chips);
            set({
              opponent: { ...opponent, chips: opponent.chips - betAmount, currentBet: betAmount, isActive: false },
              player: { ...player, isActive: true },
              pot: pot + betAmount,
              bettingRound: { ...bettingRound, currentBet: betAmount, pot: pot + betAmount, activePlayer: 'player', lastAction: 'BET' },
            });
            break;

          case 'CALL':
            const callAmount = amountToCall;
            const newOpponentChips = opponent.chips - callAmount;
            const newPot = pot + callAmount;
            
            if (isSecondRound) {
              determineWinner(newPot, newOpponentChips);
            } else {
              set({
                phase: 'DRAWING',
                opponent: { ...opponent, chips: newOpponentChips, currentBet: bettingRound.currentBet },
                player: { ...player, isActive: true },
                pot: newPot,
                message: 'Select cards to discard, then click Draw',
              });
            }
            break;

          case 'FOLD':
            const winnings = pot;
            const newPlayerScore = matchPlayerScore + winnings;
            const matchWinnerFold = newPlayerScore >= TARGET_SCORE ? 'player' : null;
            
            set({
              phase: 'GAME_OVER',
              opponent: { ...opponent, hasFolded: true },
              player: { ...player, chips: player.chips + pot },
              pot: 0,
              winner: 'player',
              matchPlayerScore: newPlayerScore,
              matchWinner: matchWinnerFold,
              message: matchWinnerFold ? 'You win the match!' : `You win $${winnings}!`,
            });
            break;
        }
      },

      continueToNextHand: () => {
        const { matchWinner, matchPlayerScore, matchOpponentScore, gameHistory } = get();
        if (matchWinner) {
          // Save to history
          const newHistory = [
            {
              date: new Date().toLocaleDateString(),
              result: matchWinner === 'player' ? 'win' : 'loss',
              playerScore: matchPlayerScore,
              opponentScore: matchOpponentScore,
            } as const,
            ...gameHistory.slice(0, 49), // Keep last 50 games
          ];
          set({ 
            showIntro: true,
            matchPlayerScore: 0,
            matchOpponentScore: 0,
            matchWinner: null,
            gameHistory: newHistory,
          });
        } else {
          get().startHand();
        }
      },

      updateSettings: (settings) => {
        set({ settings });
      },

      resetMatch: () => {
        set({
          matchPlayerScore: 0,
          matchOpponentScore: 0,
          matchWinner: null,
          showIntro: true,
        });
      },
    }),
    {
      name: 'poker-game-storage',
      partialize: (state) => ({
        matchPlayerScore: state.matchPlayerScore,
        matchOpponentScore: state.matchOpponentScore,
        settings: state.settings,
        gameHistory: state.gameHistory,
      }),
    }
  )
);
