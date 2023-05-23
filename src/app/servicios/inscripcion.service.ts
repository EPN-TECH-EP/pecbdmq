import { HttpEvent, HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/admin/custom-http-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private host = environment.apiUrl;
  constructor(private http:HttpClient) { }



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
      console.log(error);
    }
  }

  public maxArchivo(): Observable<number> {
    let response: Observable<number>;

    try {
      response = this.http.get<number>(`${this.host}/usuario/maxArchivo`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
