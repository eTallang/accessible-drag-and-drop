import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FavoriteFoodComponent } from './favorite-food.component';

@NgModule({
  imports: [CommonModule, A11yModule, DragDropModule],
  declarations: [FavoriteFoodComponent],
  exports: [FavoriteFoodComponent]
})
export class FavoriteFoodModule {}
