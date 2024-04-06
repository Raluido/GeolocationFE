import { Directive } from '@angular/core';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';

@Directive({
  selector: '[appLoadShapes]',
  standalone: true
})
export class LoadShapesDirective {
  leafletDirective: LeafletDirective;

  constructor(leafletDirective: LeafletDirective) {
    console.log(leafletDirective);
    this.leafletDirective = leafletDirective;
  }

  getShapes() {
    if (null != this.leafletDirective.getMap()) {
      console.log("aquiiiiiiiiiiii");
    }
  }

}
