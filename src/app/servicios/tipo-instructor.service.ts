import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { TipoInstructor } from '../modelo/admin/tipo-instructor';

@Injectable({
  providedIn: 'root'
})
export class TipoInstructorService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<TipoInstructor[]> {
    return this.http.get<TipoInstructor[]>(`${ this.host }/tipoInstructor/listar`);
  }

  crear(tipoInstructor: TipoInstructor): Observable<HttpResponse<TipoInstructor>> {
    return this.http.post<TipoInstructor>(`${ this.host }/tipoInstructor/crear`, tipoInstructor, { observe: 'response' });
  }

  actualizar(tipoInstructor: TipoInstructor, id: any): Observable<HttpResponse<TipoInstructor>> {
    return this.http.put<TipoInstructor>(`${ this.host }/tipoInstructor/${ id }`, tipoInstructor, { observe: 'response' });
  }

  eliminar(id: any): Observable<string> {
    return this.http.delete<string>(`${ this.host }/tipoInstructor/${ id }`);
  }
}
