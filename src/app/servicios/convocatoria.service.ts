import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../modelo/custom-http-response';
import { Convocatoria } from '../modelo/convocatoria';

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService {
  private host = environment.apiUrl;
  inputData: string;


  setInputData(data: string) {
    this.inputData = data;
  }

  getInputData() {
    return this.inputData;
  }

  constructor(private http: HttpClient) { }
  public getConvocatoria(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(`${this.host}/convocatoria/listar`);
  }


  // public registroMateria(convocatoria: Convocatoria): Observable<HttpResponse<Convocatoria>> {
  //   return this.http.post<Convocatoria>(`${this.host}/materia/crear`, materia, { observe: 'response' });
  // }

    // public eliminarConvocatoria(codMateria: number): Observable<string> {
    // return this.http.delete<string>(`${this.host}/materia/${codMateria}`);
    // }
   public actualizarConvocatoria(convocatoria: Convocatoria, codigo_convocatoria:any): Observable<HttpResponse<Convocatoria>> {
    return this.http.put<Convocatoria>(`${this.host}/convocatoria/${codigo_convocatoria}`, convocatoria, { observe: 'response' });
  }

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
      console.log('catch CargaArchivoService');
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
}