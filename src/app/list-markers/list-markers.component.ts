import { Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-list-markers',
  standalone: true,
  imports: [CommonModule, NgFor],
  template: `
      <table class="table">
            <thead class="">
                <tr class="">
                    <th class="">Proyecto</th>
                    <th class="">Descripción</th>
                    <th class="">Tipo</th>
                    <th class="">Coordenadas</th>
                </tr>
            </thead>
            <tbody class="">
            @for(item of data; track item.properties.name){
                <tr class="" (click)="goToShape(item)">
                  <td class="">{{item.properties.name}}</td>
                  <td class="">{{item.properties.description}}</td>
                  <td class="">{{item.geometry.type}}</td>
                  <td class="">{{item.geometry.coordinates}}</td>
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

  public goToShape(item: any) {
    this.mapComponent.getCenterMap(item);
  }

  // showPopup(index: number) {
  //   const latLngObj: LatLng = new LatLng(this.data[index].lat, this.data[index].lng);
  //   this.mapComponent.showPopup(latLngObj);
  // }
}

