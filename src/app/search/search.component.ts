import { Component, ViewChild, ElementRef } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { CallApiComponent } from '../call-api/call-api.component';
import { Feature } from '../marker-element';
import { subscribeOn } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CallApiComponent, MapComponent],
  template: `
  <div id="searchContainer">
  <input type="text" placeholder="A dónde quieres ir" (keydown.enter)="getSearch($event)">
  <div class="results" #resultsNode>
    @for(index of results; track index.properties.lat){
      <div class="result" (click)="goToSearch(index)">{{ index.properties.country }}, {{ index.properties.city }}, {{ index.properties.address_line1 }}</div>
    }
  </div>
  </div>
  `,
  styleUrl: './search.component.css'
})

export class SearchComponent {

  public results: Array<Feature>;
  public search: any[];

  @ViewChild('resultsNode') resultsNode!: ElementRef;

  constructor(private callApiComponent: CallApiComponent, private mapComponent: MapComponent) { }

  getSearch(event: any) {
    this.callApiComponent.getApiLatLng(event.target.value).subscribe((data: any) => {
      this.results = data.features;
      this.resultsNode.nativeElement.style.display = "block";
    });
  };

  goToSearch(index: Feature) {
    this.resultsNode.nativeElement.style.display = "none";
    let latLng = { 'lat': index.properties.lat, 'lng': index.properties.lon };
    this.mapComponent.goToNewPos(latLng);
  }
}