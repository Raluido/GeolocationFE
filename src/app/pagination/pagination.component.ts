import { Component, Input } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  template: `
  <div id="pagination">
    @for(paginate of paginates; track paginate) {
    <div id="pages" (click)="goToPage($event)">{{ paginate }}</div>
    }
  </div>
  `,
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  constructor(private mapComponent: MapComponent) { }

  @Input() paginates: any;

  goToPage(event: any) {
    this.mapComponent.addStuffToMap(event.target.innerHTML);
  };
}
