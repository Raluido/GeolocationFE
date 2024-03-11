import { Component, Output, EventEmitter } from '@angular/core';
import { Call } from '@angular/compiler';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  template: `
  <input type="text" placeholder="A dónde quieres ir" (keyup)="getSearch($event)" #newSearch>
  `,
  styleUrl: './search.component.css'
})
export class SearchComponent {

  @Output() newItemEvent = new EventEmitter<string>();

  getSearch(event: Event) {
    this.newItemEvent.
  }


}
