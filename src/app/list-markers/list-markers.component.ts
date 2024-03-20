import { Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { LatLng } from 'leaflet';
import { MarkerElement } from '../marker-element';

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
                    <th class="">Descripción</th>
                    <th class="">Latitud</th>
                    <th class="">Longitud</th>
                </tr>
            </thead>
            <tbody class="">
              @for(index of data; track index.lat; let i = $index) {
                <tr class="">
                  <td class="">{{index.ccaa}}</td>
                  <td class="">{{index.province}}</td>
                  <td class="">{{index.city}}</td>
                  <td class="">{{index.project}}</td>
                  <td class="">{{index.description}}</td>
                  <td class="">{{index.lat}}</td>
                  <td class="">{{index.lng}}</td>
                </tr>
                }
            </tbody>
        </table>
  `,
  styleUrl: './list-markers.component.css',
})

export class ListMarkersComponent {

  constructor(private mapComponent: MapComponent) { }

  @Input() data: Array<MarkerElement>;

  // showPopup(index: number) {
  //   const latLngObj: LatLng = new LatLng(this.data[index].lat, this.data[index].lng);
  //   this.mapComponent.showPopup(latLngObj);
  // }
}

