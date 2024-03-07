import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GeolocationFE';

  constructor(private userComponent: UserComponent) { }

  getUser() {
    this.userComponent.getAllUsers()
      .then((response) => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }
}
