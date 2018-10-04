import { Directive, Input, ElementRef } from '@angular/core';
import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { ListItem } from './favorite-food.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[role="listitem"]'
})
export class ListItemDirective implements FocusableOption {
  @Input() value: ListItem;

  constructor(private elementRef: ElementRef<HTMLDivElement>) { }

  getLabel(): string {
    return this.value && this.value.name;
  }

  focus(origin?: FocusOrigin): void {
    this.elementRef.nativeElement.focus();
  }
}
