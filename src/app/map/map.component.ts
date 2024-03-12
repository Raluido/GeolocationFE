import { Component, AfterViewInit, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { CallApiComponent } from '../call-api/call-api.component';
import { MarkerElement } from '../marker-element';
import { ListMarkersComponent } from '../list-markers/list-markers.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CallApiComponent, ListMarkersComponent, SearchComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements AfterViewInit {

  private map: any;
  private data: any;
  public currentData: any;
  public currentSearch: any;
  private popup = L.popup();

  constructor(
    private callApiComponent: CallApiComponent
  ) { }

  private initMap(latLng?: number[]) {
    this.callApiComponent.getApiEndPoints().then((response) => {
      latLng = [28.300, -16.500];
      this.data = response.data;
      this.map = L.map('map').setView([latLng[0], latLng[1]], 10);

      this.renderMap();

    })
      .catch((error) => console.log(error));
  }

  private renderMap() {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.data.forEach((element: MarkerElement) => {
      let layer = L.marker([element.lat, element.lng]).addTo(this.map);
      layer.on('mouseover', (e) => this.showPopup(e.latlng));
    });

    this.map.on('click', (mapPoint: any) => {
      this.onMapClick(mapPoint);
    });

    this.currentData = this.data;
  }

  private onMapClick(mapPoint: any) {

    let lat: any = mapPoint.latlng.lat;
    let lng: any = mapPoint.latlng.lng;

    let endPoint = {
      "report": {
        "project": "Test Project",
        "description": "Test Description",
        "lat": lat,
        "lng": lng,
        "saved_date": new Date()
      }
    };

    let text = "Estás seguro de que quieres añadir ésta marca,\n\n Lat: " + lat + "    Lng: " + lng;

    if (confirm(text) == true) {
      let endPointJson = JSON.stringify(endPoint);
      this.callApiComponent.postApiEndPoints(endPointJson)
        .then((response) => {
          L.marker([lat, lng]).addTo(this.map);
          response.data;
        })
        .catch((error) => console.log(error));

    }

    this.map.closePopup();
  }

  public showPopup(listedIndex: L.LatLngExpression) {
    this.popup
      .setLatLng(listedIndex)
      .setContent(listedIndex.toString())
      .openOn(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

}
