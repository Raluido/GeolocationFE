import { Directive, HostListener } from '@angular/core';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { MapComponent } from './map/map.component';

@Directive({
  selector: 'div[appLoadShapes]',
  standalone: true
})

export class LoadShapesDirective {
  leafletDirective: LeafletDirective;
  mapComponent: MapComponent;

  constructor(leafletDirective: LeafletDirective, mapComponent: MapComponent) {
    this.leafletDirective = leafletDirective;
    this.mapComponent = mapComponent;
  }

  @HostListener('click', ['$event.target']) getShapes(btn: any) {
    if (null != this.leafletDirective.getMap()) {
      console.log(this.leafletDirective.map);
      // this.mapComponent.jumpToPage(this.leafletDirective.map, );
    }
  }

}
