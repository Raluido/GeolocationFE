import { Component, Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment.development';

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

  async getApiEndPoints() {
    return await axios.get(environment.apiUrl);
  }

  async postApiEndPoints(endPoint: any) {
    return await axios.post(environment.apiUrl, endPoint, {
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  async getApiLatLng(search: string) {
    search.replace(' ', '%');
    return await axios.get(environment.apiUrlGeol + search + '&apiKey=' + environment.apiKey);
  }
}

