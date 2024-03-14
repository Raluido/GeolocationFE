import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as L from 'leaflet';
import { CallApiComponent } from '../call-api/call-api.component';
import { MarkerElement } from '../marker-element';
import { ListMarkersComponent } from '../list-markers/list-markers.component';
import { SearchComponent } from '../search/search.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CallApiComponent, ListMarkersComponent, SearchComponent, PaginationComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements AfterViewInit {

  @ViewChild('addAddEndPointNode') addAddEndPointNode!: ElementRef;
  @ViewChild('addNameNode') addNameNode!: ElementRef;
  @ViewChild('addDescriptionNode') addDescriptionNode!: ElementRef;

  private map: any;
  private data: any;
  private popup = L.popup();
  private latLng: any;
  private markers: L.Marker[] = [];
  public currentData: any;
  public totalPagesArr: any;

  constructor(
    private callApiComponent: CallApiComponent
  ) { }

  // initMap se encarga de cargar la localización por defecto si no se indica una en la búsqueda

  public initMap(latLng = { 'lat': null, 'lng': null }) {
    this.callApiComponent.getApiEndPoints()
      .then((response) => {
        this.data = response.data;
        if (latLng.lat == null && latLng.lng == null) {
          this.latLng = { 'lat': 28.300, 'lng': -16.500 };
          this.map = L.map('map').setView([this.latLng.lat, this.latLng.lng], 10);
          this.renderMap();
        }
        else {
          this.latLng = { 'lat': latLng.lat, 'lng': latLng.lng };
          this.map.remove();
          this.map = L.map('map').setView([this.latLng.lat, this.latLng.lng], 10);
          this.renderMap();
        }
      })
      .catch((error) => console.log(error));
  }

  // renderMap añade los mapas tile

  private renderMap() {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    this.addStuffToMap();
  }

  // addStuffToMap recibe por defecto la pagina 1. Borra las capas por si hay busquedas o imagenes nuevas
  // se filtran areas y paginas con el resultado de las primeras
  // cargo las marcas nuevas que correspondan a ese lugar y pagina y añado popus con mouseover
  // con onclick despliego la ventana para añadir una marca
  // añado las marcas filtradas y paginadas al listado

  public addStuffToMap(currentPage = 1) {

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

    this.map.on('click', (event: any) => {
      this.latLng = event.latlng;
      this.addAddEndPointNode.nativeElement.style.display = "block";
      this.map.closePopup();
    });

    this.currentData = dataPaginated;
  }

  // addEndPoint se encarga de hacer el post para guardar el nuevo endpoint pasando a json el objecto
  // finalmente se cierra el cuadro y se recarga la base con el init

  public addEndPoint() {

    let name = this.addNameNode.nativeElement.value;
    let description = this.addDescriptionNode.nativeElement.value;
    let lat = this.latLng.lat;
    let lng = this.latLng.lng;

    let endPoint = {
      "report": {
        "project": name,
        "description": description,
        "lat": lat,
        "lng": lng,
        "saved_date": new Date()
      }
    };

    let endPointJson = JSON.stringify(endPoint);
    this.callApiComponent.postApiEndPoints(endPointJson)
      .then((response) => {
        response.data;
      })
      .catch((error) => console.log(error))
      .finally(() => this.closeAddEndPoint());
  }

  public closeAddEndPoint() {
    this.addAddEndPointNode.nativeElement.style.display = "none";
    this.initMap(this.latLng);
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

  // se filtran los puntos que no entren en el mapa

  private filterByArea(data: any) {
    let area = this.map.getBounds();
    let filterItems: any = [];

    data.forEach((element: any) => {
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
