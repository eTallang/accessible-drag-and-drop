import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
  constructor() { }

  ngOnInit() {
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
