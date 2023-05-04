import { Materia } from '../modelo/admin/materias';
import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse, HttpErrorResponse,HttpEvent,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/admin/custom-http-response';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.host}/materia/listar`);
  }

  public registroMateria(materia: Materia): Observable<HttpResponse<Materia>> {
    return this.http.post<Materia>(`${this.host}/materia/crear`, materia, { observe: 'response' });
  }

   public eliminarMateria(codMateria: number): Observable<string> {
   return this.http.delete<string>(`${this.host}/materia/${codMateria}`);
   }
   public actualizarMateria(materia: Materia, codMateria:any): Observable<HttpResponse<Materia>> {
    return this.http.put<Materia>(`${this.host}/materia/${codMateria}`, materia, { observe: 'response' });
  }

  public obtenerUsuariosDeCacheLocal(): Materia[] {
    if (localStorage.getItem('materias')) {
        return JSON.parse(localStorage.getItem('materias'));
    }
    return null;
  }
}

