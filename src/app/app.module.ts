import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FavoriteFoodModule } from './favorite-food/favorite-food.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FavoriteFoodModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
