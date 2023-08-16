import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CustomHttpResponse} from '../../modelo/admin/custom-http-response';
import {environment} from 'src/environments/environment';
import {ValidaPinInscripcionUtil} from 'src/app/modelo/flujos/formacion/valida-pin-inscripcion-util';
import {InscripcionCompletaDto} from 'src/app/modelo/flujos/formacion/inscripcion-completa-dto';
import {ProInscripcion} from '../../modelo/admin/profesionalizacion/pro-inscripcion';
import {ProInscripcionDto} from '../../modelo/admin/pro-inscripcion-dto';

@Injectable({
  providedIn: 'root',
})
export class ProInscripcionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }


  listar(): Observable<ProInscripcion[]> {
    return this.http.get<ProInscripcion[]>(`${this.host}/proInscripcion/listar`);
  }

  public cargarArchivo(formData: FormData): Observable<HttpEvent<CustomHttpResponse>> {
    let response: Observable<HttpEvent<CustomHttpResponse>>;

    try {
      response = this.http.post<CustomHttpResponse>(
        `${this.host}/usuario/guardarArchivo`,
        formData,
        {
          reportProgress: true,
          observe: 'events',
          headers: new HttpHeaders({Accept: 'application/json'}),
        }
      );

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  public maxArchivo(): Observable<number> {
    let response: Observable<number>;

    try {
      response = this.http.get<number>(`${this.host}/usuario/maxArchivo`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // crear inscripcion
  // ruta: proInscripcion/crear
  public crearInscripcion(formData: ProInscripcion): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(
      `${this.host}/proInscripcion/crear`,
      formData
    );
  }

  public crearInscripcionConDocumentos(formData: FormData): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(
      `${this.host}/proInscripcion/crearcondocumentos`,
      formData
    );
  }

  // genera pin
  // ruta: proInscripcion/generaPin POST
  //
  public generarPin(codigoPostulante: number): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(
      `${this.host}/proInscripcion/generaPin/${codigoPostulante}`, null
    );
  }

  public validarPin(validaPin: ValidaPinInscripcionUtil): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(
      `${this.host}/proInscripcion/validaPin`, validaPin
    );
  }

  // reenvio pin
  // ruta: proInscripcion/reenvioPin POST
  // PARAMS: inscripcion
  public reenvioPin(
    inscripcion: InscripcionCompletaDto
  ): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(
      `${this.host}/proInscripcion/reenvioPin`,
      inscripcion
    );
  }

  // validar fechas
  // retorna boolean si el período de inscirpcion esta activo
  // ruta: proInscripcion/validafechas GET
  public validarFechas(): Observable<boolean> {
    return of(true)
    // return this.http.get<boolean>(`${this.host}/proInscripcion/validafechas`); TODO rollback
  }

  // busca inscripcion por cédula
  // si existe ya no puede inscribirse
  // retorna boolean
  // PARAMS: cedula
  // ruta: proInscripcion/{cedula} GET
  public buscarInscripcionPorCedula(cedula: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.host}/proInscripcion/inscripcionPorCedula/${cedula}`
    );
  }

  // validar edad
  // retorna boolean si la edad es válida para el proceso
  // PARAMS: fecha en BODY
  // ruta: proInscripcion/validaEdad POST
  public validarEdad(fecha: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.host}/proInscripcion/validaEdad`, fecha);
  }

  listByConvocatoria(idConvocatoria: number) {
    return this.http.get<ProInscripcionDto[]>(`${this.host}/proInscripcion/datos/${idConvocatoria}/listar`);
  }
}

