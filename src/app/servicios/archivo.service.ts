import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private host = environment.apiUrl

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
  }

  cargar(formData: FormData) {
    return this.http.post<FormData>(
      `${this.host}/documento/guardarArchivo`,
      formData,
      {
        reportProgress: true,
        observe: 'response',
        headers: new HttpHeaders({Accept: 'application/json'}),
      }
    ).pipe(
      catchError(error => {
        console.error('Error al cargar archivo:', error);
        return throwError(error);
      })
    );
  }

  descargar(id: string) {
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

  visualizar(id: string): Observable<SafeResourceUrl> {
    return this.descargar(id).pipe(
      map(data => {
        const blob = new Blob([data]);
        const archivo = new File([blob], 'archivo.pdf', {type: 'application/pdf'});
        const url = URL.createObjectURL(archivo);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
    ).pipe(
      catchError(error => {
        console.error('Error al visualizar archivo:', error);
        return throwError(error);
      })
    );
  }


}
