import { Injectable } from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable()
export class LogService {

  private logSource = new ReplaySubject();

  logChange$ = this.logSource.asObservable();

  constructor() { }

  log(s: string) {
    this.logSource.next(s);
  }

}
