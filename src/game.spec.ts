import {Game} from './game';
import {HandRank, PokerHand} from './app/poker-hand';
import {Card, Rank, Suit} from './app/deck';

describe('Game Logic', () => {

  let game: Game;

  describe('Game Initialization', () => {

    it('should initialise a new game with default parameters', () => {
      game = new Game();
      expect(game.balance).toEqual(0);
      expect(game.stake).toEqual(0);
      expect(game.deck).toBeDefined();
      expect(game.deck.cards.length).toEqual(52);
    });

    it('should initialize deck with 52 unique cards', () => {
      game = new Game();
      expect(game.deck.cards.length).toEqual(52);

      // Check for duplicates
      const cardStrings = game.deck.cards.map(card => `${card.rank}-${card.suit}`);
      const uniqueCards = new Set(cardStrings);
      expect(uniqueCards.size).toEqual(52);
    });
  });

  describe('Basic Game Play', () => {

    beforeEach(() => {
      game = new Game();
      game.balance = 10;
      game.stake = 1;
    });

    it('should deal 5 cards at start of game', () => {
      game.deal();
      expect(game.deck.cards.length).toEqual(47);
      expect(game.hand.length).toEqual(5);
      expect(game.balance).toEqual(10);
    });

    it('should update balance correctly', () => {
      game.updateBalance();
      expect(game.balance).toEqual(9);
    });

    it('should draw 5 cards post hold', () => {
      game.deal();
      game.draw([0, 1, 2, 3, 4]);
      expect(game.deck.cards.length).toEqual(42);
      expect(game.hand.length).toEqual(5);
      expect(game.balance).toEqual(10);
    });

    it('should draw selective cards based on indexes', () => {
      game.deal();
      const originalHand = [...game.hand];

      // Hold cards at positions 0 and 2, draw others
      game.draw([1, 3, 4]);

      expect(game.hand[0]).toEqual(originalHand[0]); // Held
      expect(game.hand[2]).toEqual(originalHand[2]); // Held
      expect(game.hand[1]).not.toEqual(originalHand[1]); // Drawn
      expect(game.hand[3]).not.toEqual(originalHand[3]); // Drawn
      expect(game.hand[4]).not.toEqual(originalHand[4]); // Drawn
      expect(game.deck.cards.length).toEqual(44); // 47 - 3 drawn cards
    });
  });

  describe('Balance Management Edge Cases', () => {

    beforeEach(() => {
      game = new Game();
    });

    it('should handle zero balance correctly', () => {
      game.balance = 0;
      game.stake = 1;
      expect(game.hasSufficientFunds()).toBe(false);
    });

    it('should handle exact balance match', () => {
      game.balance = 5;
      game.stake = 5;
      expect(game.hasSufficientFunds()).toBe(true);
    });

    it('should handle negative balance', () => {
      game.balance = -5;
      game.stake = 1;
      expect(game.hasSufficientFunds()).toBe(false);
    });

    it('should handle zero stake', () => {
      game.balance = 10;
      game.stake = 0;
      expect(game.hasSufficientFunds()).toBe(true);
    });

    it('should not allow stake greater than balance', () => {
      game.balance = 5;
      game.stake = 10;
      expect(game.hasSufficientFunds()).toBe(false);
    });

    it('should handle very large balance correctly', () => {
      game.balance = 999999;
      game.stake = 1;
      expect(game.hasSufficientFunds()).toBe(true);
    });

    it('should not update balance if insufficient funds', () => {
      game.balance = 0;
      game.stake = 1;
      game.updateBalance();
      expect(game.balance).toEqual(0); // Should remain unchanged
    });

    it('should handle partial balance after multiple games', () => {
      game.balance = 2.5;
      game.stake = 1;

      // First game
      game.updateBalance();
      expect(game.balance).toEqual(1.5);
      expect(game.hasSufficientFunds()).toBe(true);

      // Second game
      game.updateBalance();
      expect(game.balance).toEqual(0.5);
      expect(game.hasSufficientFunds()).toBe(false);
    });
  });

  describe('Stake Validation', () => {

    beforeEach(() => {
      game = new Game();
      game.balance = 100;
    });

    it('should handle fractional stakes', () => {
      game.stake = 0.5;
      game.updateBalance();
      expect(game.balance).toEqual(99.5);
    });

    it('should handle negative stake (edge case)', () => {
      game.stake = -1;
      game.updateBalance();
      // Current implementation doesn't prevent negative stakes
      expect(game.balance).toEqual(101); // Balance increases with negative stake
    });

    it('should handle zero stake', () => {
      game.stake = 0;
      game.updateBalance();
      expect(game.balance).toEqual(100); // No change
    });

    it('should handle very large stakes', () => {
      game.stake = 1000;
      game.updateBalance();
      expect(game.balance).toEqual(100); // Game logic prevents negative balance
    });
  });

  describe('Winning and Payouts', () => {

    beforeEach(() => {
      game = new Game();
      game.balance = 10;
      game.stake = 1;
    });

    it('should return correct balance after win', () => {
      spyOn(PokerHand, 'calculateRank').and.returnValue(HandRank.ROYAL_FLUSH);
      game.deal();
      game.calculateRank();

      expect(game.rank).toEqual(HandRank.ROYAL_FLUSH);
      expect(game.balance).toEqual(260); // 10 + (250 * 1)
    });

    it('should handle maximum payout correctly', () => {
      game.stake = 5; // Max stake for bonus
      spyOn(PokerHand, 'calculateRank').and.returnValue(HandRank.ROYAL_FLUSH);
      game.deal();
      game.calculateRank();

      expect(game.balance).toEqual(20010); // 10 + (4000 * 5)
    });

    it('should handle no-win scenario', () => {
      const originalBalance = game.balance;
      spyOn(PokerHand, 'calculateRank').and.returnValue(HandRank.DEFAULT);
      game.deal();
      game.calculateRank();

      expect(game.rank).toEqual(HandRank.DEFAULT);
      expect(game.balance).toEqual(originalBalance); // No payout
    });

    it('should handle multiple consecutive wins', () => {
      spyOn(PokerHand, 'calculateRank').and.returnValue(HandRank.PAIR_JACKS_OR_HIGHER);

      // First win
      game.deal();
      game.calculateRank();
      expect(game.balance).toEqual(11); // 10 + (1 * 1)

      // Second win (balance carries forward)
      game.resetDeck();
      game.stake = 1;
      game.deal();
      game.calculateRank();
      expect(game.balance).toEqual(12); // 11 + (1 * 1)
    });

    it('should handle fractional stake payouts', () => {
      game.stake = 0.5;
      spyOn(PokerHand, 'calculateRank').and.returnValue(HandRank.FLUSH);
      game.deal();
      game.calculateRank();

      const expectedPayout = 6 * 0.5; // Flush pays 6:1
      expect(game.balance).toEqual(10 + expectedPayout);
    });
  });

  describe('Multiple Game Sessions', () => {

    beforeEach(() => {
      game = new Game();
      game.balance = 20;
      game.stake = 2;
    });

    it('should handle complete game cycle', () => {
      // Deal
      game.deal();
      expect(game.hand.length).toEqual(5);
      expect(game.deck.cards.length).toEqual(47);

      // Update balance (subtract stake)
      game.updateBalance();
      expect(game.balance).toEqual(18);

      // Draw some cards
      game.draw([0, 2, 4]);
      expect(game.deck.cards.length).toEqual(44);

      // Calculate rank and payout
      spyOn(PokerHand, 'calculateRank').and.returnValue(HandRank.TWO_PAIRS);
      game.calculateRank();
      expect(game.balance).toEqual(22); // 18 + (2 * 2)
    });

    it('should maintain game state across resets', () => {
      const originalBalance = game.balance;

      // Play one round
      game.deal();
      game.updateBalance();
      game.draw([]);

      // Reset deck for next round
      game.resetDeck();
      expect(game.deck.cards.length).toEqual(52);
      expect(game.balance).toEqual(originalBalance - game.stake);
    });

    it('should track balance correctly over multiple rounds', () => {
      const rounds = [
        { rank: HandRank.PAIR_JACKS_OR_HIGHER, expectedBalance: 20 }, // +2 payout, -2 stake = 20
        { rank: HandRank.DEFAULT, expectedBalance: 18 }, // +0 payout, -2 stake = 18
        { rank: HandRank.THREE_OF_A_KIND, expectedBalance: 22 }, // +6 payout, -2 stake = 22
      ];

      rounds.forEach((round, index) => {
        game.resetDeck();
        game.deal();
        game.updateBalance();

        if (index === 0) {
          spyOn(PokerHand, 'calculateRank').and.returnValue(round.rank);
        } else {
          (PokerHand.calculateRank as jasmine.Spy).and.returnValue(round.rank);
        }
        game.calculateRank();

        expect(game.balance).toEqual(round.expectedBalance);
      });
    });
  });

  describe('Deck Exhaustion Scenarios', () => {

    beforeEach(() => {
      game = new Game();
      game.balance = 100;
      game.stake = 1;
    });

    it('should handle near-deck exhaustion', () => {
      // Deal most cards to simulate near exhaustion
      for (let i = 0; i < 8; i++) {
        game.deck.take(5); // Simulate dealing 8 hands of 5 cards = 40 cards
      }

      expect(game.deck.cards.length).toEqual(12); // 52 - 40 = 12 remaining

      // Should still be able to deal one more hand
      game.deal();
      expect(game.hand.length).toEqual(5);
      expect(game.deck.cards.length).toEqual(7);
    });

    it('should handle drawing when few cards remain', () => {
      // Deal most cards
      for (let i = 0; i < 8; i++) {
        game.deck.take(5);
      }

      game.deal(); // Takes 5 more, leaving 7
      expect(game.deck.cards.length).toEqual(7);

      // Should be able to draw up to 5 cards
      game.draw([0, 1, 2, 3, 4]);
      expect(game.deck.cards.length).toEqual(2);
      expect(game.hand.length).toEqual(5);
    });
  });

  describe('Pay Table Validation', () => {

    beforeEach(() => {
      game = new Game();
      game.stake = 1;
    });

    it('should return 4000 for Royal Flush when playing at max stake', () => {
      game.stake = 5;
      expect(game.getPayout(HandRank.ROYAL_FLUSH)).toEqual(4000);
    });

    it('should return 250 for Royal Flush at non-max stake', () => {
      expect(game.getPayout(HandRank.ROYAL_FLUSH)).toEqual(250);
    });

    it('should return 50 for Straight Flush', () => {
      expect(game.getPayout(HandRank.STRAIGHT_FLUSH)).toEqual(50);
    });

    it('should return 25 for Four-of-a-Kind', () => {
      expect(game.getPayout(HandRank.FOUR_OF_A_KIND)).toEqual(25);
    });

    it('should return 9 for Full House', () => {
      expect(game.getPayout(HandRank.FULL_HOUSE)).toEqual(9);
    });

    it('should return 6 for Flush', () => {
      expect(game.getPayout(HandRank.FLUSH)).toEqual(6);
    });

    it('should return 4 for Straight', () => {
      expect(game.getPayout(HandRank.STRAIGHT)).toEqual(4);
    });

    it('should return 3 for Three-of-a-Kind', () => {
      expect(game.getPayout(HandRank.THREE_OF_A_KIND)).toEqual(3);
    });

    it('should return 2 for Two Pairs', () => {
      expect(game.getPayout(HandRank.TWO_PAIRS)).toEqual(2);
    });

    it('should return 1 for Single Pair (Jacks or higher)', () => {
      expect(game.getPayout(HandRank.PAIR_JACKS_OR_HIGHER)).toEqual(1);
    });

    it('should return 0 for Dead Mans Hand (special case)', () => {
      expect(game.getPayout(HandRank.DEAD_MANS_HAND)).toEqual(0);
    });

    it('should return 0 for no win', () => {
      expect(game.getPayout(HandRank.DEFAULT)).toEqual(0);
    });

    it('should handle undefined hand rank gracefully', () => {
      expect(game.getPayout(undefined as any)).toEqual(0);
    });
  });

  describe('Error Handling', () => {

    beforeEach(() => {
      game = new Game();
      game.balance = 10;
      game.stake = 1;
    });

    it('should handle empty draw array', () => {
      game.deal();
      const originalHand = [...game.hand];

      game.draw([]);

      // Hand should remain unchanged
      expect(game.hand).toEqual(originalHand);
      expect(game.deck.cards.length).toEqual(47); // No cards drawn
    });

    it('should handle invalid draw indexes gracefully', () => {
      game.deal();
      const originalDeckSize = game.deck.cards.length;

      // This should not crash (implementation dependent)
      expect(() => game.draw([10, -1, 100])).not.toThrow();
    });

    it('should handle multiple deck resets', () => {
      game.deal(); // Use some cards

      game.resetDeck();
      expect(game.deck.cards.length).toEqual(52);

      game.resetDeck(); // Reset again
      expect(game.deck.cards.length).toEqual(52);
    });
  });
});