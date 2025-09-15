import { TestBed } from '@angular/core/testing';
import { LogService } from './log.service';

describe('LogService Game Events', () => {
  let service: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogService]
    });
    service = TestBed.inject(LogService);
  });

  describe('Service Initialization', () => {

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have a log method', () => {
      expect(typeof service.log).toBe('function');
    });

    it('should have a logChange$ observable', () => {
      expect(service.logChange$).toBeDefined();
      expect(typeof service.logChange$.subscribe).toBe('function');
    });

    it('should initialize with ReplaySubject behavior', () => {
      let receivedLogs: string[] = [];

      service.log('test message');

      service.logChange$.subscribe(log => {
        receivedLogs.push(log as string);
      });

      expect(receivedLogs).toContain('test message');
    });
  });

  describe('Basic Logging Functionality', () => {

    it('should emit logged messages to subscribers', () => {
      let receivedLog = '';

      service.logChange$.subscribe(log => {
        receivedLog = log as string;
      });

      service.log('test message');

      expect(receivedLog).toBe('test message');
    });

    it('should handle multiple log messages', () => {
      let receivedLogs: string[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log as string);
      });

      service.log('message 1');
      service.log('message 2');
      service.log('message 3');

      expect(receivedLogs).toEqual(['message 1', 'message 2', 'message 3']);
    });

    it('should handle empty string messages', () => {
      let receivedLog = '';

      service.logChange$.subscribe(log => {
        receivedLog = log as string;
      });

      service.log('');

      expect(receivedLog).toBe('');
    });

    it('should handle special characters and formatting', () => {
      let receivedLog = '';

      service.logChange$.subscribe(log => {
        receivedLog = log as string;
      });

      const specialMessage = 'Game: Player won $100.50 with Royal Flush! 🎉';
      service.log(specialMessage);

      expect(receivedLog).toBe(specialMessage);
    });
  });

  describe('Game Event Logging Scenarios', () => {

    it('should log game initialization events', () => {
      let receivedLogs: string[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log as string);
      });

      service.log('Game initialized with balance: $100');
      service.log('Deck shuffled');
      service.log('New game started');

      expect(receivedLogs).toContain('Game initialized with balance: $100');
      expect(receivedLogs).toContain('Deck shuffled');
      expect(receivedLogs).toContain('New game started');
    });

    it('should log hand dealing events', () => {
      let receivedLogs: string[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log as string);
      });

      service.log('Dealing initial hand...');
      service.log('Cards dealt: [AS, KH, QD, JC, 10S]');
      service.log('Hand evaluation: Royal Flush detected');

      expect(receivedLogs[0]).toBe('Dealing initial hand...');
      expect(receivedLogs[1]).toBe('Cards dealt: [AS, KH, QD, JC, 10S]');
      expect(receivedLogs[2]).toBe('Hand evaluation: Royal Flush detected');
    });

    it('should log card selection and draw events', () => {
      let receivedLogs: string[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log as string);
      });

      service.log('Player selected cards: [1, 3, 4]');
      service.log('Drawing 3 new cards...');
      service.log('New cards: [7H, 9D, AC]');
      service.log('Final hand: [AS, 7H, QD, 9D, AC]');

      expect(receivedLogs.length).toBe(4);
      expect(receivedLogs).toContain('Player selected cards: [1, 3, 4]');
      expect(receivedLogs).toContain('Final hand: [AS, 7H, QD, 9D, AC]');
    });

    it('should log betting and balance events', () => {
      let receivedLogs: string[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log as string);
      });

      service.log('Bet placed: $5');
      service.log('Balance updated: $95');
      service.log('Win detected: Two Pairs');
      service.log('Payout: $10 (2:1)');
      service.log('New balance: $105');

      expect(receivedLogs).toEqual([
        'Bet placed: $5',
        'Balance updated: $95',
        'Win detected: Two Pairs',
        'Payout: $10 (2:1)',
        'New balance: $105'
      ]);
    });

    it('should log special game events', () => {
      let receivedLogs: string[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log as string);
      });

      service.log('SPECIAL: Dead Man\'s Hand detected!');
      service.log('JACKPOT: Royal Flush with max bet!');
      service.log('WARNING: Insufficient funds');
      service.log('ERROR: Invalid card selection');

      expect(receivedLogs).toContain('SPECIAL: Dead Man\'s Hand detected!');
      expect(receivedLogs).toContain('JACKPOT: Royal Flush with max bet!');
      expect(receivedLogs).toContain('WARNING: Insufficient funds');
      expect(receivedLogs).toContain('ERROR: Invalid card selection');
    });
  });

  describe('Multiple Subscribers and ReplaySubject Behavior', () => {

    it('should support multiple subscribers', () => {
      let subscriber1Logs: string[] = [];
      let subscriber2Logs: string[] = [];

      service.logChange$.subscribe(log => {
        subscriber1Logs.push(log as string);
      });

      service.log('message 1');

      service.logChange$.subscribe(log => {
        subscriber2Logs.push(log as string);
      });

      service.log('message 2');

      expect(subscriber1Logs).toEqual(['message 1', 'message 2']);
      expect(subscriber2Logs).toEqual(['message 1', 'message 2']);
    });

    it('should replay all messages to new subscribers', () => {
      service.log('early message 1');
      service.log('early message 2');

      let lateSubscriberLogs: string[] = [];
      service.logChange$.subscribe(log => {
        lateSubscriberLogs.push(log as string);
      });

      service.log('new message');

      expect(lateSubscriberLogs).toEqual([
        'early message 1',
        'early message 2',
        'new message'
      ]);
    });

    it('should handle subscriber unsubscription', () => {
      let receivedLogs: string[] = [];

      const subscription = service.logChange$.subscribe(log => {
        receivedLogs.push(log as string);
      });

      service.log('message 1');
      subscription.unsubscribe();
      service.log('message 2');

      expect(receivedLogs).toEqual(['message 1']);
    });

    it('should handle rapid message logging', () => {
      let receivedLogs: string[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log as string);
      });

      const messageCount = 100;
      for (let i = 0; i < messageCount; i++) {
        service.log(`Message ${i}`);
      }

      expect(receivedLogs.length).toBe(messageCount);
      expect(receivedLogs[0]).toBe('Message 0');
      expect(receivedLogs[messageCount - 1]).toBe(`Message ${messageCount - 1}`);
    });
  });

  describe('Edge Cases and Error Handling', () => {

    it('should handle null and undefined messages gracefully', () => {
      let receivedLogs: any[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log);
      });

      service.log(null as any);
      service.log(undefined as any);

      expect(receivedLogs).toEqual([null, undefined]);
    });

    it('should handle numeric inputs', () => {
      let receivedLogs: any[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log);
      });

      service.log(123 as any);
      service.log(45.67 as any);

      expect(receivedLogs).toEqual([123, 45.67]);
    });

    it('should handle boolean inputs', () => {
      let receivedLogs: any[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log);
      });

      service.log(true as any);
      service.log(false as any);

      expect(receivedLogs).toEqual([true, false]);
    });

    it('should handle object inputs', () => {
      let receivedLogs: any[] = [];

      service.logChange$.subscribe(log => {
        receivedLogs.push(log);
      });

      const testObject = { message: 'test', value: 123 };
      service.log(testObject as any);

      expect(receivedLogs[0]).toEqual(testObject);
    });

    it('should handle very long messages', () => {
      let receivedLog = '';

      service.logChange$.subscribe(log => {
        receivedLog = log as string;
      });

      const longMessage = 'A'.repeat(10000);
      service.log(longMessage);

      expect(receivedLog).toBe(longMessage);
      expect(receivedLog.length).toBe(10000);
    });
  });

  describe('Game Session Logging Scenarios', () => {

    it('should log complete game session', () => {
      let gameLogs: string[] = [];

      service.logChange$.subscribe(log => {
        gameLogs.push(log as string);
      });

      service.log('=== Game Session Start ===');
      service.log('Initial balance: $100');
      service.log('Stake per hand: $1');

      service.log('--- Hand 1 ---');
      service.log('Cards dealt: [3H, 7D, JC, AS, KS]');
      service.log('Player holds: [JC, AS, KS]');
      service.log('New cards: [QD, 10H]');
      service.log('Final hand: [3H, 7D, JC, AS, KS] -> [QD, 10H, JC, AS, KS]');
      service.log('Result: Straight! Payout: $4');
      service.log('New balance: $103');

      service.log('--- Hand 2 ---');
      service.log('Cards dealt: [2C, 2H, 2S, 5D, 7H]');
      service.log('Player holds: [2C, 2H, 2S]');
      service.log('New cards: [9C, KC]');
      service.log('Final hand: [2C, 2H, 2S, 9C, KC]');
      service.log('Result: Three of a Kind! Payout: $3');
      service.log('New balance: $105');

      service.log('=== Game Session End ===');
      service.log('Final balance: $105');
      service.log('Net gain: $5');

      expect(gameLogs.length).toBe(20);
      expect(gameLogs[0]).toBe('=== Game Session Start ===');
      expect(gameLogs[19]).toBe('Net gain: $5');
      expect(gameLogs).toContain('Result: Straight! Payout: $4');
      expect(gameLogs).toContain('Result: Three of a Kind! Payout: $3');
    });

    it('should log error scenarios during gameplay', () => {
      let errorLogs: string[] = [];

      service.logChange$.subscribe(log => {
        errorLogs.push(log as string);
      });

      service.log('Game started successfully');
      service.log('ERROR: Deck exhausted during shuffle');
      service.log('RECOVERY: New deck created');
      service.log('WARNING: Player balance low ($2 remaining)');
      service.log('ERROR: Cannot place bet - insufficient funds');
      service.log('GAME ENDED: No funds remaining');

      expect(errorLogs).toContain('ERROR: Deck exhausted during shuffle');
      expect(errorLogs).toContain('RECOVERY: New deck created');
      expect(errorLogs).toContain('WARNING: Player balance low ($2 remaining)');
      expect(errorLogs).toContain('ERROR: Cannot place bet - insufficient funds');
    });

    it('should handle logging of game statistics', () => {
      let statsLogs: string[] = [];

      service.logChange$.subscribe(log => {
        statsLogs.push(log as string);
      });

      service.log('=== Game Statistics ===');
      service.log('Hands played: 25');
      service.log('Hands won: 8');
      service.log('Win rate: 32%');
      service.log('Best hand: Royal Flush');
      service.log('Total wagered: $125');
      service.log('Total winnings: $150');
      service.log('Net profit: $25');
      service.log('Average hand value: 1.2x');

      expect(statsLogs[0]).toBe('=== Game Statistics ===');
      expect(statsLogs).toContain('Win rate: 32%');
      expect(statsLogs).toContain('Best hand: Royal Flush');
      expect(statsLogs).toContain('Net profit: $25');
    });
  });

  describe('Performance and Memory Considerations', () => {

    it('should handle memory efficiently with large log volumes', () => {
      const messageCount = 1000;
      let receivedCount = 0;

      service.logChange$.subscribe(() => {
        receivedCount++;
      });

      for (let i = 0; i < messageCount; i++) {
        service.log(`Performance test message ${i}`);
      }

      expect(receivedCount).toBe(messageCount);
    });

    it('should maintain service state across multiple operations', () => {
      service.log('initial message');

      let firstSubscriberLogs: string[] = [];
      service.logChange$.subscribe(log => {
        firstSubscriberLogs.push(log as string);
      });

      service.log('second message');

      let secondSubscriberLogs: string[] = [];
      service.logChange$.subscribe(log => {
        secondSubscriberLogs.push(log as string);
      });

      expect(firstSubscriberLogs).toEqual(['initial message', 'second message']);
      expect(secondSubscriberLogs).toEqual(['initial message', 'second message']);
    });

    it('should handle concurrent logging and subscription operations', () => {
      let allLogs: string[] = [];

      const subscription1 = service.logChange$.subscribe(log => {
        allLogs.push(`Sub1: ${log}`);
      });

      service.log('message 1');

      const subscription2 = service.logChange$.subscribe(log => {
        allLogs.push(`Sub2: ${log}`);
      });

      service.log('message 2');

      subscription1.unsubscribe();
      service.log('message 3');

      subscription2.unsubscribe();

      expect(allLogs).toContain('Sub1: message 1');
      expect(allLogs).toContain('Sub2: message 1');
      expect(allLogs).toContain('Sub1: message 2');
      expect(allLogs).toContain('Sub2: message 2');
      expect(allLogs).toContain('Sub2: message 3');
      expect(allLogs).not.toContain('Sub1: message 3');
    });
  });
});