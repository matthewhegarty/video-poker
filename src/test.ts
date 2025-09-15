// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Import all test files explicitly
import './app/deck.spec';
import './game.spec';
import './app/poker-hand.spec';
import './app/button/button.component.spec';
import './app/log.service.spec';
import './app/card-display/card-display.spec';
