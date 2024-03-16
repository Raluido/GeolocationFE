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

  public isAgrestaApi: boolean = true;
  private api: string;

  getApiEndPoints() {
    if (this.isAgrestaApi == true) this.api = environment.apiUrl;
    else this.api = environment.myApiUrl + '/locations';

    return axios.get(this.api);
  }

  postApiEndPoints(endPoint: any) {
    if (this.isAgrestaApi == true) this.api = environment.apiUrl;
    else this.api = environment.myApiUrl + '/locations';

    return axios.post(this.api, endPoint);
  }

  getApiLatLng(search: string) {
    search.replace(' ', '%');
    return axios.get(environment.apiUrlGeol + search + '&apiKey=' + environment.apiKey);
  }
}

