import {Component, QueryList, ViewChildren} from '@angular/core';
import {CardComponent} from '../card/card.component';
import {Card} from '../deck';
import {PokerHand} from '../poker-hand';

@Component({
  selector: 'app-card-display',
  template: `
    <style>
      #card-display-container {
        width: 390px;
        height: 96px;
        position: absolute;
        top: 124px;
        left: 74px;
      }
      .card {
        position: absolute;
      }
      #card1 {
        left: 0;
      }
      #card2 {
        left: 80px;
      }
      #card3 {
        left: 160px;
      }
      #card4 {
        left: 240px;
      }
      #card5 {
        left: 320px;
      }
    </style>
    <div id="card-display-container">
      <app-card class="card" id="card1" [active]="active"></app-card>
      <app-card class="card" id="card2" [active]="active"></app-card>
      <app-card class="card" id="card3" [active]="active"></app-card>
      <app-card class="card" id="card4" [active]="active"></app-card>
      <app-card class="card" id="card5" [active]="active"></app-card>
    </div>
`
})
export class CardDisplayComponent {

  private _cardsToChangeIndexes: number[] = [];
  active = false;

  @ViewChildren(CardComponent) cardComponents!: QueryList<CardComponent>;

  constructor() {}

  init(): void {
    this.cardComponents.forEach( (cardComponent: CardComponent) => {
      cardComponent.init();
    });
  }

  reset(): void {
    this._cardsToChangeIndexes = [];
    this.active = false;
  }

  unhighlight(): void {
    this.cardComponents.forEach( (cardComponent: CardComponent) => {
      cardComponent.reset();
    });
  }

  set cards(cards: Card[]) {
    const tmpArr = cards.slice();
    this.cardComponents.forEach((c: CardComponent, i) => {
      c.card = tmpArr[i];
    });
  }

  get cardsToChangeIndexes(): number[] {
    this.cardComponents.forEach( (c: CardComponent, i: number) => {
      if (!c.selected) {
        this._cardsToChangeIndexes.push(i);
      }
    });
    return this._cardsToChangeIndexes;
  }

  /**
   * Sets a visual display of the winning cards.
   */
  highlightWinningCards(): void {
    // build a map of Indexes by rank
    const indexesByRank: { [key: string]: number[] } = {};
    const cards: Card[] = [];
    let winningIndexes: number[] = [];
    this.cardComponents.forEach( (cc: CardComponent, i: number) => {
      cards.push(cc._card);
      const rank = cc._card.rank;
      if (!indexesByRank[rank]) {
        indexesByRank[rank] = [];
      }
      indexesByRank[rank].push(i);
    });
    const numKeys = Object.keys(indexesByRank).length;
    let values = [];
    switch (numKeys) {
      case 2:
        // is full house or four of a kind
        values = Object.keys(indexesByRank).map(k => indexesByRank[k]);
        const fourOfAKind = values.find(v => v.length === 4);
        winningIndexes = fourOfAKind ? fourOfAKind : [0, 1, 2, 3, 4];
        break;

      case 3:
        // is three of a kind or two pairs
        values = Object.keys(indexesByRank).map(k => indexesByRank[k]);
        const threeOfAKind = values.find(v => v.length === 3);
        if (threeOfAKind) {
          winningIndexes = threeOfAKind;
        } else {
          winningIndexes = ([] as number[]).concat(...values.filter(v => v.length === 2));
        }
        break;

      case 4: {
        // is pair
        if (!PokerHand.isPairJacksOrHigher(cards)) {
          winningIndexes = [];
        } else {
          // Object.values() gives compiler error:  use keys() instead
          //  https://stackoverflow.com/questions/43147696/unable-to-extract-object-values-in-typescript
          values = Object.keys(indexesByRank).map(k => indexesByRank[k]);
          winningIndexes = values.filter( (v: number[]) => v.length === 2)[0];
        }
        break;
      }
    }
    if (PokerHand.isStraight(cards) || PokerHand.isFlush(cards)) {
      winningIndexes = [0, 1, 2, 3, 4];
    }
    // now mark each winning card as highlighted
    this.cardComponents.forEach( (cc: CardComponent, i: number) => {
      if (!winningIndexes.includes(i)) {
        cc.opacity = true;
      }
    });
  }
}
