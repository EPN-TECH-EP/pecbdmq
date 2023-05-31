import { HttpEvent, HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../../modelo/admin/custom-http-response';
import { environment } from 'src/environments/environment';
import { InscripcionCompleta } from 'src/app/modelo/flujos/formacion/inscripcion-completa';

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {
  private host = environment.apiUrl;
  constructor(private http: HttpClient) {}

  public cargarArchivo(
    formData: FormData
  ): Observable<HttpEvent<CustomHttpResponse>> {
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
/*
  // genera pin
  // ruta: inscripcionfor/generaPin PUT
  //codigoPostulante: number
  public generarPin(formData: FormData): Observable<CustomHttpResponse> {
    return this.http.put<CustomHttpResponse>(
      `${this.host}/inscripcionfor/generaPin`, formData
    );
  }

  // valida pin
  // ruta: inscripcionfor/validaPin GET
  // params: pin, codigoDatoPersonal, codigoPostulante

//   pin: string,
//  codigoDatoPersonal: number,
//  codigoPostulante: number 

  public validarPin(formData: FormData): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(
      `${this.host}/inscripcionfor/validaPin/${pin}/${codigoDatoPersonal}/${codigoPostulante}`
    );
  }

  // reenvio pin
  // ruta: inscripcionfor/reenvioPin PUT
  // PARAMS: inscripcion
  public reenvioPin(
    inscripcion: InscripcionCompleta
  ): Observable<CustomHttpResponse> {
    return this.http.put<CustomHttpResponse>(
      `${this.host}/inscripcionfor/reenvioPin`,
      inscripcion
    );
  }*/

}
