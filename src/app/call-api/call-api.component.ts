import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ShapesElement } from '../marker-element';
import { Shape } from '../shape.model';


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

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getApiEndPoints() {
    return this.http.get(environment.myApiUrl + '/locations')
      .pipe(
        catchError(this.handleError)
      );
  }

  postApiEndPoints(endPoint: any): Observable<any> {
    return this.http.post<any>(environment.myApiUrl + '/locations', endPoint)
      .pipe(
        catchError(this.handleError)
      );
  }

  getApiLatLng(search: string): Observable<any[]> {
    search.replace(' ', '%');
    return this.http.get<any[]>(environment.apiUrlGeol + search + '&apiKey=' + environment.apiKey);
  }
}

