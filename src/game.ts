import {Card, Deck} from './app/deck';
import {HandRank, PokerHand} from './app/poker-hand';

export class Game {

  hand!: Card[];
  deck!: Deck;
  rank!: HandRank;

  balance = 0;
  stake = 0;

  constructor() {
    this.resetDeck();
  }

  resetDeck(): void {
    this.deck = new Deck();
  }

  shuffleDeck(): void {
    this.deck.shuffle();
  }

  /**
   * Updates the balance by subtracting the current stake.
   * @returns {number} The amount staked.
   */
  updateBalance(): void {
    if (this.balance >= this.stake) {
      this.balance -= this.stake;
    }
  }

  deal(): void {
    this.hand = this.deck.take(5);
  }

  draw(indices: number[]): void {
    indices.forEach(i => {
      this.hand[i] = this.deck.take(1)[0];
    });
  }

  calculateRank(): void {
    this.rank = PokerHand.calculateRank(this.hand);
    const payout = this.getPayout(this.rank) * this.stake;
    if (payout > 0) {
      this.balance += payout;
    }
  }

  hasSufficientFunds(): boolean {
    return this.balance > 0 && this.balance >= this.stake;
  }

  /**
   * https://www.gamblingsites.com/online-casino/video-poker/pay-tables/
   */
  getPayout(rank: HandRank): number {
    switch (rank) {
      case HandRank.ROYAL_FLUSH:
        return this.stake === 5 ? 4000 : 250;
      case HandRank.STRAIGHT_FLUSH:
        return 50;
      case HandRank.FOUR_OF_A_KIND:
        return 25;
      case HandRank.FULL_HOUSE:
        return 9;
      case HandRank.FLUSH:
        return 6;
      case HandRank.STRAIGHT:
        return 4;
      case HandRank.THREE_OF_A_KIND:
        return 3;
      case HandRank.TWO_PAIRS:
        return 2;
      case HandRank.PAIR_JACKS_OR_HIGHER:
        return 1;
      default:
        return 0;
    }
  }
}
