import { Component, Output, EventEmitter } from '@angular/core';
import { Call } from '@angular/compiler';
import { CallApiComponent } from '../call-api/call-api.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CallApiComponent],
  template: `
  <input type="text" placeholder="A dónde quieres ir" (keydown.enter)="getSearch($event)">
  `,
  styleUrl: './search.component.css'
})
export class SearchComponent {

  constructor(private callApiComponent: CallApiComponent) { }

  getSearch(event: any) {
    // const latLng = this.callApiComponent.getApiLatLng(event.target.value);
  };
}
