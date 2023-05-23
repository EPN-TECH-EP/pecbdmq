import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
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

  crear(documento: DocumentoFormacion) {
    console.log(documento);
    return this.http.post<DocumentoFormacion>(`${this.host}/periodoacademico/cargarDocs`, documento);
  }

  actualizar(documento: DocumentoFormacion) {}

  eliminar(id: number) {}

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
