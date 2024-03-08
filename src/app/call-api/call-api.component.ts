import { Component, Injectable } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-call-api',
  standalone: true,
  imports: [],
  templateUrl: './call-api.component.html',
  styleUrl: './call-api.component.css'
})

@Injectable({
  providedIn: 'root'
})

export class CallApiComponent {

  async callApi(action: string) {
    return await axios.get('http://localhost:8080/api' + action);
  }
}

