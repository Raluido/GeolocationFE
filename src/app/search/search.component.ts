import { Component, Output, EventEmitter } from '@angular/core';
import { Call } from '@angular/compiler';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  template: `
  <input type="text" placeholder="A dónde quieres ir" (change)="getSearch(newSearch.value)" #newSearch>
  `,
  styleUrl: './search.component.css'
})
export class SearchComponent {

  @Output() newItemEvent = new EventEmitter<string>();

  getSearch(value: string) {
    this.newItemEvent.emit(value);
  }


}
