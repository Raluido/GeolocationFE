import { Component, Injectable } from '@angular/core';

@Component({
  selector: 'app-list-markers',
  standalone: true,
  imports: [],
  template: `
    <!-- <li *ngFor="let marker of data; trackBy: trackById">{{ marker }}</li> -->
  `,
  styles: ``,
})

// @Injectable({
//   providedIn: 'root'
// })

export class ListMarkersComponent {

  // private data: any;

  // constructor(private callApiComponent: CallApiComponent) { }

  // private loadMarkers() {
  //   this.callApiComponent.getApiEndPoints().then((response) => {
  //     console.log(response.data);
  //     this.data = response.data;
  //   });
  // }

  public test() {
    console.log("yeah");
  }

  // ngAfterViewInit(): void {
  //   console.log("aqui");
  //   this.loadMarkers();
  // }
}
