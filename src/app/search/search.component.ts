import { Component, ViewChild, ElementRef } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { CallApiComponent } from '../call-api/call-api.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CallApiComponent, MapComponent],
  template: `
  <div id="searchContainer">
  <input type="text" placeholder="A dónde quieres ir" (keydown.enter)="getSearch($event)">
  <div class="results" #resultsNode>
    @for(index of results; track index.properties.lat){
      <div class="result" (click)="goToSearch(index)">{{ index.properties.country }}, {{ index.properties.city }}, {{ index.properties.address }}</div>
    }
  </div>
  </div>
  `,
  styleUrl: './search.component.css'
})

export class SearchComponent {

  public results: any;

  @ViewChild('resultsNode') resultsNode!: ElementRef;

  constructor(private callApiComponent: CallApiComponent, private mapComponent: MapComponent) { }

  getSearch(event: any) {
    const promise = this.callApiComponent.getApiLatLng(event.target.value);
    promise
      .then((response) => {
        this.results = response.data.features;
        this.resultsNode.nativeElement.style.display = "block";
      })
      .catch(error => console.log(error));
  };

  goToSearch(index: any) {
    this.resultsNode.nativeElement.style.display = "none";
    let latLng = { 'lat': index.properties.lat, 'lng': index.properties.lon };
    this.mapComponent.initMap(latLng);
  }
}
