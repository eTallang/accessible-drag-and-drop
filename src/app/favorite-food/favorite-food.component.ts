import { Component, ElementRef, ChangeDetectorRef, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ListItemDirective } from './list-item.directive';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';

export interface ListItem {
  id: number;
  name: string;
  selected?: boolean;
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

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.focusManager = new ActiveDescendantKeyManager(this.listItems).withWrap().withTypeAhead();
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

  setChecked(listItem: ListItem, checked: boolean): void {
    listItem.selected = checked;
  }

  keydownhandler(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.focusManager.activeItem.value.selected = !this.focusManager.activeItem.value.selected;
    } else if (event.code === 'Space') {
      event.preventDefault();
      if (this.activeItem === this.focusManager.activeItem.value) {
        this.activeItem = null;
      } else {
        this.activeItem = this.focusManager.activeItem.value;
      }
    } else if (event.code.startsWith('Arrow') && this.activeItem) {
      this.moveItem(event);
    } else if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
     this.moveFocus();
    } else {
      this.focusManager.onKeydown(event);
    }
  }

  private moveFocus(): void {
    const indexInAvailableList = this.available.indexOf(this.focusManager.activeItem.value);
    if (indexInAvailableList === -1) {
      this.focusManager.setActiveItem(this.available.length + this.focusManager.activeItemIndex);
    } else {
      this.focusManager.setActiveItem(indexInAvailableList);
    }
  }

  private moveItem(key: KeyboardEvent): void {
    const selectedItem = this.focusManager.activeItem.value;
    const list = this.selected.find(s => s === selectedItem) ? this.selected : this.available;
    const index = list.indexOf(selectedItem);
      if (key.code === 'ArrowDown') {
        if (index === list.length - 1) {
          list.splice(index, 1);
          list.unshift(selectedItem);
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
      } else if (key.code === 'ArrowRight' || key.code === 'ArrowLeft') {
        if (this.selected.find(s => s === selectedItem)) {
          this.selected.splice(index, 1);
          this.available.splice(index, 0, selectedItem);
        } else {
          this.available.splice(index, 1);
          this.selected.splice(index, 0, selectedItem);
        }
        this.changeDetector.detectChanges();
        const arrays = [].concat(this.selected, this.available);
        this.focusManager.setActiveItem(arrays.indexOf(selectedItem));
      }
   }
}
