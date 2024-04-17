import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet-draw';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { SearchComponent } from '../search/search.component';
import { CallApiComponent } from '../call-api/call-api.component';
import { ListMarkersComponent } from '../list-markers/list-markers.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoadShapesDirective } from '../load-shapes.directive';
import { GeoJsonObject, GeoJsonTypes } from 'geojson';

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

  public drawLocal: object;
  public drawOptions: object;
  public drawnItems: L.FeatureGroup;
  public layerGroup: L.LayerGroup;
  public layers: L.Layer[];
  public layersControl: object;
  public options: object;
  public pageSelected: number;
  public paginationArr: number[] = [];
  public centerMap: L.LatLng;
  public zoomMap: number;
  public map: L.Map;
  public latLngLiteral: L.LatLngLiteral;
  public latLng: L.LatLng;


  constructor(
    private callApiComponent: CallApiComponent
  ) { }

  public initMap() {

    this.latLngLiteral = { lat: 0, lng: 0 };

    this.options = {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 0,
      center: this.latLngLiteral
    }

    this.drawnItems = L.featureGroup();

    const DefaultIcon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png'
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    this.drawOptions = {
      position: 'topright',
      draw: {
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
    this.map = map;
    this.pageSelected = 1;
    this.loadShapes(this.pageSelected);
  }

  public jumpToPage(pageSelected: number) {
    this.pageSelected = pageSelected;
    this.layerGroup.clearLayers();
    this.loadShapes(pageSelected);
  }

  private loadShapes(pageSelected: number) {
    this.callApiComponent.getApiEndPoints(pageSelected)
      .subscribe((response: { [key: string]: any }) => {
        const allShapes = JSON.parse(response[0].json_build_object);
        const features = allShapes.features;
        if (features !== null) {
          this.layers = features;
          const itemSelected = features[0];
          this.getCenterMap(itemSelected);
          this.pagination(itemSelected.properties.total);
          this.layerGroup = L.layerGroup();
          L.geoJSON(allShapes).addTo(this.layerGroup);
          this.layerGroup.addTo(this.map);
        }
      });
  }

  public getCenterMap(itemSelected: any) {
    console.log(itemSelected);
    let shape;
    switch (itemSelected.geometry.type) {
      case 'Polygon':
        shape = (new L.Polygon(itemSelected.geometry.coordinates)).getBounds().getCenter();
        this.centerMap = this.inverseLatlng(shape);
        break;
      case 'Polyline':
        shape = (new L.Polyline(itemSelected.geometry.coordinates)).getBounds().getCenter();
        this.centerMap = this.inverseLatlng(shape);
        break;
      default:
        shape = new L.LatLng(itemSelected.geometry.coordinates[1], itemSelected.geometry.coordinates[0]);
        this.centerMap = shape;
    }
    this.zoomMap = 6;
    L.popup().setLatLng
  }

  private inverseLatlng(shape: L.LatLng) {
    let latlngInverse = [];
    latlngInverse = [shape.lng, shape.lat];
    shape.lat = latlngInverse[0];
    shape.lng = latlngInverse[1];
    return shape;
  }

  private pagination(items: number) {
    let numberOfPages = items / 5;
    let numberOfPagesFlr = Math.floor(numberOfPages);
    numberOfPages = numberOfPages - numberOfPagesFlr;
    this.paginationArr = [];
    if (numberOfPages > 0) {
      for (let i = 1; i <= numberOfPagesFlr + 1; i++) this.paginationArr.push(i);
    } else {
      for (let i = 1; i <= numberOfPagesFlr; i++) this.paginationArr.push(i);
    }
  }

  public onDrawCreated(event: any) {
    const text = "Quieres añadir esta nueva forma al map?";
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
      this.callApiComponent.postApiEndPoints(jsonData).subscribe((response: object) => {
        if (response) this.drawnItems.addLayer((event as L.DrawEvents.Created).layer);
      })
    }
  }

  public goToNewPos(latLngLiteral: L.LatLngLiteral) {
    this.latLng = new L.LatLng(latLngLiteral.lat, latLngLiteral.lng);
    this.centerMap = this.latLng;
    this.zoomMap = 10;
  }

  ngOnInit(): void {
    this.initMap();
  }

}