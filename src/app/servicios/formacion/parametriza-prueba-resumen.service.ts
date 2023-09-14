import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParametrizaPruebaDetalle } from 'src/app/modelo/flujos/formacion/parametriza-prueba-detalle';
import { ParametrizaPruebaResumen } from 'src/app/modelo/flujos/formacion/parametriza-prueba-resumen';
import { ParametrizaPruebaResumenDatos } from 'src/app/modelo/flujos/formacion/parametriza-prueba-resumen-datos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrizaPruebaService {

  private host = environment.apiUrl;
  private nombreServicio: string = 'parametrizaPruebaResumen';
  private nombreServicioDetalle: string = 'parametrizaPruebaDetalle';

  constructor(private http: HttpClient) {}

  /////////////////////////
  // servicios resumen

  public listarConDatosSubtipoPrueba(): Observable<ParametrizaPruebaResumenDatos[]> {
    return this.http.get<ParametrizaPruebaResumenDatos[]>(`${this.host}/${this.nombreServicio}/listarConDatos`);
  }

  /*public actualizar(parametrizaPruebaResumen: ParametrizaPruebaResumen, cod: any): Observable<HttpResponse<ParametrizaPruebaResumen>> {
    return this.http.put<ParametrizaPruebaResumen>(`${this.host}/${this.nombreServicio}/${cod}`, parametrizaPruebaResumen, {
      observe: 'response',
    });
  }*/

  ///////////////////////
  // servicios detalle
  public listarPorResumen(codResumen: number): Observable<ParametrizaPruebaDetalle[]> {
    return this.http.get<ParametrizaPruebaDetalle[]>(`${this.host}/${this.nombreServicioDetalle}/listarPorResumen/${codResumen}`);
  }

  public actualizar(parametrizaPruebaDetalle: ParametrizaPruebaDetalle, cod: number): Observable<HttpResponse<ParametrizaPruebaDetalle>> {
    return this.http.put<ParametrizaPruebaDetalle>(`${this.host}/${this.nombreServicioDetalle}/${cod}`, parametrizaPruebaDetalle, {
      observe: 'response',
    });
  }

  actualizarPonderacion(cod: number, data: any ){
    return this.http.put(`${this.host}/parametrizaPruebaResumen/${cod}`, data);
  }

}
