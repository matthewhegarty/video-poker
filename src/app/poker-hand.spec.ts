import {Card, Rank, Suit} from './deck';
import {HandRank, PokerHand} from './poker-hand';

describe('Hand calculations', () => {

  it('isStraight should return true for a straight with mixed suits', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.CLUBS),
      new Card(Rank.FOUR, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
      new Card(Rank.SIX, Suit.SPADES),
    ];
    expect(PokerHand.isStraight(cards)).toEqual(true);
  });

  it('isStraight should return false for non consecutive cards', () => {
    const cards = [
      new Card(Rank.ACE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.CLUBS),
      new Card(Rank.FOUR, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
      new Card(Rank.SIX, Suit.SPADES),
    ];
    expect(PokerHand.isStraight(cards)).toEqual(false);
  });

  it('isFlush should return true for a straight with same suits', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.FOUR, Suit.HEARTS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.SIX, Suit.HEARTS),
    ];
    expect(PokerHand.isFlush(cards)).toEqual(true);
  });

  it('isFlush should return false for a straight with different suits', () => {
    const cards = [
      new Card(Rank.SIX, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.FOUR, Suit.HEARTS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.DEUCE, Suit.CLUBS),
    ];
    expect(PokerHand.isFlush(cards)).toEqual(false);
  });

  it('containsRank should return true if a card of given rank is present', () => {
    const cards = [
      new Card(Rank.ACE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.FOUR, Suit.HEARTS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.SIX, Suit.CLUBS),
    ];
    expect(PokerHand.containsRank(cards, Rank.ACE)).toEqual(true);
  });

  it('containsRank should return false if a card of given rank is not present', () => {
    const cards = [
      new Card(Rank.ACE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.FOUR, Suit.HEARTS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.SIX, Suit.CLUBS),
    ];
    expect(PokerHand.containsRank(cards, Rank.TEN)).toEqual(false);
  });

  it('counts should return 4 and 1 for four-of-a-kind', () => {
    const cards = [
      new Card(Rank.ACE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.DIAMONDS),
      new Card(Rank.THREE, Suit.SPADES),
      new Card(Rank.THREE, Suit.CLUBS),
    ];
    expect(PokerHand.counts(cards)).toEqual({3: 4, 14: 1});
  });

  it('counts should return 2, 2 and 1 for two pairs', () => {
    const cards = [
      new Card(Rank.ACE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.DIAMONDS),
      new Card(Rank.FOUR, Suit.SPADES),
      new Card(Rank.FOUR, Suit.CLUBS),
    ];
    expect(PokerHand.counts(cards)).toEqual({3: 2, 4: 2, 14: 1});
  });

  it('uniq should return 3 for two pairs', () => {
    const cards = [
      new Card(Rank.ACE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.DIAMONDS),
      new Card(Rank.FOUR, Suit.SPADES),
      new Card(Rank.FOUR, Suit.CLUBS),
    ];
    expect(PokerHand.uniq(cards)).toEqual(3);
  });

  it('uniq should return 4 for one pair', () => {
    const cards = [
      new Card(Rank.ACE, Suit.HEARTS),
      new Card(Rank.ACE, Suit.CLUBS),
      new Card(Rank.THREE, Suit.DIAMONDS),
      new Card(Rank.JACK, Suit.SPADES),
      new Card(Rank.FOUR, Suit.CLUBS),
    ];
    expect(PokerHand.uniq(cards)).toEqual(4);
  });
});

describe('Calculate Rank Tests', () => {

  it('should return ROYAL_FLUSH', () => {
    const cards = [
      new Card(Rank.ACE, Suit.HEARTS),
      new Card(Rank.KING, Suit.HEARTS),
      new Card(Rank.QUEEN, Suit.HEARTS),
      new Card(Rank.JACK, Suit.HEARTS),
      new Card(Rank.TEN, Suit.HEARTS),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.ROYAL_FLUSH);
  });

  it('should return STRAIGHT_FLUSH', () => {
    const cards = [
      new Card(Rank.NINE, Suit.DIAMONDS),
      new Card(Rank.KING, Suit.DIAMONDS),
      new Card(Rank.QUEEN, Suit.DIAMONDS),
      new Card(Rank.JACK, Suit.DIAMONDS),
      new Card(Rank.TEN, Suit.DIAMONDS),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.STRAIGHT_FLUSH);
  });

  it('should return FOUR_OF_A_KIND', () => {
    const cards = [
      new Card(Rank.NINE, Suit.DIAMONDS),
      new Card(Rank.NINE, Suit.HEARTS),
      new Card(Rank.NINE, Suit.SPADES),
      new Card(Rank.NINE, Suit.CLUBS),
      new Card(Rank.TEN, Suit.DIAMONDS),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.FOUR_OF_A_KIND);
  });

  it('should return FULL_HOUSE', () => {
    const cards = [
      new Card(Rank.NINE, Suit.DIAMONDS),
      new Card(Rank.NINE, Suit.HEARTS),
      new Card(Rank.NINE, Suit.SPADES),
      new Card(Rank.TEN, Suit.CLUBS),
      new Card(Rank.TEN, Suit.DIAMONDS),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.FULL_HOUSE);
  });

  it('should return FLUSH', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.DIAMONDS),
      new Card(Rank.THREE, Suit.DIAMONDS),
      new Card(Rank.NINE, Suit.DIAMONDS),
      new Card(Rank.TEN, Suit.DIAMONDS),
      new Card(Rank.KING, Suit.DIAMONDS),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.FLUSH);
  });

  it('should return STRAIGHT', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.DIAMONDS),
      new Card(Rank.SIX, Suit.CLUBS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.FOUR, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.STRAIGHT);
  });

  it('should return STRAIGHT for low ace', () => {
    const cards = [
      new Card(Rank.ACE, Suit.DIAMONDS),
      new Card(Rank.DEUCE, Suit.CLUBS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.FOUR, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.STRAIGHT);
  });

  it('should return STRAIGHT for high ace', () => {
    const cards = [
      new Card(Rank.ACE, Suit.DIAMONDS),
      new Card(Rank.KING, Suit.CLUBS),
      new Card(Rank.QUEEN, Suit.HEARTS),
      new Card(Rank.JACK, Suit.DIAMONDS),
      new Card(Rank.TEN, Suit.SPADES),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.STRAIGHT);
  });

  it('should return THREE OF A KIND', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.DIAMONDS),
      new Card(Rank.SIX, Suit.CLUBS),
      new Card(Rank.SIX, Suit.HEARTS),
      new Card(Rank.SIX, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.THREE_OF_A_KIND);
  });

  it('should return TWO PAIRS', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.DIAMONDS),
      new Card(Rank.SIX, Suit.CLUBS),
      new Card(Rank.SIX, Suit.HEARTS),
      new Card(Rank.FIVE, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.TWO_PAIRS);
  });

  it('should return PAIR JACKS OR HIGHER for pair of jacks', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.DIAMONDS),
      new Card(Rank.JACK, Suit.CLUBS),
      new Card(Rank.JACK, Suit.HEARTS),
      new Card(Rank.KING, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.PAIR_JACKS_OR_HIGHER);
  });

  it('should return PAIR JACKS OR HIGHER for pair of kings', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.DIAMONDS),
      new Card(Rank.EIGHT, Suit.CLUBS),
      new Card(Rank.KING, Suit.HEARTS),
      new Card(Rank.KING, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.PAIR_JACKS_OR_HIGHER);
  });

  it('should return default for a low pair', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.DIAMONDS),
      new Card(Rank.TEN, Suit.CLUBS),
      new Card(Rank.TEN, Suit.HEARTS),
      new Card(Rank.KING, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEFAULT);
  });

  it('should return dead mans hand', () => {
    const cards = [
      new Card(Rank.ACE, Suit.SPADES),
      new Card(Rank.ACE, Suit.CLUBS),
      new Card(Rank.EIGHT, Suit.SPADES),
      new Card(Rank.EIGHT, Suit.CLUBS),
      new Card(Rank.QUEEN, Suit.HEARTS),  // could be anything
    ];
    expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEAD_MANS_HAND);
  });

  it('should return true for a low ace straight', () => {
    const cards = [
      new Card(Rank.ACE, Suit.DIAMONDS),
      new Card(Rank.THREE, Suit.CLUBS),
      new Card(Rank.DEUCE, Suit.HEARTS),
      new Card(Rank.FOUR, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
    ];
    expect(PokerHand.isStraight(cards)).toEqual(true);
  });

  describe('test for presence of card', () => {
    it('should return false when card not present', () => {
      const cards = [
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.containsCard(cards, new Card(Rank.QUEEN, Suit.SPADES))).toBeFalsy();
    });

    it('should return true when card present', () => {
      const cards = [
        new Card(Rank.QUEEN, Suit.SPADES),
      ];
      expect(PokerHand.containsCard(cards, new Card(Rank.QUEEN, Suit.SPADES))).toBeTruthy();
    });
  });

  describe('Advanced Edge Cases', () => {

    it('should handle empty array gracefully', () => {
      const cards: Card[] = [];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEFAULT);
      expect(PokerHand.isFlush(cards)).toBe(true);
      expect(PokerHand.isStraight(cards)).toBe(false);
      expect(PokerHand.uniq(cards)).toBe(0);
      expect(PokerHand.counts(cards)).toEqual({});
    });

    it('should handle single card array', () => {
      const cards = [new Card(Rank.ACE, Suit.HEARTS)];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEFAULT);
      expect(PokerHand.isFlush(cards)).toBe(true);
      expect(PokerHand.isStraight(cards)).toBe(false);
      expect(PokerHand.uniq(cards)).toBe(1);
      expect(PokerHand.counts(cards)).toEqual({14: 1});
    });

    it('should handle duplicate cards gracefully', () => {
      const cards = [
        new Card(Rank.ACE, Suit.HEARTS),
        new Card(Rank.ACE, Suit.HEARTS),
        new Card(Rank.ACE, Suit.HEARTS),
        new Card(Rank.ACE, Suit.HEARTS),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEFAULT);
      expect(PokerHand.isFlush(cards)).toBe(true);
      expect(PokerHand.uniq(cards)).toBe(1);
      expect(PokerHand.counts(cards)).toEqual({14: 5});
    });

    it('should handle six card array (invalid poker hand)', () => {
      const cards = [
        new Card(Rank.ACE, Suit.HEARTS),
        new Card(Rank.KING, Suit.HEARTS),
        new Card(Rank.QUEEN, Suit.HEARTS),
        new Card(Rank.JACK, Suit.HEARTS),
        new Card(Rank.TEN, Suit.HEARTS),
        new Card(Rank.NINE, Suit.HEARTS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.ROYAL_FLUSH);
      expect(PokerHand.isFlush(cards)).toBe(true);
      expect(PokerHand.isStraight(cards)).toBe(true);
    });
  });

  describe('Helper Method Edge Cases', () => {

    it('should handle isFourOfAKind edge cases', () => {
      const validFourOfKind = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.DEUCE, Suit.DIAMONDS),
        new Card(Rank.DEUCE, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.isFourOfAKind(validFourOfKind)).toBe(true);

      const invalidFourOfKind = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.DEUCE, Suit.DIAMONDS),
        new Card(Rank.THREE, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.isFourOfAKind(invalidFourOfKind)).toBe(false);
    });

    it('should handle isFullHouse edge cases', () => {
      const validFullHouse = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.DEUCE, Suit.DIAMONDS),
        new Card(Rank.ACE, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.isFullHouse(validFullHouse)).toBe(true);

      const invalidFullHouse = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.THREE, Suit.DIAMONDS),
        new Card(Rank.ACE, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.isFullHouse(invalidFullHouse)).toBe(false);
    });

    it('should handle isThreeOfAKind edge cases', () => {
      const validThreeOfKind = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.DEUCE, Suit.DIAMONDS),
        new Card(Rank.FIVE, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.isThreeOfAKind(validThreeOfKind)).toBe(true);

      const invalidThreeOfKind = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.THREE, Suit.DIAMONDS),
        new Card(Rank.FIVE, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.isThreeOfAKind(invalidThreeOfKind)).toBe(false);
    });

    it('should handle isPair edge cases', () => {
      const validPair = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.THREE, Suit.DIAMONDS),
        new Card(Rank.FIVE, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.isPair(validPair)).toBe(true);

      const invalidPair = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.THREE, Suit.CLUBS),
        new Card(Rank.FOUR, Suit.DIAMONDS),
        new Card(Rank.FIVE, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.isPair(invalidPair)).toBe(false);
    });

    it('should handle containsRank edge cases', () => {
      const cards = [
        new Card(Rank.ACE, Suit.HEARTS),
        new Card(Rank.ACE, Suit.CLUBS),
        new Card(Rank.KING, Suit.DIAMONDS),
      ];

      expect(PokerHand.containsRank(cards, Rank.ACE)).toBe(false);
      expect(PokerHand.containsRank(cards, Rank.KING)).toBe(true);

      const singleAceCards = [new Card(Rank.ACE, Suit.HEARTS)];
      expect(PokerHand.containsRank(singleAceCards, Rank.ACE)).toBe(true);
    });

    it('should handle hasValue edge cases', () => {
      const counts = {2: 2, 5: 1, 14: 2};

      expect(PokerHand.hasValue(counts, 2)).toBe(true);
      expect(PokerHand.hasValue(counts, 1)).toBe(true);
      expect(PokerHand.hasValue(counts, 3)).toBe(false);
      expect(PokerHand.hasValue({}, 1)).toBe(false);
    });

    it('should handle isLowAceStraight edge cases', () => {
      expect(PokerHand.isLowAceStraight([2, 3, 4, 5, 14])).toBe(true);
      expect(PokerHand.isLowAceStraight([2, 3, 4, 5, 13])).toBe(false);
      expect(PokerHand.isLowAceStraight([3, 4, 5, 6, 14])).toBe(false);
      expect(PokerHand.isLowAceStraight([1 as Rank, 2 as Rank, 3 as Rank, 4 as Rank, 5 as Rank])).toBe(false);
    });
  });

  describe('Straight Edge Cases', () => {

    it('should detect broadway straight (10-J-Q-K-A)', () => {
      const cards = [
        new Card(Rank.TEN, Suit.HEARTS),
        new Card(Rank.JACK, Suit.CLUBS),
        new Card(Rank.QUEEN, Suit.DIAMONDS),
        new Card(Rank.KING, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];
      expect(PokerHand.isStraight(cards)).toBe(true);
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.STRAIGHT);
    });

    it('should not detect wrap-around straight (K-A-2-3-4)', () => {
      const cards = [
        new Card(Rank.KING, Suit.HEARTS),
        new Card(Rank.ACE, Suit.CLUBS),
        new Card(Rank.DEUCE, Suit.DIAMONDS),
        new Card(Rank.THREE, Suit.SPADES),
        new Card(Rank.FOUR, Suit.HEARTS),
      ];
      expect(PokerHand.isStraight(cards)).toBe(false);
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEFAULT);
    });

    it('should handle unsorted straight', () => {
      const cards = [
        new Card(Rank.SEVEN, Suit.HEARTS),
        new Card(Rank.FOUR, Suit.CLUBS),
        new Card(Rank.SIX, Suit.DIAMONDS),
        new Card(Rank.EIGHT, Suit.SPADES),
        new Card(Rank.FIVE, Suit.HEARTS),
      ];
      expect(PokerHand.isStraight(cards)).toBe(true);
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.STRAIGHT);
    });

    it('should reject straight with gap', () => {
      const cards = [
        new Card(Rank.THREE, Suit.HEARTS),
        new Card(Rank.FOUR, Suit.CLUBS),
        new Card(Rank.FIVE, Suit.DIAMONDS),
        new Card(Rank.SEVEN, Suit.SPADES),
        new Card(Rank.EIGHT, Suit.HEARTS),
      ];
      expect(PokerHand.isStraight(cards)).toBe(false);
    });
  });

  describe('Dead Mans Hand Special Cases', () => {

    it('should detect dead mans hand with different fifth card', () => {
      const cards = [
        new Card(Rank.ACE, Suit.SPADES),
        new Card(Rank.ACE, Suit.CLUBS),
        new Card(Rank.EIGHT, Suit.SPADES),
        new Card(Rank.EIGHT, Suit.CLUBS),
        new Card(Rank.KING, Suit.DIAMONDS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEAD_MANS_HAND);
    });

    it('should not detect dead mans hand with wrong suits', () => {
      const cards = [
        new Card(Rank.ACE, Suit.HEARTS),
        new Card(Rank.ACE, Suit.CLUBS),
        new Card(Rank.EIGHT, Suit.SPADES),
        new Card(Rank.EIGHT, Suit.CLUBS),
        new Card(Rank.KING, Suit.DIAMONDS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.TWO_PAIRS);
    });

    it('should not detect dead mans hand with wrong ranks', () => {
      const cards = [
        new Card(Rank.KING, Suit.SPADES),
        new Card(Rank.ACE, Suit.CLUBS),
        new Card(Rank.EIGHT, Suit.SPADES),
        new Card(Rank.EIGHT, Suit.CLUBS),
        new Card(Rank.QUEEN, Suit.DIAMONDS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEFAULT);
    });
  });

  describe('Flush Edge Cases', () => {

    it('should detect flush with low cards', () => {
      const cards = [
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.FOUR, Suit.CLUBS),
        new Card(Rank.FIVE, Suit.CLUBS),
        new Card(Rank.SEVEN, Suit.CLUBS),
        new Card(Rank.NINE, Suit.CLUBS),
      ];
      expect(PokerHand.isFlush(cards)).toBe(true);
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.FLUSH);
    });

    it('should not detect flush with one different suit', () => {
      const cards = [
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.FOUR, Suit.CLUBS),
        new Card(Rank.FIVE, Suit.CLUBS),
        new Card(Rank.SEVEN, Suit.CLUBS),
        new Card(Rank.NINE, Suit.HEARTS),
      ];
      expect(PokerHand.isFlush(cards)).toBe(false);
    });
  });

  describe('Pair Qualification Edge Cases', () => {

    it('should qualify pair of queens', () => {
      const cards = [
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.QUEEN, Suit.HEARTS),
        new Card(Rank.QUEEN, Suit.CLUBS),
        new Card(Rank.SEVEN, Suit.DIAMONDS),
        new Card(Rank.NINE, Suit.HEARTS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.PAIR_JACKS_OR_HIGHER);
    });

    it('should qualify pair of aces', () => {
      const cards = [
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.ACE, Suit.HEARTS),
        new Card(Rank.ACE, Suit.CLUBS),
        new Card(Rank.SEVEN, Suit.DIAMONDS),
        new Card(Rank.NINE, Suit.HEARTS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.PAIR_JACKS_OR_HIGHER);
    });

    it('should not qualify pair of tens', () => {
      const cards = [
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.TEN, Suit.HEARTS),
        new Card(Rank.TEN, Suit.CLUBS),
        new Card(Rank.SEVEN, Suit.DIAMONDS),
        new Card(Rank.NINE, Suit.HEARTS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEFAULT);
    });

    it('should not qualify pair of nines', () => {
      const cards = [
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.NINE, Suit.HEARTS),
        new Card(Rank.NINE, Suit.CLUBS),
        new Card(Rank.SEVEN, Suit.DIAMONDS),
        new Card(Rank.FOUR, Suit.HEARTS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.DEFAULT);
    });
  });

  describe('Straight Flush Edge Cases', () => {

    it('should detect straight flush (low)', () => {
      const cards = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.THREE, Suit.HEARTS),
        new Card(Rank.FOUR, Suit.HEARTS),
        new Card(Rank.FIVE, Suit.HEARTS),
        new Card(Rank.SIX, Suit.HEARTS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.STRAIGHT_FLUSH);
    });

    it('should detect low ace straight flush', () => {
      const cards = [
        new Card(Rank.ACE, Suit.SPADES),
        new Card(Rank.DEUCE, Suit.SPADES),
        new Card(Rank.THREE, Suit.SPADES),
        new Card(Rank.FOUR, Suit.SPADES),
        new Card(Rank.FIVE, Suit.SPADES),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.ROYAL_FLUSH);
    });

    it('should prioritize royal flush over straight flush', () => {
      const cards = [
        new Card(Rank.ACE, Suit.DIAMONDS),
        new Card(Rank.KING, Suit.DIAMONDS),
        new Card(Rank.QUEEN, Suit.DIAMONDS),
        new Card(Rank.JACK, Suit.DIAMONDS),
        new Card(Rank.TEN, Suit.DIAMONDS),
      ];
      expect(PokerHand.calculateRank(cards)).toEqual(HandRank.ROYAL_FLUSH);
    });
  });

  describe('Method Consistency Tests', () => {

    it('should have consistent results between isTwoPairs and counts', () => {
      const cards = [
        new Card(Rank.DEUCE, Suit.HEARTS),
        new Card(Rank.DEUCE, Suit.CLUBS),
        new Card(Rank.SEVEN, Suit.DIAMONDS),
        new Card(Rank.SEVEN, Suit.SPADES),
        new Card(Rank.KING, Suit.HEARTS),
      ];

      expect(PokerHand.isTwoPairs(cards)).toBe(true);
      expect(PokerHand.uniq(cards)).toBe(3);

      const counts = PokerHand.counts(cards);
      expect(PokerHand.hasValue(counts, 2)).toBe(true);
    });

    it('should maintain consistency in hand evaluation order', () => {
      const fourOfKind = [
        new Card(Rank.NINE, Suit.HEARTS),
        new Card(Rank.NINE, Suit.CLUBS),
        new Card(Rank.NINE, Suit.DIAMONDS),
        new Card(Rank.NINE, Suit.SPADES),
        new Card(Rank.ACE, Suit.HEARTS),
      ];

      expect(PokerHand.isFourOfAKind(fourOfKind)).toBe(true);
      expect(PokerHand.calculateRank(fourOfKind)).toEqual(HandRank.FOUR_OF_A_KIND);
    });
  });

});
