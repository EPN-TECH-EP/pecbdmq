import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

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


  descargar(id: number) {
    return this.http.get(`${this.host}/link/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({Accept: 'application/pdf'})
    }).pipe(
      catchError(error => {
        console.error('Error al descargar archivo:', error);
        return throwError(error);
      })
    );
  }

  visualizar(id: number): Observable<SafeResourceUrl> {
    return this.descargar(id).pipe(
      map(data => {
        const blob = new Blob([data], {type: 'application/pdf'});
        const archivo = new File([blob], 'imagen-perfil', {type: 'application/pdf'});
        const url = URL.createObjectURL(archivo);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
    ).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
