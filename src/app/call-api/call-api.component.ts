import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
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

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'text/html'
  //   })
  // }

  getApiEndPoints(): Observable<any[]> {
    return this.http.get<any>(environment.myApiUrl + '/locations');
  }

  postApiEndPoints(endPoint: any): Observable<any> {
    return this.http.post<any>(environment.myApiUrl + '/locations', endPoint)
      .pipe(catchError(err => {
        console.log('Handling error locally and rethrowing it...', err);
        return throwError(err);
      }))
  }

  getApiLatLng(search: string): Observable<any[]> {
    search.replace(' ', '%');
    return this.http.get<any[]>(environment.apiUrlGeol + search + '&apiKey=' + environment.apiKey);
  }
}

