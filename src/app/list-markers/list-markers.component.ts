import { Component, Injectable, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { LatLng, latLng } from 'leaflet';

@Component({
  selector: 'app-list-markers',
  standalone: true,
  imports: [CommonModule, NgFor],
  template: `
      <table class="table">
            <thead class="">
                <tr class="">
                    <th class="">CCAA</th>
                    <th class="">Provincia</th>
                    <th class="">Ciudad</th>
                    <th class="">Proyecto</th>
                    <th class="">Descriptión</th>
                </tr>
            </thead>
            <tbody class="">
              @for(index of data; track index.lat; let i = $index) {
                <tr class="" (click)="showPopup(i)">
                  <td class="">{{index.ccaa}}</td>
                  <td class="">{{index.province}}</td>
                  <td class="">{{index.city}}</td>
                  <td class="">{{index.project}}</td>
                  <td class="">{{index.description}}</td>
                </tr>
                }
            </tbody>
        </table>
  `,
  styleUrl: './list-markers.component.css',
})

export class ListMarkersComponent {

  constructor(private mapComponent: MapComponent) { }

  @Input() data: any;

  showPopup(index: number) {
    const latLngObj: LatLng = new LatLng(this.data[index].lat, this.data[index].lng);
    this.mapComponent.showPopup(latLngObj);
  }
}

