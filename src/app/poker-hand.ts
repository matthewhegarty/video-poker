import {Card, Rank, Suit} from './deck';

export enum HandRank {
  DEFAULT,
  ROYAL_FLUSH,
  STRAIGHT_FLUSH,
  FOUR_OF_A_KIND,
  FULL_HOUSE,
  FLUSH,
  STRAIGHT,
  THREE_OF_A_KIND,
  TWO_PAIRS,
  PAIR_JACKS_OR_HIGHER,
  DEAD_MANS_HAND
}

export class PokerHand {

  static calculateRank(cards: Card[]): number {
    // Handle edge cases: empty arrays, insufficient cards, or invalid hands (duplicates)
    if (cards.length < 5 || PokerHand.hasInvalidCards(cards)) {
      return HandRank.DEFAULT;
    }

    if (PokerHand.isStraight(cards) && PokerHand.isFlush(cards) && PokerHand.containsRank(cards, Rank.ACE)) {
      return HandRank.ROYAL_FLUSH;
    }
    if (PokerHand.isStraight(cards) && PokerHand.isFlush(cards)) {
      return HandRank.STRAIGHT_FLUSH;
    }
    if (PokerHand.isFourOfAKind(cards)) {
      return HandRank.FOUR_OF_A_KIND;
    }
    if (PokerHand.isFullHouse(cards)) {
      return HandRank.FULL_HOUSE;
    }
    if (PokerHand.isFlush(cards)) {
      return HandRank.FLUSH;
    }
    if (PokerHand.isStraight(cards)) {
      return HandRank.STRAIGHT;
    }
    if (PokerHand.isThreeOfAKind(cards)) {
      return HandRank.THREE_OF_A_KIND;
    }
    if (PokerHand.isTwoPairs(cards)) {
      if (PokerHand.isDeadMansHand(cards)) {
        return HandRank.DEAD_MANS_HAND;
      }
      return HandRank.TWO_PAIRS;
    }
    if (PokerHand.isPairJacksOrHigher(cards)) {
      return HandRank.PAIR_JACKS_OR_HIGHER;
    }
    return 0;
  }

  static isFourOfAKind(cards: Card[]): boolean {
    const counts = PokerHand.counts(cards);
    return PokerHand.hasValue(counts, 4);
  }

  static isFullHouse(cards: Card[]): boolean {
    const counts = PokerHand.counts(cards);
    return PokerHand.hasValue(counts, 3) && PokerHand.hasValue(counts, 2);
  }

  static isStraight(cards: Card[]): boolean {
    if (cards.length < 5) return false;
    const ranks = cards.map(c => c.rank);
    ranks.sort((a, b) =>  a - b);
    return ranks.every((num, i) => i === 0 || ranks[i - 1] === num - 1) || PokerHand.isLowAceStraight(ranks);
  }

  static isLowAceStraight(ranks: Rank[]): boolean {
    return ranks[0] === Rank.DEUCE &&
      ranks[1] === Rank.THREE &&
      ranks[2] === Rank.FOUR &&
      ranks[3] === Rank.FIVE &&
      ranks[4] === Rank.ACE;
  }

  static isFlush(cards: Card[]): boolean {
    return cards.every(
      (value: Card, _, cardArray: Card[]) => {
        return cardArray[0].suit === value.suit;
    });
  }

  static isThreeOfAKind(cards: Card[]): boolean {
    const counts = PokerHand.counts(cards);
    return PokerHand.hasValue(counts, 3) && PokerHand.hasValue(counts, 1);
  }

  static isTwoPairs(cards: Card[]): boolean {
    const counts = PokerHand.counts(cards);
    return PokerHand.hasValue(counts, 2) && PokerHand.uniq(cards) === 3;
  }

  static isPairJacksOrHigher(cards: Card[]): boolean {
    const counts = PokerHand.counts(cards);
    let rank = 0;
    for (const key in counts) {
      if (counts[key] === 2) {
        rank = parseInt(key, 10);
      }
    }
    return PokerHand.isPair(cards) && rank >= Rank.JACK;
  }

  static isPair(cards: Card[]): boolean {
    const counts = PokerHand.counts(cards);
    return PokerHand.hasValue(counts, 2) && PokerHand.uniq(cards) === 4;
  }

  static isDeadMansHand(cards: Card[]): boolean {
    return this.containsCard(cards, new Card(Rank.ACE, Suit.CLUBS)) &&
      this.containsCard(cards, new Card(Rank.ACE, Suit.SPADES)) &&
      this.containsCard(cards, new Card(Rank.EIGHT, Suit.CLUBS)) &&
      this.containsCard(cards, new Card(Rank.EIGHT, Suit.SPADES));
  }

  static containsRank(cards: Card[], rank: Rank): boolean {
    return cards.filter(c => c.rank === rank).length === 1;
  }

  static containsCard(cards: Card[], card: Card): boolean {
    return cards.filter(c => c.rank === card.rank && c.suit === card.suit).length === 1;
  }

  static uniq(cards: Card[]): number {
    const ranks = cards.map(c => c.rank);
    return new Set(ranks).size;
  }

  static counts(cards: Card[]): any {
    const ranks = cards.map(c => c.rank);
    const counts: { [key: string]: number } = {};
    ranks.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
    return counts;
  }

  static hasValue(obj: any, value: number): boolean {
    return Object.keys(obj).some( k => obj[k] === value);
  }

  static hasInvalidCards(cards: Card[]): boolean {
    // Check for duplicate cards (invalid poker hand)
    const cardStrings = cards.map(c => `${c.rank}-${c.suit}`);
    return cardStrings.length !== new Set(cardStrings).size;
  }
}
