import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpEvent, HttpHeaders} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../modelo/admin/custom-http-response";

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  private host = environment.apiUrl

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
  }

  cargar(formData: FormData): Observable<HttpEvent<CustomHttpResponse>> {
    let response: Observable<HttpEvent<CustomHttpResponse>>;
    try {
      response = this.http.post<CustomHttpResponse>(
        `${this.host}/datopersonal/guardarImagen`,
        formData,
        {
          reportProgress: true,
          observe: 'events',
          headers: new HttpHeaders({Accept: 'application/json'}),
        }
      );

      return response;
    } catch (error) {
      console.log('catch CargaArchivoService');
    }
  }

  descargar(id: string) {
    return this.http.get(`${this.host}/link/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({Accept: 'application/image'})
    });
  }
}
