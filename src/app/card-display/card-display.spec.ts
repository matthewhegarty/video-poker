import {Card, Rank, Suit} from '../deck';
import {CardDisplayComponent} from './card-display.component';
import {CardComponent} from '../card/card.component';
import {Component, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

@Component({
  template: `
    <app-card-display></app-card-display>
  `
})
class WrapperComponent {
  @ViewChild(CardDisplayComponent) cardDisplayComponent!: CardDisplayComponent;

  getHighlightedIndexes(): number[] {
    const indexes: number[] = [];
    this.cardDisplayComponent.cardComponents.forEach( (cc: CardComponent, i: number) => {
      if (!cc.opacity) {
        indexes.push(i);
      }
    });
    return indexes;
  }
}

describe('highlightWinningCards tests', () => {

  let cardDisplayComponent: CardDisplayComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WrapperComponent,
        CardDisplayComponent,
        CardComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    fixture.detectChanges(); // First detect changes to initialize ViewChild
    cardDisplayComponent = fixture.componentInstance.cardDisplayComponent;
  });

  afterEach(() => {
    cardDisplayComponent.reset();
  });

  it('should return [0, 1] for pair (Jacks or higher)', () => {
    const cards = [
      new Card(Rank.JACK, Suit.HEARTS),
      new Card(Rank.JACK, Suit.CLUBS),
      new Card(Rank.FOUR, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
      new Card(Rank.SIX, Suit.SPADES),
    ];
    cardDisplayComponent.cards = cards;
    cardDisplayComponent.highlightWinningCards();
    expect(fixture.componentInstance.getHighlightedIndexes()).toEqual([0, 1]);
  });

  it('should return [0, 1, 3, 4] for two pairs', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.HEARTS),
      new Card(Rank.DEUCE, Suit.CLUBS),
      new Card(Rank.FOUR, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.SPADES),
      new Card(Rank.FIVE, Suit.HEARTS),
    ];
    cardDisplayComponent.cards = cards;
    cardDisplayComponent.highlightWinningCards();
    expect(fixture.componentInstance.getHighlightedIndexes()).toEqual([0, 1, 3, 4]);
  });

  it('should return [0, 1, 2, 3, 4] for flush', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.FOUR, Suit.HEARTS),
      new Card(Rank.TEN, Suit.HEARTS),
      new Card(Rank.KING, Suit.HEARTS),
    ];
    cardDisplayComponent.cards = cards;
    cardDisplayComponent.highlightWinningCards();
    expect(fixture.componentInstance.getHighlightedIndexes()).toEqual([0, 1, 2, 3, 4]);
  });

  it('should return [0, 1, 2, 3, 4] for straight', () => {
    const cards = [
      new Card(Rank.DEUCE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.CLUBS),
      new Card(Rank.FOUR, Suit.HEARTS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.SIX, Suit.HEARTS),
    ];
    cardDisplayComponent.cards = cards;
    cardDisplayComponent.highlightWinningCards();
    expect(fixture.componentInstance.getHighlightedIndexes()).toEqual([0, 1, 2, 3, 4]);
  });

  it('should return [] for no win', () => {
    const cards = [
      new Card(Rank.ACE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.CLUBS),
      new Card(Rank.FOUR, Suit.HEARTS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.SIX, Suit.HEARTS),
    ];
    cardDisplayComponent.cards = cards;
    cardDisplayComponent.highlightWinningCards();
    expect(fixture.componentInstance.getHighlightedIndexes()).toEqual([]);
  });

  it('should return [2, 3, 4] for three of a kind', () => {
    const cards = [
      new Card(Rank.FOUR, Suit.HEARTS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.CLUBS),
      new Card(Rank.THREE, Suit.SPADES),
    ];
    cardDisplayComponent.cards = cards;
    cardDisplayComponent.highlightWinningCards();
    expect(fixture.componentInstance.getHighlightedIndexes()).toEqual([2, 3, 4]);
  });

  it('should return [0, 2, 3, 4] for four of a kind', () => {
    const cards = [
      new Card(Rank.THREE, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.CLUBS),
      new Card(Rank.THREE, Suit.SPADES),
    ];
    cardDisplayComponent.cards = cards;
    cardDisplayComponent.highlightWinningCards();
    expect(fixture.componentInstance.getHighlightedIndexes()).toEqual([0, 2, 3, 4]);
  });

  it('should return [0, 1, 2, 3, 4] for full house', () => {
    const cards = [
      new Card(Rank.FIVE, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.HEARTS),
      new Card(Rank.THREE, Suit.CLUBS),
      new Card(Rank.THREE, Suit.SPADES),
    ];
    cardDisplayComponent.cards = cards;
    cardDisplayComponent.highlightWinningCards();
    expect(fixture.componentInstance.getHighlightedIndexes()).toEqual([0, 1, 2, 3, 4]);
  });

  it('should return [] for pair lower than Jacks', () => {
    const cards = [
      new Card(Rank.FIVE, Suit.DIAMONDS),
      new Card(Rank.FIVE, Suit.HEARTS),
      new Card(Rank.TEN, Suit.HEARTS),
      new Card(Rank.THREE, Suit.CLUBS),
      new Card(Rank.FOUR, Suit.SPADES),
    ];
    cardDisplayComponent.cards = cards;
    cardDisplayComponent.highlightWinningCards();
    expect(fixture.componentInstance.getHighlightedIndexes()).toEqual([]);
  });

});
