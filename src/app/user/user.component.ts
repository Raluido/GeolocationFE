import { Component, Injectable } from '@angular/core';
import { CallApiComponent } from '../call-api/call-api.component';
import { Call } from '@angular/compiler';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CallApiComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

@Injectable({
  providedIn: 'root'
})

export class UserComponent {

  constructor(private callApiComponent: CallApiComponent) { }

  getAllUsers(action: string) {
    return this.callApiComponent.callApi(action);
  }
}

