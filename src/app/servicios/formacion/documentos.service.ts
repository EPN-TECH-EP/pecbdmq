import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable, throwError } from "rxjs";
import { DocumentoFormacion } from "../../modelo/flujos/formacion/documento";
import { catchError, map } from "rxjs/operators";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private host = environment.apiUrl

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  listar() {

    return this.http.get<DocumentoFormacion[]>(`${ this.host }/periodoacademico/documentos`);
  }

  crear(formData: FormData) {
    return this.http.post<DocumentoFormacion>(
      `${ this.host }/periodoacademico/cargarDocs`,
      formData,
      {
        headers: new HttpHeaders({ Accept: 'application/json' }),
      });
  }

  actualizar(formData: FormData, id: number) {
    return this.http.put<DocumentoFormacion>(
      `${ this.host }/documento/${ id }`,
      formData,
      {
        headers: new HttpHeaders({ Accept: 'application/json' }),
      });
  }

  eliminar(id: number) {
    return this.http.delete(`${ this.host }/documentofor/eliminardocumentoFormacion/${ id }`);
  }

  descargar(id: number) {
    return this.http.get(`${ this.host }/link/${ id }`, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }

  visualizarArchivo(id: number): Observable<SafeResourceUrl> {
    return this.descargar(id).pipe(
      map(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const archivo = new File([blob], 'archivo.pdf', { type: 'application/pdf' });
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
