import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PruebaDetalle } from 'src/app/modelo/flujos/formacion/prueba-detalle';
import { PruebaDetalleDatos } from 'src/app/modelo/flujos/formacion/prueba-detalle-datos';
import { PruebaDetalleOrden } from 'src/app/modelo/flujos/formacion/prueba-detalle-orden';
import { environment } from 'src/environments/environment';


// implementación integración servicios
// para componente lista-pruebas

@Injectable({
  providedIn: 'root'
})
export class PruebaDetalleService {
  
  private host = environment.apiUrl;
  private nombreServicio: string = 'pruebadetalle';

  constructor(private http: HttpClient) {}

  public crear(PruebaDetalle: PruebaDetalle): Observable<HttpResponse<PruebaDetalle>> {
    return this.http.post<PruebaDetalle>(`${this.host}/${this.nombreServicio}/crear`, PruebaDetalle, {
      observe: 'response',
    });
  }

  public actualizar(PruebaDetalle: PruebaDetalle, codPruebaDetalle: any): Observable<HttpResponse<PruebaDetalle>> {
    return this.http.put<PruebaDetalle>(`${this.host}/${this.nombreServicio}/${codPruebaDetalle}`, PruebaDetalle, {
      observe: 'response',
    });
  }

  public eliminar(codPruebaDetalle: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/${this.nombreServicio}/${codPruebaDetalle}`);
  }

  public listarConDatosTipoPrueba(): Observable<PruebaDetalleDatos[]> {
    return this.http.get<PruebaDetalleDatos[]>(`${this.host}/${this.nombreServicio}/listarConDatos`);
  }

  public listar(): Observable<PruebaDetalle[]> {
    return this.http.get<PruebaDetalle[]>(`${this.host}/${this.nombreServicio}/listar`);
  }


  // reordenar pruebas formación
  // retorna boolean si el reordenamiento fue exitoso
  // parametros: lista de PruebaDetalleOrden
  // ruta: /reordenar POST
  public reordenar(listaOrden : PruebaDetalleOrden[]): Observable<HttpResponse<boolean>> {
    return this.http.post<boolean>(`${this.host}/${this.nombreServicio}/reordenar`, listaOrden, {
      observe: 'response',
    });
  }

  // tipo de resultado que se debe registrar en la prueba
  // endpóint tipoResultado
  public tipoResultadoPorPrueba(codPrueba: number): Observable<string> {
    let response = this.http.get<string>(`${this.host}/${this.nombreServicio}/tipoResultado/${codPrueba}`, {responseType: 'text' as 'json'});

    return response;
  } 


    
}
