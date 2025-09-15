import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {CardDisplayComponent} from './card-display/card-display.component';
import {LogService} from './log.service';
import {HandRank} from './poker-hand';
import {Game} from '../game';
import {ButtonComponent} from './button/button.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  // Game constants
  private readonly STARTING_BALANCE = 100;
  private readonly STAKE_PER_HAND = 1;

  protected textDisplay: string = '';
  protected game!: Game;

  @ViewChild(CardDisplayComponent) cardDisplay!: CardDisplayComponent;
  @ViewChild(ButtonComponent) button!: ButtonComponent;

  constructor(private logService: LogService) {
  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.textDisplay = 'Click button to deal';
    this.game = new Game();
    this.game.balance = this.STARTING_BALANCE;
    this.logService.log(`Game started with £${this.STARTING_BALANCE} balance`);
  }

  ngAfterViewInit(): void {
    this.button.enabled = true;
  }

  handleButtonClick(): void {
    if (!this.cardDisplay.active) {
      // First click - deal cards
      if (!this.game.hasSufficientFunds()) {
        this.textDisplay = 'Game Over - No funds remaining';
        this.button.enabled = false;
        return;
      }

      this.game.resetDeck();
      this.game.shuffleDeck();
      this.game.stake = this.STAKE_PER_HAND;
      this.game.updateBalance();
      this.game.deal();

      this.cardDisplay.unhighlight();
      this.cardDisplay.cards = this.game.hand;
      this.textDisplay = 'Click on cards to hold, then click button to draw';
      this.cardDisplay.active = true;

      this.logService.log(`Dealt hand - Stake: £${this.game.stake}`);
    } else {
      // Second click - draw cards
      this.game.draw(this.cardDisplay.cardsToChangeIndexes);
      this.cardDisplay.cards = this.game.hand;
      this.game.calculateRank();
      this.cardDisplay.highlightWinningCards();

      const payout = this.game.getPayout(this.game.rank) * this.game.stake;
      this.textDisplay = this.getPayoutDisplay(this.game.rank);

      if (payout > 0) {
        this.logService.log(`${this.textDisplay} - Won £${payout.toFixed(2)}`);
      } else {
        this.logService.log(`${this.textDisplay} - No win`);
      }

      this.cardDisplay.reset();

      // Check if game should continue
      if (!this.game.hasSufficientFunds()) {
        this.textDisplay = 'Game Over - No funds remaining';
        this.cardDisplay.active = false;
        this.button.enabled = false;
      } else {
        this.textDisplay = 'Click button to deal';
      }
    }
  }

  private getPayoutDisplay(rank: HandRank): string {
    switch (rank) {
      case HandRank.ROYAL_FLUSH:
        return 'Royal Flush!';
      case HandRank.STRAIGHT_FLUSH:
        return 'Straight Flush!';
      case HandRank.FOUR_OF_A_KIND:
        return 'Four of a Kind!';
      case HandRank.FULL_HOUSE:
        return 'Full House!';
      case HandRank.FLUSH:
        return 'Flush!';
      case HandRank.STRAIGHT:
        return 'Straight!';
      case HandRank.THREE_OF_A_KIND:
        return 'Three of a Kind!';
      case HandRank.TWO_PAIRS:
        return 'Two Pairs!';
      case HandRank.PAIR_JACKS_OR_HIGHER:
        return 'Pair - Jacks or Higher!';
      case HandRank.DEAD_MANS_HAND:
        return 'Dead Man\'s Hand... again!';
      default:
        return 'No win';
    }
  }
}