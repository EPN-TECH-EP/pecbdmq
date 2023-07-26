import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, throwError } from 'rxjs';
import { DocumentoFormacion } from 'src/app/modelo/flujos/formacion/documento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentoPruebaService {
  private host = environment.apiUrl;
  private nombreServicio = 'documentoPrueba';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  listar(codPruebaDetalle: number) {
    return this.http.get<DocumentoFormacion[]>(`${this.host}/${this.nombreServicio}/listar/${codPruebaDetalle}`);
  }

  guardarArchivo(formData: FormData) {
    return this.http.post<DocumentoFormacion>(`${this.host}/${this.nombreServicio}/guardarArchivo`, formData, {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    });
  }

  eliminar(codPruebaDetalle: number, codDocumento: number) {
    return this.http.delete(`${this.host}/${this.nombreServicio}/eliminarDocumento`, {
      params: {
        pruebaDetalle: codPruebaDetalle.toString(),
        codDocumento: codDocumento.toString(),
      },
    });
  }

  descargar(id: number) {
    return this.http
      .get(`${this.host}/link/${id}`, {
        responseType: 'blob',
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
