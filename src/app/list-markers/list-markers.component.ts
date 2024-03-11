import { Component, Injectable } from '@angular/core';
import { CallApiComponent } from '../call-api/call-api.component';
import { CommonModule, NgFor } from '@angular/common';
import { MarkerElement } from '../marker-element';

@Component({
  selector: 'app-list-markers',
  standalone: true,
  imports: [CallApiComponent, CommonModule, NgFor],
  template: `
  <div *ngIf="marks && marks.length > 0">
  <ul *ngFor="let marker of marks">
    <li>{{ marker.lat }}</li>
  </ul>
</div>
  `,
  styles: ``,
})

@Injectable({
  providedIn: 'root'
})

export class ListMarkersComponent {

  marks: MarkerElement[] = [];

  constructor(private callApiComponent: CallApiComponent) { }

  loadMarkers() {
    this.callApiComponent.getApiEndPoints().then((response) => {
      this.marks = response.data;
    });
  }
}
