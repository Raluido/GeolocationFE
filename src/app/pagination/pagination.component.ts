import { Component, Input } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  template: `
  <!-- <div id="pagination">
    @for(paginate of paginates; track paginate) {
      @if(pageSelected == paginate){
        <div id="pages" (click)="goToPage($event)" style="color:blue;">{{ paginate }}</div>
      } @else {
        <div id="pages" (click)="goToPage($event)">{{ paginate }}</div>
      }
    }
  </div> -->
  `,
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  constructor(private mapComponent: MapComponent) { }

  @Input() paginates: Array<number>;
  @Input() pageSelected: number;

  // goToPage(event: any) {
  //   this.mapComponent.addStuffToMap(event.target.innerHTML);
  // };
}
