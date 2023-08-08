import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { PaginacionResultadosPruebasDatos } from 'src/app/modelo/flujos/formacion/paginacion-resultados-pruebas-datos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResultadosPruebasService {
  private host = environment.apiUrl;
  private nombreServicioNoFisicas: string = 'pruebasNoFisicas';
  private nombreServicioFisicas: string = 'pruebasFisicas';
  private nombreServicioTodo: string = 'resultadoPruebaTodo';
  private nombreServicioNotificacionPruebas: string = 'notificacionprueba';

  constructor(private http: HttpClient) {}

  // obtener la lista de resultados por prueba paginado
  // url pruebasNoFisicas/resultados?page=0&size=10&subTipoPrueba=11&sort=2
  // params: page, size, subTipoPrueba, sort
  // retorna: lista de ResultadosPruebasDatos
  public listarPaginado(
    page: number,
    size: number,
    subTipoPrueba: number,
    sort: number
  ): Observable<PaginacionResultadosPruebasDatos> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      subTipoPrueba: subTipoPrueba.toString(),
      sort: sort.toString(),
    };
    return this.http.get<PaginacionResultadosPruebasDatos>(
      `${this.host}/${this.nombreServicioTodo}/resultadosPaginado`,
      {
        params,
      }
    );
  }

  // cargarPlantilla NoFisicas o fisicas por tipo prueba
  // public ResponseEntity<?> uploadFile(@RequestParam("archivo") MultipartFile archivo,@RequestParam("codPruebaDetalle") Integer codPruebaDetalle,@RequestParam("codFuncionario") Integer codFuncionario,@RequestParam("tipoResultado") String tipoResultado)
  // url pruebasNoFisicas/cargarPlantilla
  // params: archivo, codPruebaDetalle, codFuncionario, tipoResultado
  // retorna: OK o HttpErrorResponse
  public cargarPlantilla(
    archivo: File,
    codPruebaDetalle: number,
    //codFuncionario: number, // codFuncionario es para pruebas bomberiles
    tipoResultado: string,
    esFisica: boolean,
  ): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('codPruebaDetalle', codPruebaDetalle.toString());
    //formData.append('codFuncionario', null);
    formData.append('tipoResultado', tipoResultado);

    if (esFisica) {
      return this.http.post(`${this.host}/${this.nombreServicioFisicas}/cargarPlantilla`, formData);
    } else {
      return this.http.post(`${this.host}/${this.nombreServicioNoFisicas}/cargarPlantilla`, formData);
    }
  }

  // generar los documentos de aprobados por prueba
  ///resultadoPruebaTodo/generar
  // params: subTipoPrueba
  // retorna: OK o HttpErrorResponse
  public generarDocumentosAprobados(subTipoPrueba: number): Observable<any> {
    const formData = new FormData();
    formData.append('subTipoPrueba', subTipoPrueba.toString());
    return this.http.post(`${this.host}/${this.nombreServicioTodo}/generar`, formData);
  }


  // tipo: Excel o Pdf
  // params: id, nombreArchivo
  // descargar(tipo: string, id: number)
  // retorna: blob

  public descargar(tipo: string, id: number, nombrePrueba: string): Observable<any> {
    const params = {
      id: id.toString(),
      nombre: 'resultadosRegistrados' + nombrePrueba,
    };
    return this.http.get(`${this.host}/${this.nombreServicioTodo}/descargar${tipo}`, {
      responseType: 'blob',
      params,
    });
  }


  // notificar a los postulantes que aprobaron
  // url notificacionprueba/notificacionAprobados?codSubTipoPrueba=7
  // params: codSubTipoPrueba
  // retorna: OK o HttpErrorResponse
  public notificarAprobados(codSubTipoPrueba: number): Observable<any> {
    const params = {
      codSubTipoPrueba: codSubTipoPrueba.toString(),
    };
    return this.http.get(`${this.host}/${this.nombreServicioNotificacionPruebas}/aprobadosPorPrueba`, {
      params,
    });
  }

  //////////////// cursos ///////////////////////
  // generar los documentos de aprobados por prueba
  ///resultadoPruebaTodo/generar
  // params: subTipoPrueba
  // retorna: OK o HttpErrorResponse
  public generarDocumentosAprobadosCurso(subTipoPrueba: number, codCurso: number): Observable<any> {
    const formData = new FormData();
    formData.append('subTipoPrueba', subTipoPrueba.toString());
    formData.append('codCurso', codCurso.toString());
    return this.http.post(`${this.host}/${this.nombreServicioTodo}/generarParaCurso`, formData);
  }

  // notificar a los postulantes que aprobaron
  // url notificacionprueba/notificacionAprobados?codSubTipoPrueba=7
  // params: codSubTipoPrueba
  // retorna: OK o HttpErrorResponse
  public notificarAprobadosPruebasCurso(codSubTipoPrueba: number, codCurso: number): Observable<any> {
    const params = {
      codSubTipoPrueba: codSubTipoPrueba.toString(),
      codCurso: codCurso.toString(),
    };
    return this.http.get(`${this.host}/${this.nombreServicioNotificacionPruebas}/aprobadosPorPruebaCurso`, {
      params,
    });
  }

  // obtener la lista de resultados por prueba paginado
  // url pruebasNoFisicas/resultados?page=0&size=10&subTipoPrueba=11&sort=2
  // params: page, size, subTipoPrueba, sort
  // retorna: lista de ResultadosPruebasDatos
  public listarPaginadoCurso(
    page: number,
    size: number,
    subTipoPrueba: number,
    sort: number,
    codCurso: number
  ): Observable<PaginacionResultadosPruebasDatos> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sort: sort.toString(),
      subTipoPrueba: subTipoPrueba.toString(),
      codCurso: codCurso.toString(),
    };
    return this.http.get<PaginacionResultadosPruebasDatos>(
      `${this.host}/${this.nombreServicioTodo}/resultadosPaginadoCurso`,
      {
        params,
      }
    );
  }

  // tipo: Excel o Pdf
  // params: id, nombreArchivo
  // descargar(tipo: string, id: number)
  // retorna: blob

  public descargarCurso(tipo: string, id: number, nombrePrueba: string, codCurso: number): Observable<any> {
    const params = {
      id: id.toString(),
      nombre: 'resultadosRegistrados' + nombrePrueba,
      codCurso: codCurso.toString(),
    };
    return this.http.get(`${this.host}/${this.nombreServicioTodo}/descargar${tipo}Curso`, {
      responseType: 'blob',
      params,
    });
  }

}
