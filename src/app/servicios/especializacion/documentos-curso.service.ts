import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DocumentosCursoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listarPorCurso(codCurso: number) {
    return this.http.get(`${ this.host }/repositorioCurso/documentosByCurso/${ codCurso }`);
  }

  cargar(formData: FormData) {
    return this.http.post(
      `${ this.host }/repositorioCurso/uploadDocumentos`,
      formData);
  }

  actualizar(formData: FormData, id: number) {
    return this.http.put(
      `${ this.host }/documentosCurso/actualizar/${ id }`,
      formData,
      {
        headers: { Accept: 'application/json' },
      });
  }

  eliminar(id: number, codCursoEspecializacion) {
    const params = new HttpParams()
      .set('codCursoEspecializacion', codCursoEspecializacion.toString())
      .set('codDocumento', id.toString());
    return this.http.delete(`${ this.host }/repositorioCurso/eliminarDocumento`, { params });
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

}
