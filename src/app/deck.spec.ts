import {Card, Deck, Rank, Suit} from './deck';

describe('Card Class', () => {

  describe('Card Creation', () => {

    it('should create a card with specified rank and suit', () => {
      const card = new Card(Rank.ACE, Suit.SPADES);
      expect(card.rank).toEqual(Rank.ACE);
      expect(card.suit).toEqual(Suit.SPADES);
    });

    it('should create all possible card combinations', () => {
      const suits = [Suit.SPADES, Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS];
      const ranks = [
        Rank.DEUCE, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX, Rank.SEVEN,
        Rank.EIGHT, Rank.NINE, Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
      ];

      suits.forEach(suit => {
        ranks.forEach(rank => {
          const card = new Card(rank, suit);
          expect(card.rank).toEqual(rank);
          expect(card.suit).toEqual(suit);
        });
      });
    });
  });

  describe('Card Properties', () => {

    let card: Card;

    beforeEach(() => {
      card = new Card(Rank.KING, Suit.HEARTS);
    });

    it('should return correct rank', () => {
      expect(card.rank).toEqual(Rank.KING);
      expect(card.rank).toEqual(13);
    });

    it('should return correct suit', () => {
      expect(card.suit).toEqual(Suit.HEARTS);
      expect(card.suit).toEqual(2);
    });

    it('should have immutable rank and suit', () => {
      const originalRank = card.rank;
      const originalSuit = card.suit;

      // These properties should be read-only
      expect(card.rank).toEqual(originalRank);
      expect(card.suit).toEqual(originalSuit);
    });
  });

  describe('Card String Representation', () => {

    it('should return correct string for Ace of Spades', () => {
      const card = new Card(Rank.ACE, Suit.SPADES);
      expect(card.toString()).toEqual('ACE of SPADES (1)');
    });

    it('should return correct string for Two of Hearts', () => {
      const card = new Card(Rank.DEUCE, Suit.HEARTS);
      expect(card.toString()).toEqual('DEUCE of HEARTS (2)');
    });

    it('should return correct string for King of Clubs', () => {
      const card = new Card(Rank.KING, Suit.CLUBS);
      expect(card.toString()).toEqual('KING of CLUBS (4)');
    });

    it('should return correct string for all face cards', () => {
      const faceCards = [
        { rank: Rank.JACK, expected: 'JACK' },
        { rank: Rank.QUEEN, expected: 'QUEEN' },
        { rank: Rank.KING, expected: 'KING' },
        { rank: Rank.ACE, expected: 'ACE' }
      ];

      faceCards.forEach(({ rank, expected }) => {
        const card = new Card(rank, Suit.SPADES);
        expect(card.toString()).toContain(expected);
      });
    });
  });

  describe('Card Equality and Comparison', () => {

    it('should create distinct card objects', () => {
      const card1 = new Card(Rank.ACE, Suit.SPADES);
      const card2 = new Card(Rank.ACE, Suit.SPADES);

      expect(card1).not.toBe(card2); // Different objects
      expect(card1.rank).toEqual(card2.rank); // Same rank
      expect(card1.suit).toEqual(card2.suit); // Same suit
    });

    it('should distinguish between different ranks', () => {
      const aceSpades = new Card(Rank.ACE, Suit.SPADES);
      const kingSpades = new Card(Rank.KING, Suit.SPADES);

      expect(aceSpades.rank).not.toEqual(kingSpades.rank);
      expect(aceSpades.suit).toEqual(kingSpades.suit);
    });

    it('should distinguish between different suits', () => {
      const aceSpades = new Card(Rank.ACE, Suit.SPADES);
      const aceHearts = new Card(Rank.ACE, Suit.HEARTS);

      expect(aceSpades.rank).toEqual(aceHearts.rank);
      expect(aceSpades.suit).not.toEqual(aceHearts.suit);
    });
  });

  describe('Rank and Suit Enum Values', () => {

    it('should have correct rank numerical values', () => {
      expect(Rank.DEUCE).toEqual(2);
      expect(Rank.THREE).toEqual(3);
      expect(Rank.TEN).toEqual(10);
      expect(Rank.JACK).toEqual(11);
      expect(Rank.QUEEN).toEqual(12);
      expect(Rank.KING).toEqual(13);
      expect(Rank.ACE).toEqual(14);
    });

    it('should have correct suit numerical values', () => {
      expect(Suit.SPADES).toEqual(1);
      expect(Suit.HEARTS).toEqual(2);
      expect(Suit.DIAMONDS).toEqual(3);
      expect(Suit.CLUBS).toEqual(4);
    });

    it('should have all ranks in sequence', () => {
      const expectedRanks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
      const actualRanks = [
        Rank.DEUCE, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX, Rank.SEVEN,
        Rank.EIGHT, Rank.NINE, Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
      ];

      expect(actualRanks).toEqual(expectedRanks);
    });
  });
});

describe('Deck Class', () => {

  let deck: Deck;

  beforeEach(() => {
    deck = new Deck();
  });

  describe('Deck Initialization', () => {

    it('should create a deck with 52 cards', () => {
      expect(deck.cards.length).toEqual(52);
    });

    it('should contain exactly 13 cards of each suit', () => {
      const suitCounts = {
        [Suit.SPADES]: 0,
        [Suit.HEARTS]: 0,
        [Suit.DIAMONDS]: 0,
        [Suit.CLUBS]: 0
      };

      deck.cards.forEach(card => {
        suitCounts[card.suit]++;
      });

      expect(suitCounts[Suit.SPADES]).toEqual(13);
      expect(suitCounts[Suit.HEARTS]).toEqual(13);
      expect(suitCounts[Suit.DIAMONDS]).toEqual(13);
      expect(suitCounts[Suit.CLUBS]).toEqual(13);
    });

    it('should contain exactly 4 cards of each rank', () => {
      const rankCounts: { [key: number]: number } = {};

      // Initialize counters
      for (let rank = Rank.DEUCE; rank <= Rank.ACE; rank++) {
        rankCounts[rank] = 0;
      }

      deck.cards.forEach(card => {
        rankCounts[card.rank]++;
      });

      // Check each rank has exactly 4 cards
      for (let rank = Rank.DEUCE; rank <= Rank.ACE; rank++) {
        expect(rankCounts[rank]).toEqual(4);
      }
    });

    it('should contain all unique card combinations', () => {
      const cardStrings = deck.cards.map(card => `${card.rank}-${card.suit}`);
      const uniqueCards = new Set(cardStrings);
      expect(uniqueCards.size).toEqual(52);
    });

    it('should have correct suits and ranks arrays', () => {
      expect(deck.suits).toEqual([Suit.SPADES, Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS]);
      expect(deck.ranks).toEqual([
        Rank.DEUCE, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX, Rank.SEVEN,
        Rank.EIGHT, Rank.NINE, Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
      ]);
    });

    it('should initialize cards in predictable order', () => {
      // First card should be Deuce of Spades
      expect(deck.cards[0].rank).toEqual(Rank.DEUCE);
      expect(deck.cards[0].suit).toEqual(Suit.SPADES);

      // 13th card should be Ace of Spades
      expect(deck.cards[12].rank).toEqual(Rank.ACE);
      expect(deck.cards[12].suit).toEqual(Suit.SPADES);

      // Last card should be Ace of Hearts
      expect(deck.cards[51].rank).toEqual(Rank.ACE);
      expect(deck.cards[51].suit).toEqual(Suit.HEARTS);
    });
  });

  describe('Deck Shuffling', () => {

    it('should change card order after shuffle', () => {
      const originalOrder = deck.cards.map(card => `${card.rank}-${card.suit}`);

      deck.shuffle();

      const shuffledOrder = deck.cards.map(card => `${card.rank}-${card.suit}`);

      // Very unlikely to be in exact same order after shuffle
      expect(shuffledOrder).not.toEqual(originalOrder);
    });

    it('should maintain 52 cards after shuffle', () => {
      deck.shuffle();
      expect(deck.cards.length).toEqual(52);
    });

    it('should maintain all unique cards after shuffle', () => {
      deck.shuffle();

      const cardStrings = deck.cards.map(card => `${card.rank}-${card.suit}`);
      const uniqueCards = new Set(cardStrings);
      expect(uniqueCards.size).toEqual(52);
    });

    it('should maintain suit distribution after shuffle', () => {
      deck.shuffle();

      const suitCounts = {
        [Suit.SPADES]: 0,
        [Suit.HEARTS]: 0,
        [Suit.DIAMONDS]: 0,
        [Suit.CLUBS]: 0
      };

      deck.cards.forEach(card => {
        suitCounts[card.suit]++;
      });

      expect(suitCounts[Suit.SPADES]).toEqual(13);
      expect(suitCounts[Suit.HEARTS]).toEqual(13);
      expect(suitCounts[Suit.DIAMONDS]).toEqual(13);
      expect(suitCounts[Suit.CLUBS]).toEqual(13);
    });

    it('should be able to shuffle multiple times', () => {
      const originalOrder = [...deck.cards];

      deck.shuffle();
      deck.shuffle();
      deck.shuffle();

      expect(deck.cards.length).toEqual(52);

      // Should still have all the same cards
      const originalStrings = originalOrder.map(card => `${card.rank}-${card.suit}`).sort();
      const shuffledStrings = deck.cards.map(card => `${card.rank}-${card.suit}`).sort();
      expect(shuffledStrings).toEqual(originalStrings);
    });

    it('should produce different shuffles on multiple calls', () => {
      const shuffles: string[] = [];

      for (let i = 0; i < 5; i++) {
        deck = new Deck(); // Fresh deck
        deck.shuffle();
        shuffles.push(deck.cards.map(card => `${card.rank}-${card.suit}`).join(','));
      }

      // Very unlikely all 5 shuffles are identical
      const uniqueShuffles = new Set(shuffles);
      expect(uniqueShuffles.size).toBeGreaterThan(1);
    });
  });

  describe('Card Dealing (take method)', () => {

    it('should deal specified number of cards', () => {
      const cards = deck.take(5);
      expect(cards.length).toEqual(5);
      expect(deck.cards.length).toEqual(47); // 52 - 5
    });

    it('should deal cards from top of deck', () => {
      const firstCard = deck.cards[0];
      const secondCard = deck.cards[1];

      const dealtCards = deck.take(2);

      expect(dealtCards[0]).toBe(firstCard);
      expect(dealtCards[1]).toBe(secondCard);
    });

    it('should modify original deck when dealing', () => {
      const originalFirstCard = deck.cards[0];

      deck.take(1);

      expect(deck.cards[0]).not.toBe(originalFirstCard);
      expect(deck.cards.length).toEqual(51);
    });

    it('should handle dealing single card', () => {
      const cards = deck.take(1);
      expect(cards.length).toEqual(1);
      expect(deck.cards.length).toEqual(51);
    });

    it('should handle dealing zero cards', () => {
      const cards = deck.take(0);
      expect(cards.length).toEqual(0);
      expect(deck.cards.length).toEqual(52);
    });

    it('should handle dealing all cards', () => {
      const cards = deck.take(52);
      expect(cards.length).toEqual(52);
      expect(deck.cards.length).toEqual(0);
    });

    it('should handle dealing more cards than available', () => {
      // Deal 50 cards first
      deck.take(50);
      expect(deck.cards.length).toEqual(2);

      // Try to deal 5 more (only 2 available)
      const cards = deck.take(5);
      expect(cards.length).toEqual(2); // Only 2 cards left
      expect(deck.cards.length).toEqual(0);
    });

    it('should handle multiple consecutive deals', () => {
      const firstDeal = deck.take(5);
      const secondDeal = deck.take(5);
      const thirdDeal = deck.take(5);

      expect(firstDeal.length).toEqual(5);
      expect(secondDeal.length).toEqual(5);
      expect(thirdDeal.length).toEqual(5);
      expect(deck.cards.length).toEqual(37); // 52 - 15

      // Cards should be different in each deal
      const allDealtCards = [...firstDeal, ...secondDeal, ...thirdDeal];
      const uniqueCards = new Set(allDealtCards.map(card => `${card.rank}-${card.suit}`));
      expect(uniqueCards.size).toEqual(15);
    });

    it('should handle edge case of dealing from empty deck', () => {
      // Empty the deck
      deck.take(52);
      expect(deck.cards.length).toEqual(0);

      // Try to deal from empty deck
      const cards = deck.take(1);
      expect(cards.length).toEqual(0);
      expect(deck.cards.length).toEqual(0);
    });
  });

  describe('Deck String Representation', () => {

    it('should return string representation of all cards', () => {
      const deckString = deck.toString();
      expect(deckString).toContain('DEUCE of SPADES');
      expect(deckString).toContain('ACE of HEARTS');
      expect(deckString.split(',').length).toEqual(53); // 52 cards + 1 empty string at end
    });

    it('should handle empty deck string representation', () => {
      deck.take(52); // Empty the deck
      const deckString = deck.toString();
      expect(deckString).toEqual('');
    });

    it('should handle partial deck string representation', () => {
      deck.take(50); // Leave 2 cards
      const deckString = deck.toString();
      const cardCount = deckString.split(',').filter(card => card.trim().length > 0).length;
      expect(cardCount).toEqual(2);
    });
  });

  describe('Deck Performance and Memory', () => {

    it('should handle multiple deck creations efficiently', () => {
      const decks: Deck[] = [];

      for (let i = 0; i < 10; i++) {
        decks.push(new Deck());
      }

      decks.forEach(testDeck => {
        expect(testDeck.cards.length).toEqual(52);
      });
    });

    it('should handle large number of shuffles', () => {
      for (let i = 0; i < 100; i++) {
        deck.shuffle();
      }

      expect(deck.cards.length).toEqual(52);

      const cardStrings = deck.cards.map(card => `${card.rank}-${card.suit}`);
      const uniqueCards = new Set(cardStrings);
      expect(uniqueCards.size).toEqual(52);
    });

    it('should handle mixed operations correctly', () => {
      deck.shuffle();
      const firstDeal = deck.take(10);
      deck.shuffle();
      const secondDeal = deck.take(10);
      deck.shuffle();
      const remainingCards = deck.take(32);

      expect(firstDeal.length).toEqual(10);
      expect(secondDeal.length).toEqual(10);
      expect(remainingCards.length).toEqual(32);
      expect(deck.cards.length).toEqual(0);

      // All dealt cards should be unique
      const allCards = [...firstDeal, ...secondDeal, ...remainingCards];
      const uniqueCards = new Set(allCards.map(card => `${card.rank}-${card.suit}`));
      expect(uniqueCards.size).toEqual(52);
    });
  });
});