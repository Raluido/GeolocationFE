import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {

  constructor(private router: Router) { }

  goToPage2() {

    this.router.navigate(['/page2']);
  }

}
