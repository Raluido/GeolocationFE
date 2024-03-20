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


  getApiEndPoints() {
    return axios.get(environment.myApiUrl + '/locations');
  }

  postApiEndPoints(endPoint: any) {
    return axios.post(environment.myApiUrl + '/locations', endPoint);
  }

  getApiLatLng(search: string) {
    search.replace(' ', '%');
    return axios.get(environment.apiUrlGeol + search + '&apiKey=' + environment.apiKey);
  }
}

