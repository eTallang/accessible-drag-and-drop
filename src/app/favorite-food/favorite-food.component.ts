import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrop } from '@angular/cdk/drag-drop';

interface ListItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-favorite-food',
  templateUrl: './favorite-food.component.html',
  styleUrls: ['./favorite-food.component.scss']
})
export class FavoriteFoodComponent implements OnInit {
  @ViewChild('container') container: ElementRef;
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

  ngOnInit() {
  }

  activateItem(item: ListItem) {
    if (!this.activeItem) {
      this.activeItem = item;
    } else {
      if (item.id === this.activeItem.id) {
        this.activeItem = null;
      } else {
        this.activeItem = item;
      }
    }
  }

  moveItem(listName: 'selected' | 'available', item: ListItem, key: KeyboardEvent, el: CdkDrop) {
    const list = listName === 'selected' ? this.selected : this.available;
    if (this.activeItem && this.activeItem.id === item.id) {
      const index = list.indexOf(item);
      if (key.code === 'ArrowDown') {
        if (index === list.length - 1) {
          list.splice(index, 1);
          list.unshift(item);
        } else {
          const nextValue = list[index + 1];
          list.splice(index, 1, nextValue);
          list[index + 1] = item;
        }
      } else if (key.code === 'ArrowUp') {
        if (index === 0) {
          list.splice(index, 1);
          list.push(item);
        } else {
          const prevValue = list[index - 1];
          list.splice(index, 1, prevValue);
          list[index - 1] = item;
        }
      } else if (key.code === 'ArrowRight' || key.code === 'ArrowLeft') {
        if (listName === 'selected') {
          this.selected.splice(index, 1);
          this.available.splice(index, 0, item);
        } else {
          this.selected.splice(index, 0, item);
          this.available.splice(index, 1);
        }
      }
      this.changeDetector.detectChanges();

      const activeButton: HTMLButtonElement = this.container.nativeElement.querySelector('.active');
      activeButton.focus();
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
