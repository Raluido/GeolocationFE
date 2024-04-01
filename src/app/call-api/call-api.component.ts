import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ShapesElement } from '../marker-element';


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

  getApiEndPoints(): Observable<ShapesElement[]> {
    return this.http.jsonp(environment.myApiUrl + '/locations', 'callback')
      .pipe(map(result => this.JsonToArray(result)),
        catchError(this.handleError)
      );
  }

  JsonToArray(result: any) {
    let toObj = JSON.parse(result);
    let index: keyof typeof toObj;
    let shapes: Array<ShapesElement> = [];
    for (index in toObj) {
      let shape: ShapesElement = {
        name: toObj[index].name,
        description: toObj[index].description,
        location: toObj[index].location
      }
      shapes.push(shape);
    }

    return shapes;
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

