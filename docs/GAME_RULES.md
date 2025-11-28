# Game Rules

This document outlines the specific rules of the 5-Card Draw Poker variant implemented in this application.

## Game Objective

The goal is to win chips from the opponent by having the best 5-card poker hand at the showdown or by forcing the opponent to fold. The match continues until one player reaches a score of 100 points (based on chips won).

## Game Flow

The game follows a standard 5-Card Draw structure with fixed-limit betting.

1.  **Dealing**:
    *   Each player is dealt 5 cards.
    *   The player sees their own cards face up.
    *   The opponent's cards are face down (hidden).

2.  **Betting Round 1**:
    *   Players can Bet, Check, Call, Raise, or Fold.
    *   Betting is **Fixed Limit**:
        *   Small Bet: $2
    *   Maximum of 4 raises per round is typically allowed (capped).

3.  **Drawing Phase**:
    *   Active players may discard up to 3 cards (or more depending on specific house rules variants, here typically up to 3).
    *   New cards are drawn from the deck to replace discards.

4.  **Betting Round 2**:
    *   Another round of betting occurs.
    *   **Fixed Limit**:
        *   Big Bet: $4 (double the small bet).

5.  **Showdown**:
    *   If more than one player remains, hands are revealed.
    *   The player with the highest-ranking hand wins the pot.
    *   If hands are identical, the pot is split.

## Hand Rankings

Hands are ranked in standard poker order (highest to lowest):

1.  **Royal Flush**: A, K, Q, J, 10, all the same suit.
2.  **Straight Flush**: Five cards in a sequence, all in the same suit.
3.  **Four of a Kind**: All four cards of the same rank.
4.  **Full House**: Three of a kind with a pair.
5.  **Flush**: Any five cards of the same suit, but not in a sequence.
6.  **Straight**: Five cards in a sequence, but not of the same suit.
7.  **Three of a Kind**: Three cards of the same rank.
8.  **Two Pair**: Two different pairs.
9.  **Pair**: Two cards of the same rank.
10. **High Card**: When you haven't made any of the hands above, the highest card plays.

## Scoring

*   **Chips**: Used for betting within a single hand.
*   **Match Score**: The total accumulation of winnings. The first player to reach **100 points** wins the match.

## Betting Limits

The game uses a **Fixed Limit** structure:
*   **Small Bet ($2)**: Used in the first betting round.
*   **Big Bet ($4)**: Used in the second betting round (after the draw).

This structure limits the amount a player can bet or raise in a single action, emphasizing strategy over aggression.

