import { HttpEvent, HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../../modelo/admin/custom-http-response';
import { environment } from 'src/environments/environment';
import { InscripcionCompleta } from 'src/app/modelo/flujos/formacion/inscripcion-completa';
import { ValidaPinInscripcionUtil } from 'src/app/modelo/flujos/formacion/valida-pin-inscripcion-util';
import { InscripcionCompletaDto } from 'src/app/modelo/flujos/formacion/inscripcion-completa-dto';

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {
  private host = environment.apiUrl;
  constructor(private http: HttpClient) {}

  public cargarArchivo(formData: FormData): Observable<HttpEvent<CustomHttpResponse>> {
    let response: Observable<HttpEvent<CustomHttpResponse>>;

    try {
      response = this.http.post<CustomHttpResponse>(
        `${this.host}/usuario/guardarArchivo`,
        formData,
        {
          reportProgress: true,
          observe: 'events',
          headers: new HttpHeaders({ Accept: 'application/json' }),
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
  // ruta: inscripcionfor/crear
  public crearInscripcion(formData: FormData): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(
      `${this.host}/inscripcionfor/crear`,
      formData
    );
  }

  // genera pin
  // ruta: inscripcionfor/generaPin POST
  //
  public generarPin(codigoPostulante: number): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(
      `${this.host}/inscripcionfor/generaPin/${codigoPostulante}`, null
    );
  }

  // valida pin
  // ruta: inscripcionfor/validaPin POST
  // params: pin, codigoDatoPersonal, codigoPostulante

//   pin: string,
//  codigoDatoPersonal: number,
//  codigoPostulante: number 

  public validarPin(validaPin: ValidaPinInscripcionUtil): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(
      `${this.host}/inscripcionfor/validaPin`, validaPin
    );
  }

  // reenvio pin
  // ruta: inscripcionfor/reenvioPin POST
  // PARAMS: inscripcion
  public reenvioPin(
    inscripcion: InscripcionCompletaDto
  ): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(
      `${this.host}/inscripcionfor/reenvioPin`,
      inscripcion
    );
  }

  // validar fechas
  // retorna boolean si el período de inscirpcion esta activo
  // ruta: inscripcionfor/validafechas GET
  public validarFechas(): Observable<boolean> {
    return this.http.get<boolean>(`${this.host}/inscripcionfor/validafechas`);
  }

  // busca inscripcion por cédula
  // si existe ya no puede inscribirse
  // retorna boolean
  // PARAMS: cedula
  // ruta: inscripcionfor/{cedula} GET
  public buscarInscripcionPorCedula(cedula: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.host}/inscripcionfor/inscripcionPorCedula/${cedula}`
    );
  }

}
