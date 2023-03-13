import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../modelo/custom-http-response';

@Injectable({
  providedIn: 'root',
})
export class CargaArchivoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public cargarArchivo(
    formData: FormData
  ): Observable<HttpEvent<CustomHttpResponse>> {
    let response: Observable<HttpEvent<CustomHttpResponse>>;

    try {
      response = this.http.post<CustomHttpResponse>(
        `${this.host}/usuario/guardarArchivo`,
        formData,
        {
          reportProgress: true,
          observe: 'events',
          headers: new HttpHeaders({ Accept: 'application/json' }),
        }
      );

      return response;
    } catch (error) {
      console.log('catch CargaArchivoService');
      console.log(error);
    }
  }

/*  public cargarArchivo(formData: FormData): Observable<CustomHttpResponse>{
    let response: Observable<CustomHttpResponse>;
    
    try {
      response = this.http.post<CustomHttpResponse>(
        `${this.host}/usuario/guardarArchivo`,
        formData
      ); 
      
      return response;

    } catch (error) {
      console.log('catch CargaArchivoService');
      console.log(error);
    }
    
  }*/
}
