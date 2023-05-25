import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, throwError} from "rxjs";
import {DocumentoFormacion} from "../../modelo/flujos/formacion/documento";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private host = environment.apiUrl

  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<DocumentoFormacion[]>(`${this.host}/periodoacademico/documentos`);
  }

  crear(formData: FormData) {
    return this.http.post<DocumentoFormacion>(
      `${this.host}/periodoacademico/cargarDocs`,
      formData,
      {
        headers: new HttpHeaders({Accept: 'application/json'}),
      });
  }

  actualizar(formData: FormData, id: number) {
    return this.http.put<DocumentoFormacion>(
      `${this.host}/documento/${id}`,
      formData,
      {
        headers: new HttpHeaders({Accept: 'application/json'}),
      });
  }

  eliminar(id: number) {
    return this.http.post(`${this.host}/documento/eliminardocumentoconvocatoria/${id}`, null);
  }

  descargarArchivo(id: number) {
    return this.http.get(`${this.host}/link/${id}`, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          console.error('Error al descargar archivo:', error);
          return throwError(() => error);
        }
      ));
  }

}
