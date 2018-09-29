import { Directive, HostBinding, Input } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';
import { ListItem } from './favorite-food.component';

@Directive({
  selector: '[appListItem]'
})
export class ListItemDirective implements Highlightable {
  isActive = false;
  disabled?: boolean;

  @HostBinding('class.focused')
  get focusedClass() {
    return this.isActive;
  }

  @Input() value: ListItem;

  setActiveStyles(): void {
    this.isActive = true;
  }
  setInactiveStyles(): void {
    this.isActive = false;
  }
  getLabel?(): string {
    return this.value && this.value.name;
  }
}
