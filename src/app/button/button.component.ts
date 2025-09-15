import {Component, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <div id="button-container" (click)="handleClick()">
      <img src="assets/img/bc.png" draggable="false" class="selectDisable">
      <div id="circle"></div>
    </div>
  `,
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  enabled = false;

  @Output()
  buttonClick = new EventEmitter<any>()

  constructor() {
  }

  handleClick(): void {
    if (this.enabled) {
      this.buttonClick.emit({});
    }
  }
}
