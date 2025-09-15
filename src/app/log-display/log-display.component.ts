import { Component, OnInit } from '@angular/core';
import {LogService} from '../log.service';

@Component({
  selector: 'app-log-display',
  template: `
    <style>
      textarea {
        position: relative;
        top: -140px;
        background-color: black;
        color: greenyellow;
        border: solid 1px darkgreen;
        font-size: 10pt;
        font-family: "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
      }
      button {
        background-color: darkgrey;
        position: relative;
        left: -890px;
        top: -100px;
      }
    </style>
    <textarea rows="14" cols="110">{{text}}</textarea>
    <button class="btn btn-sm" (click)="this.text = ''">Clear</button>
  `
})
export class LogDisplayComponent implements OnInit {

  text = '';

  constructor(private logService: LogService) { }

  ngOnInit() {
    this.logService.logChange$.subscribe(evt => {
      this.text += evt + '\n';
    });
  }
}
