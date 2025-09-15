import {Component, Input, OnInit} from '@angular/core';
import {Card, Suit} from '../deck';

@Component({
  selector: 'app-card',
  template: `
    <style>
      .card {
        border: solid 1px black;
      }

      .card:hover {
        cursor: pointer
      }

      .selected {
        border: solid 2px cyan;
      }

      .opacity {
        opacity: 0.4;
        filter: alpha(opacity=40); /* For IE8 and earlier */
      }
    </style>
    <img src="assets/img/cards/{{face}}.png"
         class="card selectDisable"
         (click)="onClick()"
         [class.selected]="selected"
         [class.opacity]="opacity"
         draggable="false">
  `
})
export class CardComponent implements OnInit {

  @Input()
  active = false;

  _card!: Card;
  selected = false;
  opacity = false;
  protected face = 'b';

  constructor() {
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.reset();
    this.face = 'b';
  }

  reset(): void {
    this.opacity = false;
    this.selected = false;
  }

  onClick(): void {
    if (!this.active) {
      return;
    }
    this.selected = !this.selected;
  }

  set card(c: Card) {
    this._card = c;
    this.face = ('0' + (c.rank)).slice(-2) + Suit[c.suit].charAt(0).toLowerCase();
  }
}
