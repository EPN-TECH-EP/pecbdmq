import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {Observable, throwError} from "rxjs";
import {CustomHttpResponse} from "../modelo/admin/custom-http-response";
import {catchError} from "rxjs/operators";

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

  cargar(formData: FormData): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(
      `${this.host}/datopersonal/guardarImagen`,
      formData,
      {
        reportProgress: true,
        observe: 'response',
        headers: new HttpHeaders({Accept: 'application/json'}),
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('catch CargaArchivoService', error);
        return throwError(() => error);
      })
    );
  }


  descargar(id: string) {
    return this.http.get(`${this.host}/link/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({Accept: 'application/json'}),
    });
  }
}
