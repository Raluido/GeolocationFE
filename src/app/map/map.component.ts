import { Component, AfterViewInit, ViewChild, ElementRef, NgModule, OnInit, ErrorHandler, viewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { SearchComponent } from '../search/search.component';
import { CallApiComponent } from '../call-api/call-api.component';
import { ListMarkersComponent } from '../list-markers/list-markers.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoadShapesDirective } from '../load-shapes.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CallApiComponent, PaginationComponent, NgIf, LeafletModule, LeafletDrawModule, SearchComponent, ListMarkersComponent, LoadShapesDirective],
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
  public layers: any;
  public layerGroup: L.LayerGroup;
  public totalPages: number;
  public pageSelected: number;
  public paginationArr: number[] = [];
  public response: any;
  public center: any;
  public zoom: any;
  public offset: any;
  public layerGrp: any;



  constructor(
    private callApiComponent: CallApiComponent
  ) { }

  public initMap() {

    let latLng = { lat: 46.879966, lng: -121.726909 };

    this.options = {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: latLng
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
        circle: false,
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
    this.offset = 1;
    this.loadShapes(map, this.offset);
  }

  public jumpToPage(map: L.Map, pageSelected: number) {
    this.pageSelected = pageSelected;
    this.loadShapes(map, this.offset);
  }

  private loadShapes(map: L.Map, offset: number) {
    this.callApiComponent.getApiEndPoints(offset)
      .subscribe((response: { [key: string]: any }) => {
        let allShapes = JSON.parse(response[0].json_build_object);
        let features = allShapes.features;
        if (features !== null) {
          this.layers = features;
          this.pagination(features[0].properties.total);
          this.layerGrp = L.layerGroup();
          L.geoJSON(allShapes).addTo(this.layerGrp);
          this.layerGrp.addTo(map);
        }
      });
  }

  private pagination(items: number) {
    let itemsPerPage = items / 5;
    let itemsPerPageFlr = Math.floor(itemsPerPage);
    itemsPerPage = itemsPerPage - itemsPerPageFlr;
    if (itemsPerPage > 0) {
      for (let i = 1; i <= itemsPerPageFlr + 1; i++) this.paginationArr.push(i);

    } else {
      for (let i = 1; i <= itemsPerPage; i++) this.paginationArr.push(i);
    }
  }


  public onDrawCreated(event: any) {
    let text = "Quieres añadir esta nueva forma al map?";
    if (confirm(text) == true) {
      let layer = event.layer;
      let feature;
      feature = layer.feature = layer.feature || {};
      feature.type = feature.type || "Feature";
      feature.properties = feature.properties || {};
      layer.feature.properties.name = 'testing description';
      layer.feature.properties.description = 'testing name';
      let geoJson = L.featureGroup([layer]).toGeoJSON();
      let jsonData = JSON.stringify(geoJson);
      this.callApiComponent.postApiEndPoints(jsonData).subscribe((data: any) => {
        if (this.response) this.drawnItems.addLayer((event as L.DrawEvents.Created).layer);
      })
    }
  }

  public goToNewPos(latLng: L.LatLngLiteral) {
    this.center = latLng;
    this.zoom = 10;
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




