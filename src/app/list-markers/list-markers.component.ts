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
            
            </tbody>
        </table>
        <div *ngFor="let item of data | keyvalue">  
             <div class="" *nfFor="let item1 of item.value | keyvalue">
                <p class="">{{ item1.name }}</p>
             </div>
        </div>
  `,
  styleUrl: './list-markers.component.css',
})

export class ListMarkersComponent {

  constructor(private mapComponent: MapComponent) { }

  @Input() data: any;

  // showPopup(index: number) {
  //   const latLngObj: LatLng = new LatLng(this.data[index].lat, this.data[index].lng);
  //   this.mapComponent.showPopup(latLngObj);
  // }
}

