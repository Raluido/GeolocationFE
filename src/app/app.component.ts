import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserComponent } from './user/user.component';
import { MapComponent } from './map/map.component';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserComponent, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {

  constructor(private userComponent: UserComponent, private router: Router) { }

  sendPrmt(action: string) {
    this.userComponent.getAllUsers(action).then(response => console.log(response.data));
  }

  goToPage2() {

    this.router.navigate(['/page2']);
  }

}
