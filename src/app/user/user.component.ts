import { Component, Injectable } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

@Injectable({
  providedIn: 'root'
})

export class UserComponent {
  constructor() { }

  getAllUsers() {
    return axios.get('http://localhost:8080/api/users');
  }
}

