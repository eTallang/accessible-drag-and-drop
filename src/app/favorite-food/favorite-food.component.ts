import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrop } from '@angular/cdk/drag-drop';
import { ListItemDirective } from './list-item.directive';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';

export interface ListItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-favorite-food',
  templateUrl: './favorite-food.component.html',
  styleUrls: ['./favorite-food.component.scss']
})
export class FavoriteFoodComponent implements AfterViewInit {
  @ViewChild('container') container: ElementRef;
  @ViewChildren(ListItemDirective) listItems: QueryList<ListItemDirective>;
  focusManager: ActiveDescendantKeyManager<ListItemDirective>;
  activeItem: ListItem;
  selected: ListItem[] = [
    { id: 1, name: 'Taco' },
    { id: 2, name: 'Kjøttkaker' },
    { id: 3, name: 'Laks' },
    { id: 4, name: 'Lasagne' },
    { id: 5, name: 'Pizza' },
    { id: 6, name: 'Hamburger' },
  ];

  available: ListItem[] = [
    { id: 7, name: 'Indisk' },
    { id: 8, name: 'Sushi' },
    { id: 9, name: 'Indrefilet' },
    { id: 10, name: 'Wok' },
    { id: 11, name: 'Grøt' },
    { id: 12, name: 'Fårikål' },
  ];

  ngAfterViewInit() {
    this.focusManager = new ActiveDescendantKeyManager(this.listItems).withWrap().withTypeAhead();
  }

  keydownhandler(event: KeyboardEvent) {
    if (event.code === 'Space' || event.code === 'Enter') {
      if (this.activeItem === this.focusManager.activeItem.value) {
        this.activeItem = null;
      } else {
        this.activeItem = this.focusManager.activeItem.value;
      }
    } else if ((event.code === 'ArrowUp' || event.code === 'ArrowDown') && this.activeItem) {
      this.moveItem(event);
    }
    this.focusManager.onKeydown(event);
  }

  getAllItems(): ListItem[] {
    return [].concat(this.selected, this.available);
  }

  moveItem(key: KeyboardEvent) {
    const selectedItem = this.focusManager.activeItem.value;
    const index = this.focusManager.activeItemIndex;
    const list = this.selected.find(s => s === selectedItem) ? this.selected : this.available;
      if (key.code === 'ArrowDown') {
        if (index === list.length - 1) {
          list.splice(index, 1);
          list.unshift(selectedItem);
          this.focusManager.setNextItemActive();
        } else {
          const nextValue = list[index + 1];
          list.splice(index, 1, nextValue);
          list[index + 1] = selectedItem;
        }
      } else if (key.code === 'ArrowUp') {
        if (index === 0) {
          list.splice(index, 1);
          list.push(selectedItem);
        } else {
          const prevValue = list[index - 1];
          list.splice(index, 1, prevValue);
          list[index - 1] = selectedItem;
        }
      }
   }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}
