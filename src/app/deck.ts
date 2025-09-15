export enum Suit {
  SPADES = 1,
  HEARTS,
  DIAMONDS,
  CLUBS
}

export enum Rank {
  DEUCE = 2,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING,
  ACE
}

export class Card {

  constructor(private _rank: Rank, private _suit: Suit) {
  }

  toString(): string {
    return Rank[this._rank] + ' of ' + Suit[this._suit] + ' (' + this._suit + ')';
  }

  get suit(): Suit {
    return this._suit;
  }

  get rank(): Rank {
    return this._rank;
  }
}

export class Deck {

  suits: Suit[] = [Suit.SPADES, Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS];
  ranks: Rank[] = [Rank.DEUCE, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX, Rank.SEVEN, Rank.EIGHT, Rank.NINE, Rank.TEN,
    Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE];

  cards: Card[] = [];

  constructor() {
    this.suits.forEach((suit) =>
      this.ranks.forEach((rank) =>
        this.cards.push(new Card(rank, suit))));
  }

  // https://stackoverflow.com/a/12646864/39296
  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  toString(): string {
    let output = '';
    this.cards.forEach(c => output += c.toString() + ', ');
    return output;
  }

  take(n: number): Card[] {
    return this.cards.splice(0, n);
  }
}
