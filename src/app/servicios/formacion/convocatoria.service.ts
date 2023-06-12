import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CustomHttpResponse} from '../../modelo/admin/custom-http-response';
import {Convocatoria} from '../../modelo/admin/convocatoria';

@Injectable({
  providedIn: 'root',
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

  constructor(private http: HttpClient) {}

  //creación convocatoria
  // url convocatoriafor/crear
  // parámetros
  /*
  datosConvocatoria
  {"nombre": "CONVOCATORIA 026", "estado": "ACTIVO", "fechaInicioConvocatoria": "2026-06-01", "fechaFinConvocatoria": "2026-12-30", "horaInicioConvocatoria": "01:00", "horaFinConvocatoria": "23:59", "cupoHombres": 15, "cupoMujeres": 15, "correo": "fgallardo01@tech.epn.edu.ec", "requisitos": [{"codigoRequisito": 48},{"codigoRequisito": 49},{"codigoRequisito": 50}]}

  docsPeriodoAcademico

  docsConvocatoria
*/
  public crearConvocatoria(
    formData: FormData
  ): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(`${this.host}/convocatoriafor/crear`, formData
    );
  }

  // ANTERIOR

  public getConvocatoria(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(`${this.host}/convocatoria/listar`);
  }
  
  getConvocatoriaActiva() {
    return this.http.get(`${this.host}/convocatoria/activa`);
    }
    
      actualizar(formData: FormData) {
    return this.http.post(`${this.host}/convocatoriafor/actualizar`, formData);
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
