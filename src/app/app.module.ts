import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ButtonComponent } from './button/button.component';
import { CardDisplayComponent } from './card-display/card-display.component';
import { CardComponent } from './card/card.component';
import { LogDisplayComponent } from './log-display/log-display.component';
import { LogService } from './log.service';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    CardDisplayComponent,
    CardComponent,
    LogDisplayComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [LogService],
  bootstrap: [AppComponent]
})
export class AppModule { }