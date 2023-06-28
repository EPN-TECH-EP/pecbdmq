import { SubtipoPrueba } from '../modelo/admin/subtipo-prueba';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubtipoPruebaService {
  private host = environment.apiUrl;
  private nombreServicio: string = 'subtipoprueba';

  constructor(private http: HttpClient) {}

  public listarPorTipoPrueba(codTipoPrueba: number): Observable<SubtipoPrueba[]> {
    return this.http.get<SubtipoPrueba[]>(`${this.host}/${this.nombreServicio}/listarPorTipoPrueba/${codTipoPrueba}`);
  }

  public crear(subtipoPrueba: SubtipoPrueba): Observable<HttpResponse<SubtipoPrueba>> {
    return this.http.post<SubtipoPrueba>(`${this.host}/${this.nombreServicio}/crear`, subtipoPrueba, {
      observe: 'response',
    });
  }

  public actualizar(subtipoPrueba: SubtipoPrueba, codPrueba: any): Observable<HttpResponse<SubtipoPrueba>> {
    return this.http.put<SubtipoPrueba>(`${this.host}/${this.nombreServicio}/${codPrueba}`, subtipoPrueba, {
      observe: 'response',
    });
  }

  public eliminar(codSubtipoPrueba: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/${this.nombreServicio}/${codSubtipoPrueba}`);
  }
}
