import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { CallApiComponent } from '../call-api/call-api.component';
import { MarkerElement } from '../marker-element';
import { ListMarkersComponent } from '../list-markers/list-markers.component';
import { SearchComponent } from '../search/search.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgIf } from '@angular/common';
import { GeometryCollection } from 'geojson';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CallApiComponent, ListMarkersComponent, SearchComponent, PaginationComponent, NgIf],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements AfterViewInit {

  @ViewChild('addAddEndPointNode') addAddEndPointNode!: ElementRef;
  @ViewChild('addNameNode') addNameNode!: ElementRef;
  @ViewChild('addDescriptionNode') addDescriptionNode!: ElementRef;

  private map: L.Map;
  private data: JSON;
  private latLng: L.LatLngLiteral;
  public layerGroup: L.LayerGroup;
  public currentData: Array<MarkerElement>;
  public totalPagesArr: Array<number>;
  public pageSelected: number;

  constructor(
    private callApiComponent: CallApiComponent
  ) { }

  public initMap(latLng?: L.LatLngLiteral) {

    if (latLng === undefined) {
      this.latLng = { 'lat': 28.300, 'lng': -16.500 };
      this.map = L.map('map');
      this.map.setView([this.latLng.lat, this.latLng.lng], 10);
      this.renderMap();
    } else {
      this.latLng = { 'lat': latLng.lat, 'lng': latLng.lng };
      this.map.panTo([this.latLng.lat, this.latLng.lng]);
      this.renderMap();
    }
  }

  private renderMap() {
    let layer = new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.map.addLayer(layer);
    this.addStuffToMap();
  }

  public addStuffToMap(currentPage: number = 1) {

    this.map.pm.addControls();

    this.layerGroup.clearLayers();

    this.callApiComponent.getApiEndPoints()
      .then((response) => {
        this.data = response.data;

        if (this.data.parse.length > 0) {
          let filterByArea = this.filterByArea(this.data);
          let dataPaginated = this.pagination(currentPage, filterByArea);
          dataPaginated.forEach((element: MarkerElement) => {
            const marker = L.marker([element.lat, element.lng]).addTo(this.layerGroup);
            this.markers.push(marker);
          });

          let layerGroup = new L.LayerGroup(this.markers);

          this.currentData = dataPaginated;
        } else {
          this.currentData = [];
          this.pagination(1, []);
        }

      }).catch();
  }

  public setPopup(layer: L.LayerGroup) {
    let feature = layer.toGeoJSON();
    console.log(feature);
  };

  // this.map.on('pm:create', function (e) {
  //     let layerGroup = new L.LayerGroup([e.layer]);
  //     setPopup(layerGroup);
  //   });

  public addControls() {
    this.map.pm.addControls({
      position: 'topleft',
      drawCircleMarker: false,
      rotateMode: false,
    });
  }


  public addEndPoint() {

    let name = this.addNameNode.nativeElement.value;
    let description = this.addDescriptionNode.nativeElement.value;
    let lat = this.latLng.lat;
    let lng = this.latLng.lng;
    let endPoint: Object;
    let endPointJson: string;

    endPoint = {
      "ccaa": 'default',
      "province": 'default',
      "city": 'default',
      "project": name,
      "description": description,
      "lat": lat,
      "lng": lng,
      "created_at": new Date()
    };

    if (Object.keys(endPoint).length != 0) {
      endPointJson = JSON.stringify(endPoint);
      this.callApiComponent.postApiEndPoints(endPointJson)
        .then((response) => {
          response.data;
        })
        .catch((error) => console.log(error))
        .finally(() => {
          this.addAddEndPointNode.nativeElement.style.display = "none";
          this.initMap(this.latLng);
        });
    }
  }

  public closeAddEndPoint() {
    this.addAddEndPointNode.nativeElement.style.display = "none";
  }

  private pagination(page: number, items: Array<MarkerElement>) {
    let itemsPerPage = 10;
    let totalPages = items.length / itemsPerPage;
    let totalPagesRoundedd = Math.floor(totalPages);
    if (totalPages != totalPagesRoundedd) totalPagesRoundedd += 1;
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let pageItems: Array<MarkerElement> = items.slice(startIndex, endIndex);
    let temp: Array<number> = [];

    if (typeof (page) == 'string') page = parseInt(page);

    if (totalPagesRoundedd < 4) {
      for (let index = 1; index <= totalPagesRoundedd; index++) {
        temp[index] = index;
      }
    } else {
      if (page = totalPagesRoundedd) {
        temp = [page - 2, page - 1, page];
      } else if (page < totalPagesRoundedd) {
        temp = [page - 1, page, page + 1];
      }
    }

    this.totalPagesArr = temp;
    this.pageSelected = page;

    return pageItems;
  }

  private filterByArea(data: JSON) {
    let area = this.map.getBounds();
    let filterLayers = Array();
    let filterGroup: L.LayerGroup;

    for (let index in data) {
      if (Object(index).lat < area.getSouthWest().lat || Object(index).lat > area.getNorthEast().lat || Object(index).lng < area.getSouthWest().lng || Object(index).lng > area.getNorthEast().lng) {
      } else {
        filterLayers.push(Object(index));
      }
    }

    filterGroup.addLayer(filterLayers);


    return filterGroup;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}




