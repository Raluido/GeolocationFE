import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
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

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders()
    .set('Content-Type', 'application/geo+json')
    .set('Access-Control-Allow-Origin', '*');


  getApiEndPoints(): Observable<any[]> {
    return this.http.get<any>(environment.myApiUrl + '/locations');
  }

  postApiEndPoints(endPoint: any): Observable<any> {
    return this.http.post<any>(environment.myApiUrl + '/locations', endPoint, {
      'headers': this.headers
    })
      .pipe()
  }

  getApiLatLng(search: string): Observable<any[]> {
    search.replace(' ', '%');
    return this.http.get<any[]>(environment.apiUrlGeol + search + '&apiKey=' + environment.apiKey);
  }
}

