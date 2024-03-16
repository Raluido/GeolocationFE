import { Component, AfterViewInit, ViewChild, ElementRef, Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})

export class MapComponent implements AfterViewInit {

  @ViewChild('addAddEndPointNode') addAddEndPointNode!: ElementRef;
  @ViewChild('addNameNode') addNameNode!: ElementRef;
  @ViewChild('addDescriptionNode') addDescriptionNode!: ElementRef;

  private map: L.Map;
  private data: Array<MarkerElement>;
  private popup = L.popup();
  private latLng: L.LatLngLiteral;
  private markers: L.Marker[] = [];
  public currentData: Array<MarkerElement>;
  public totalPagesArr: Array<number>;

  constructor(
    private callApiComponent: CallApiComponent
  ) { }

  // initMap se encarga de cargar la localización por defecto si no se indica una en la búsqueda

  public initMap(latLng?: L.LatLngLiteral, swapApi: boolean = false) {

    if (swapApi == true) this.map.remove();

    if (latLng === undefined) {
      this.latLng = { 'lat': 28.300, 'lng': -16.500 };
      this.map = L.map('map');
      this.map.setView([this.latLng.lat, this.latLng.lng], 10);
      this.renderMap();
    } else {
      this.latLng = { 'lat': latLng.lat, 'lng': latLng.lng };
      this.map.remove();
      this.map = L.map('map');
      this.map.setView([this.latLng.lat, this.latLng.lng], 10);
      this.renderMap();
    }
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

    if (this.markers.length > 0) {
      this.markers.forEach((marker: L.Marker) => {
        this.map.removeLayer(marker);
      });
    }

    this.callApiComponent.getApiEndPoints()
      .then((response) => {
        this.data = response.data;

        if (this.data.length > 0) {
          let filterByArea = this.filterByArea(this.data);
          let dataPaginated = this.pagination(currentPage, filterByArea);

          this.markers = [];

          dataPaginated.forEach((element: MarkerElement) => {
            const marker = L.marker([element.lat, element.lng]).addTo(this.map);
            this.markers.push(marker);
            marker.on('mouseover', (e) => this.showPopup(e.latlng));
          });

          this.currentData = dataPaginated;
        } else {
          this.currentData = [];
          this.pagination(1, []);
        }
      }).catch();

    this.map.on('click', (event: any) => {
      this.latLng = event.latlng;
      this.addAddEndPointNode.nativeElement.style.display = "block";
      this.map.closePopup();
    });
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

  private pagination(page: number, items: Array<MarkerElement>) {
    let itemsPerPage = 10;
    let totalPages = Math.floor(items.length / itemsPerPage) + 1;
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let pageItems: Array<MarkerElement> = items.slice(startIndex, endIndex);

    let totalPagesArr = new Array(totalPages);
    for (let index = 0; index < totalPagesArr.length; index++) {
      totalPagesArr[index] = index + 1;
    }

    this.totalPagesArr = totalPagesArr;

    return pageItems;
  }

  // se filtran los puntos que no entren en el mapa

  private filterByArea(data: Array<MarkerElement>) {
    let area = this.map.getBounds();
    let filterItems: Array<MarkerElement> = [];

    if (data.length > 0) {
      data.forEach((element: MarkerElement) => {
        if (element.lat < area.getSouthWest().lat || element.lat > area.getNorthEast().lat || element.lng < area.getSouthWest().lng || element.lng > area.getNorthEast().lng) {
        } else {
          filterItems.push(element);
        }
      });
    }
    return filterItems;
  }

  changeApi(event: any) {
    if (event.target.value == 'true') this.callApiComponent.isAgrestaApi = true;
    else this.callApiComponent.isAgrestaApi = false;
    this.initMap(undefined, true);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

}




