import { Component, AfterViewInit, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { CallApiComponent } from '../call-api/call-api.component';
import { MarkerElement } from '../marker-element';
import { ListMarkersComponent } from '../list-markers/list-markers.component';
import { SearchComponent } from '../search/search.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { filter, throwError } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CallApiComponent, ListMarkersComponent, SearchComponent, PaginationComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements AfterViewInit {

  private map: any;
  private data: any;
  private popup = L.popup();
  private markers: L.Marker[] = [];
  public currentData: any;
  public totalPagesArr: any;

  constructor(
    private callApiComponent: CallApiComponent
  ) { }

  public initMap(latLng: any = []) {
    this.callApiComponent.getApiEndPoints()
      .then((response) => {
        this.data = response.data;
        if (latLng.length == 0) {
          latLng = [28.300, -16.500];
          this.map = L.map('map').setView([latLng[0], latLng[1]], 10);
          this.renderMap();
        }
        else {
          latLng = [latLng.lat, latLng.lon];
          this.map.remove();
          this.map = L.map('map').setView([latLng[0], latLng[1]], 10);
          this.renderMap();
        }
      })
      .catch((error) => console.log(error));
  }

  public renderMap(currentPage: number = 1) {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    this.addStuffToMap(currentPage);
  }

  private addStuffToMap(currentPage: any) {

    this.markers.forEach((marker: any) => {
      this.map.removeLayer(marker);
    });

    let filterByArea = this.filterByArea(this.data);
    let dataPaginated = this.pagination(currentPage, filterByArea);

    this.markers = [];

    dataPaginated.forEach((element: MarkerElement) => {
      const marker = L.marker([element.lat, element.lng]).addTo(this.map);
      this.markers.push(marker);
      marker.on('mouseover', (e) => this.showPopup(e.latlng));
    });

    this.map.on('click', (mapPoint: any) => {
      this.onMapClick(mapPoint);
    });

    this.currentData = dataPaginated;
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

  private pagination(page: number, items: []) {
    let itemsPerPage = 10;
    let totalPages = Math.floor(items.length / itemsPerPage) + 1;
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let pageItems: any = items.slice(startIndex, endIndex);

    let totalPagesArr = new Array(totalPages);
    for (let index = 0; index < totalPagesArr.length; index++) {
      totalPagesArr[index] = index + 1;
    }

    this.totalPagesArr = totalPagesArr;

    return pageItems;
  }

  private filterByArea(data: any) {
    let area = this.map.getBounds();
    let filterItems: any = [];


    data.forEach((element: any, key: any) => {
      if (element.lat < area._southWest.lat || element.lat > area._northEast.lat || element.lng < area._southWest.lng || element.lng > area._northEast.lng) {
      } else {
        filterItems.push(element);
      }
    });
    return filterItems;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

}
