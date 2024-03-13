import { Component, Input } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  template: `
  <div class="" style="display:flex; justify-content: center;">
    @for(paginate of paginates; track paginate) {
    <div class="" style="display:inline-block; margin-right:1em; margin-bottom:2em; cursor:pointer;" (click)="goToPage($event)">{{ paginate }}</div>
    }
  </div>
  `,
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  constructor(private mapComponent: MapComponent) { }

  @Input() paginates: any;

  goToPage(event: any) {
    this.mapComponent.renderMap(event.target.innerHTML);
  };
}
