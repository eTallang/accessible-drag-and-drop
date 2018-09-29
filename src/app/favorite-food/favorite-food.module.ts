import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FavoriteFoodComponent } from './favorite-food.component';

@NgModule({
  imports: [CommonModule, DragDropModule],
  declarations: [FavoriteFoodComponent],
  exports: [FavoriteFoodComponent]
})
export class FavoriteFoodModule {}
