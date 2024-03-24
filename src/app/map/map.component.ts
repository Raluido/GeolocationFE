import { Component, AfterViewInit, ViewChild, ElementRef, NgModule, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { SearchComponent } from '../search/search.component';
import { CallApiComponent } from '../call-api/call-api.component';
import { ListMarkersComponent } from '../list-markers/list-markers.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CallApiComponent, ListMarkersComponent, PaginationComponent, NgIf, LeafletModule, LeafletDrawModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements OnInit {

  @ViewChild('addAddEndPointNode') addAddEndPointNode!: ElementRef;
  @ViewChild('addNameNode') addNameNode!: ElementRef;
  @ViewChild('addDescriptionNode') addDescriptionNode!: ElementRef;

  private map: L.Map;
  private data: JSON;
  public shown: boolean = false;
  public drawLocal: any;
  public drawnItems: L.FeatureGroup;
  public drawOptions: any;
  public layer: L.Layer;
  public layersControl: any;
  public showLayer: boolean = false;
  public options: any;
  public layers: L.Layer[];
  public layerGroup: L.LayerGroup;
  public totalPagesArr: Array<number>;
  public pageSelected: number;

  constructor(
    private callApiComponent: CallApiComponent,
  ) { }

  public initMap(latLng?: L.LatLngLiteral) {

    this.layersControl = {
      baseLayers: {
        'Open Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
        'Open Cycle Map': L.tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      },
    }

    this.options = {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: L.latLng(46.879966, -121.726909)
    }

    this.drawnItems = L.featureGroup();

    this.drawOptions = {
      position: 'topright',
      draw: {
        marker: {
          icon: L.icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: '2b3e1faf89f94a4835397e7a43b4f77d.png',
            iconRetinaUrl: '680f69f3c2e6b90c1812a813edf67fd7.png',
            shadowUrl: 'a0c6cc1401c107b501efee6477816891.png'
          })
        },
        circle: {
          shapeOptions: {
            color: '#d4af37'
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#85bb65'
          },
          showArea: false
        }
      },
      edit: {
        featureGroup: this.drawnItems
      }
    };

    this.drawLocal = {
      draw: {
        toolbar: {
          buttons: {
            polygon: 'Draw an awesome polygon!'
          }
        }
      }
    }
  }

  public onDrawCreated(event: any) {
    let layer = event.layer;
    let feature;
    let description;
    feature = layer.feature = layer.feature || {}; // Initialize feature
    feature.type = feature.type || "Feature"; // Initialize feature.type
    let props = feature.properties = feature.properties || {}; // Initialize feature.properties
    layer.feature.properties.name = 'testing';
    layer.feature.properties.description = 'testing description';
    this.drawnItems.addLayer((event as L.DrawEvents.Created).layer);
    let geoJson = L.featureGroup([layer]).toGeoJSON();
    this.callApiComponent.postApiEndPoints(geoJson)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  }

  ngOnInit(): void {
    this.initMap();
  }

}

// private renderMap() {
//   let layer = new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
//   this.map.addLayer(layer);
//   this.addStuffToMap();
// }

// public addStuffToMap(currentPage: number = 1) {

//   if (this.layerGroup != undefined) this.layerGroup.clearLayers();

//   this.callApiComponent.getApiEndPoints()
//     .then((response) => {
//       this.data = response.data;

//       if (this.data.parse != undefined && this.data.parse.length > 0) {
//         let filterByArea = this.filterByArea(this.data);
//         this.layerGroup = this.pagination(currentPage, filterByArea);
//         this.layerGroup.addTo(this.map);
//         this.layers = this.layerGroup.getLayers();
//       } else {
//         this.layers = [];
//         this.layerGroup = new L.LayerGroup;
//         this.pagination(1, this.layerGroup);
//       }

//     }).catch();

// }

// public addEndPoint() {

//   let name = this.addNameNode.nativeElement.value;
//   let description = this.addDescriptionNode.nativeElement.value;
//   let lat = this.latLng.lat;
//   let lng = this.latLng.lng;
//   let endPoint: Object;
//   let endPointJson: string;

//   endPoint = {
//     "ccaa": 'default',
//     "province": 'default',
//     "city": 'default',
//     "project": name,
//     "description": description,
//     "lat": lat,
//     "lng": lng,
//     "created_at": new Date()
//   };

//   if (Object.keys(endPoint).length != 0) {
//     endPointJson = JSON.stringify(endPoint);
//     this.callApiComponent.postApiEndPoints(endPointJson)
//       .then((response) => {
//         response.data;
//       })
//       .catch((error) => console.log(error))
//       .finally(() => {
//         this.addAddEndPointNode.nativeElement.style.display = "none";
//         this.initMap(this.latLng);
//       });
//   }
// }

// public closeAddEndPoint() {
//   this.addAddEndPointNode.nativeElement.style.display = "none";
// }

// private pagination(page: number, items: L.LayerGroup) {
//   let itemsPerPage = 10;
//   let totalPages = items.getLayers.length / itemsPerPage;
//   let totalPagesRoundedd = Math.floor(totalPages);
//   if (totalPages != totalPagesRoundedd) totalPagesRoundedd += 1;
//   let startIndex = (page - 1) * itemsPerPage;
//   let endIndex = startIndex + itemsPerPage;

//   let i = 0;
//   items.eachLayer((layer) => {
//     i += 1;
//     if (i < startIndex || i > endIndex) items.removeLayer(layer);
//   })

//   let temp: Array<number> = [];
//   if (typeof (page) == 'string') page = parseInt(page);
//   if (totalPagesRoundedd < 4) {
//     for (let index = 1; index <= totalPagesRoundedd; index++) {
//       temp[index] = index;
//     }
//   } else {
//     if (page = totalPagesRoundedd) {
//       temp = [page - 2, page - 1, page];
//     } else if (page < totalPagesRoundedd) {
//       temp = [page - 1, page, page + 1];
//     }
//   }

//   this.totalPagesArr = temp;
//   this.pageSelected = page;

//   return items;
// }

// private filterByArea(data: JSON) {
//   let area = this.map.getBounds();
//   let filterLayers: L.Layer[] = Array();

//   for (let index in data) {
//     if (Object(index).lat < area.getSouthWest().lat || Object(index).lat > area.getNorthEast().lat || Object(index).lng < area.getSouthWest().lng || Object(index).lng > area.getNorthEast().lng) {
//     } else {
//       filterLayers.push(Object(index));
//     }
//   }

//   let filterGroup = new L.LayerGroup(filterLayers).addLayer(this.layer);

//   return filterGroup;
// }

// }




