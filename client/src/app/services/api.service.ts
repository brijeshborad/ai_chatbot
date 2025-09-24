import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class APIService {

  baseUrl = environment.apiBaseUrl+"/api";
  private apiResponseSubject = new BehaviorSubject<any>(null);
  apiResponse$ = this.apiResponseSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  // GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  // POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`API Error: ${error.message}`, error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  setApiResponse(response: any): void {
    this.apiResponseSubject.next(response);
  }
}