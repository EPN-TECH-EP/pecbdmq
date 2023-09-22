import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginacionPostulantesValidos } from 'src/app/modelo/flujos/formacion/paginacion-postulantes-validos';
import { PostulanteValido } from 'src/app/modelo/flujos/formacion/postulante-valido';
import { environment } from 'src/environments/environment';


export interface PostulanteItem {
  codPostulante: number;
  idPostulante: string;
  cedula: string;
  correoPersonal: string;
  nombre: string;
  apellido: string;
  esAprobado: boolean;
}


export interface PruebaDetalleDatos {
  codPruebaDetalle: number;
  descripcionPrueba: string;
  fechaInicio: string;
  fechaFin: string;
  hora: string;
  estado: string;
  codPeriodoAcademico: number;
  codCursoEspecializacion: number;
  codSubtipoPrueba: number;
  ordenTipoPrueba: number;
  puntajeMinimo: number;
  puntajeMaximo: number;
  tienePuntaje: boolean;
  subTipoPruebaNombre: string;
  tipoPruebaNombre: string;
  esFisica: boolean;
}

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
      return this.http.get<PaginacionPostulantesValidos>(`${ this.host }/${ this.nombreServicio }/postulantesValidosPaginado`, { params });
    } else {
      return this.http.get<PaginacionPostulantesValidos>(`${ this.host }/${ this.nombreServicio }/postulantesValidosPaginadoOrderApellido`, { params });
    }
  }

  // buscar por filtro
  // endpoint: /postulantesValidosFiltro GET
  // params: tipoFiltro (cedula, idPostulante, apellido), valorFiltro
  // retorna: lista de PostulanteValido
  public buscarPorFiltro(tipoFiltro: string, valorFiltro: string): Observable<PostulanteValido[]> {
    const params = { tipoFiltro: tipoFiltro, valorFiltro: valorFiltro }
    return this.http.get<PostulanteValido[]>(`${ this.host }/${ this.nombreServicio }/postulantesValidosFiltro`, { params });
  }


  ///////////////////////////////////////
  // lista de inscripciones para monitoreo
  // postulantesValidosPaginadoOrderApellido
  // endpoint: /postulantesValidosPaginadoOrderApellido?page=1&size=10
  // params: page, size
  // retorna: lista de PaginacionPostulanteValido
  public listarTodoPaginado(page: number, size: number, orden: string): Observable<PaginacionPostulantesValidos> {
    const params = { page: page.toString(), size: size.toString() }

    if (orden == 'ID') {
      return this.http.get<PaginacionPostulantesValidos>(`${ this.host }/${ this.nombreServicio }/postulantesTodoPaginado`, { params });
    } else {
      return this.http.get<PaginacionPostulantesValidos>(`${ this.host }/${ this.nombreServicio }/postulantesTodoPaginadoOrderApellido`, { params });
    }
  }

  // buscar por filtro
  // endpoint: /postulantesValidosFiltro GET
  // params: tipoFiltro (cedula, idPostulante, apellido), valorFiltro
  // retorna: lista de PostulanteValido
  public buscarTodoPorFiltro(tipoFiltro: string, valorFiltro: string): Observable<PostulanteValido[]> {
    const params = { tipoFiltro: tipoFiltro, valorFiltro: valorFiltro }
    return this.http.get<PostulanteValido[]>(`${ this.host }/${ this.nombreServicio }/postulantesTodoFiltro`, { params });
  }


  // postulatesValidosEInvalidos
  listarPostulantesValidosEInvalidos() {
    return this.http.get<PostulanteItem[]>(`${ this.host }/postulantesValidos/resultadoPostulantes`);
  }

  listarPruebas() {
    return this.http.get<PruebaDetalleDatos[]>(`${ this.host }/pruebadetalle/listarConDatos`);
  }


}
