import { Component, AfterViewInit, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { CallApiComponent } from '../call-api/call-api.component';
import { MarkerElement } from '../marker-element';
import { ListMarkersComponent } from '../list-markers/list-markers.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CallApiComponent, ListMarkersComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements AfterViewInit {

  private map: any;
  private data: any;

  constructor(
    private callApiComponent: CallApiComponent,
    private elementRef: ElementRef,
    private listMarkersComponent: ListMarkersComponent
  ) { }

  private initMap() {
    this.callApiComponent.getApiEndPoints().then((response) => {
      this.data = response.data;

      this.map = L.map('map').setView([28.300, -16.500], 10);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      this.data.forEach((element: MarkerElement) => {
        L.marker([element.lat, element.lng]).addTo(this.map);
      });

      this.map.on('click', (e: any) => {
        this.onMapClick(e);
      });

      this.listMarkersComponent.loadMarkers();
    })
      .catch((error) => console.log(error));
  }

  private handleClick() {
    let lat: any = this.popup.getLatLng()?.lat;
    let lng: any = this.popup.getLatLng()?.lng;

    let endPoint = {
      "report": {
        "project": "Test Project",
        "description": "Test Description",
        "lat": lat,
        "lng": lng,
        "saved_date": new Date()
      }
    };

    let endPointJson = JSON.stringify(endPoint);
    this.callApiComponent.postApiEndPoints(endPointJson)
      .then(response => response.data)
      .catch((error) => console.log(error));

    L.marker([lat, lng]).addTo(this.map);

    this.map.closePopup();
  }

  private popup = L.popup();

  private onMapClick(e: any) {
    this.popup
      .setLatLng(e.latlng)
      .setContent(e.latlng.toString() + "<button id='addEndPoint'>Añadir marcador</button><button id='dltEndPoint'>Borrar marcador</button>")
      .openOn(this.map);

    this.popup
    this.elementRef.nativeElement.querySelector('#addEndPoint').addEventListener('click',
      this.handleClick.bind(this));
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
