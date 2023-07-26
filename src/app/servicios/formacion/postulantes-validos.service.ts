import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginacionPostulantesValidos } from 'src/app/modelo/flujos/formacion/paginacion-postulantes-validos';
import { PostulanteValido } from 'src/app/modelo/flujos/formacion/postulante-valido';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostulantesValidosService {

  private host = environment.apiUrl;
  private nombreServicio: string = 'postulantesValidos';

  idMuestra: number;

  constructor(private http: HttpClient) {
  }

  // postulantesValidosPaginado
  // endpoint: /postulantesValidosPaginado?page=1&size=10
  // params: page, size
  // retorna: lista de PaginacionPostulanteValido
  /*public listarPaginado(page: number, size: number): Observable<PaginacionPostulantesValidos> {
    const params = { page: page.toString(), size: size.toString() }
    return this.http.get<PaginacionPostulantesValidos>(`${this.host}/${this.nombreServicio}/postulantesValidosPaginado`, { params });
  }*/

  // postulantesValidosPaginadoOrderApellido
  // endpoint: /postulantesValidosPaginadoOrderApellido?page=1&size=10
  // params: page, size
  // retorna: lista de PaginacionPostulanteValido
  public listarPaginado(page: number, size: number, orden: string): Observable<PaginacionPostulantesValidos> {
    const params = { page: page.toString(), size: size.toString() }

    if (orden == 'ID') {
    return this.http.get<PaginacionPostulantesValidos>(`${this.host}/${this.nombreServicio}/postulantesValidosPaginado`, { params });
    } else {
      return this.http.get<PaginacionPostulantesValidos>(`${this.host}/${this.nombreServicio}/postulantesValidosPaginadoOrderApellido`, { params });
    }
  }

  // buscar por filtro
  // endpoint: /postulantesValidosFiltro GET
  // params: tipoFiltro (cedula, idPostulante, apellido), valorFiltro
  // retorna: lista de PostulanteValido
  public buscarPorFiltro(tipoFiltro: string, valorFiltro: string): Observable<PostulanteValido[]> {
    const params = { tipoFiltro: tipoFiltro, valorFiltro: valorFiltro }
    return this.http.get<PostulanteValido[]>(`${this.host}/${this.nombreServicio}/postulantesValidosFiltro`, { params });
  }

}
