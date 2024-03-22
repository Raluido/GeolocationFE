import { Directive } from '@angular/core';
import { LeafletDrawDirective } from '@asymmetrik/ngx-leaflet-draw';

@Directive({
  selector: '[appDraw]',
  standalone: true
})
export class DrawDirective {

  constructor(public leafletDrawDirective: LeafletDrawDirective) {
    this.leafletDrawDirective = leafletDrawDirective;
  }

}
