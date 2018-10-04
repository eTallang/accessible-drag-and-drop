import {
  Component,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  AfterViewInit
} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ListItemDirective } from './list-item.directive';
import { FocusKeyManager } from '@angular/cdk/a11y';

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
  @ViewChildren(ListItemDirective)
  listItems: QueryList<ListItemDirective>;
  activeItem: ListItem;
  focusManager: FocusKeyManager<ListItemDirective>;
  selected: ListItem[] = [
    { id: 1, name: 'Taco' },
    { id: 2, name: 'Kjøttkaker' },
    { id: 3, name: 'Laks' },
    { id: 4, name: 'Lasagne' },
    { id: 5, name: 'Pizza' },
    { id: 6, name: 'Hamburger' }
  ];

  available: ListItem[] = [
    { id: 7, name: 'Indisk' },
    { id: 8, name: 'Sushi' },
    { id: 9, name: 'Indrefilet' },
    { id: 10, name: 'Wok' },
    { id: 11, name: 'Grøt' },
    { id: 12, name: 'Fårikål' }
  ];

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.focusManager = new FocusKeyManager<ListItemDirective>(this.listItems).withWrap().withTypeAhead();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  keydownhandler(event: KeyboardEvent) {
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.focusManager.activeItem.value.selected = !this.focusManager.activeItem.value.selected;
        break;
      case 'Enter':
        if (this.activeItem === this.focusManager.activeItem.value) {
          this.activeItem = null;
        } else {
          this.activeItem = this.focusManager.activeItem.value;
        }
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        if (this.activeItem) {
          this.moveItem(event);
        } else {
          this.moveFocus(event);
        }
        break;
      default:
      this.focusManager.onKeydown(event);
    }
  }

  private moveFocus(event: KeyboardEvent): void {
    if (!this.focusManager.activeItem) {
      this.focusManager.setFirstItemActive();
      return;
    }
    const list = this.selected.find(s => s === this.focusManager.activeItem.value) ? this.selected : this.available;
    if (event.code === 'ArrowDown') {
      if (list === this.selected && this.focusManager.activeItemIndex + 1 === this.selected.length) {
        this.focusManager.setFirstItemActive();
      } else if (list === this.available && this.focusManager.activeItemIndex + 1 === (this.available.length + this.selected.length)) {
        this.focusManager.setActiveItem(this.selected.length);
      } else {
        this.focusManager.setNextItemActive();
      }
    } else if (event.code === 'ArrowUp') {
      if (list === this.selected && this.focusManager.activeItemIndex === 0) {
        this.focusManager.setActiveItem(this.selected.length - 1);
      } else if (list === this.available && this.focusManager.activeItemIndex === this.selected.length) {
        this.focusManager.setLastItemActive();
      } else {
        this.focusManager.setPreviousItemActive();
      }
    } else if (event.code === 'ArrowLeft' ||  event.code === 'ArrowRight') {
      const indexInAvailableList = this. available.indexOf(this.focusManager.activeItem.value);
      if (indexInAvailableList === -1) {
        if (this.focusManager.activeItemIndex > this.available.length - 1) {
          this.focusManager.setLastItemActive();
        } else {
          this.focusManager.setActiveItem(this.selected.length + this.focusManager.activeItemIndex);
        }
      } else {
        if (indexInAvailableList > this.selected.length - 1) {
          this.focusManager.setActiveItem(this.selected.length - 1);
        } else {
          this.focusManager.setActiveItem(indexInAvailableList);
        }
      }
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
