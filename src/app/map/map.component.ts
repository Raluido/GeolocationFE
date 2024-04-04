import { Component, AfterViewInit, ViewChild, ElementRef, NgModule, OnInit, ErrorHandler } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { SearchComponent } from '../search/search.component';
import { CallApiComponent } from '../call-api/call-api.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CallApiComponent, PaginationComponent, NgIf, LeafletModule, LeafletDrawModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements OnInit {

  @ViewChild('addAddEndPointNode') addAddEndPointNode!: ElementRef;
  @ViewChild('addNameNode') addNameNode!: ElementRef;
  @ViewChild('addDescriptionNode') addDescriptionNode!: ElementRef;

  public shown: boolean = false;
  public drawLocal: any;
  public drawnItems: L.FeatureGroup;
  public drawOptions: any;
  public layersControl: any;
  public showLayer: boolean = false;
  public options: any;
  public layers: L.Layer[];
  public layerGroup: L.LayerGroup;
  public totalPagesArr: Array<number>;
  public pageSelected: number;
  public response: any;

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

    let DefaultIcon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png'
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    let myIcons = new L.Icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png'
    });

    this.drawOptions = {
      position: 'topright',
      draw: {
        marker: {
          icon: myIcons
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

  public onMapReady(map: L.Map) {
    this.callApiComponent.getApiEndPoints()
      .subscribe((resp: { [key: string]: any }) => {
        if (!resp[0].json_build_object.features === undefined) {
          let staticBreadcrumbs = JSON.parse(resp[0].json_build_object);
          let layerGrp = L.layerGroup();
          let allShapes = L.geoJSON(staticBreadcrumbs).addTo(layerGrp);
          allShapes.eachLayer(function (layer: L.Layer) {
            console.log("yeah");
          })
          layerGrp.addTo(map);
        }
      });
  }


  public onDrawCreated(event: any) {
    let layer = event.layer;
    let feature;
    feature = layer.feature = layer.feature || {};
    feature.type = feature.type || "Feature";
    feature.properties = feature.properties || {};
    layer.feature.properties.name = 'testing description';
    layer.feature.properties.description = 'testing name';
    if (layer.getRadius() !== undefined) layer.feature.properties.radius = layer.getRadius();
    this.drawnItems.addLayer((event as L.DrawEvents.Created).layer);
    let geoJson = L.featureGroup([layer]).toGeoJSON();
    let jsonData = JSON.stringify(geoJson);
    this.callApiComponent.postApiEndPoints(jsonData).subscribe((data: string) => {
      // this.response.push(data);
    })
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




