import { Materia } from '../modelo/admin/materias';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${ this.host }/materia/listar`);
  }

  crear(materia: Materia): Observable<HttpResponse<Materia>> {
    return this.http.post<Materia>(`${ this.host }/materia/crear`, materia, { observe: 'response' });
  }

  eliminar(codMateria: number): Observable<string> {
    return this.http.delete<string>(`${ this.host }/materia/${ codMateria }`);
  }

  actualizar(materia: Materia, codMateria: any): Observable<HttpResponse<Materia>> {
    return this.http.put<Materia>(`${ this.host }/materia/${ codMateria }`, materia, { observe: 'response' });
  }
}

