import {Injectable} from '@angular/core';
import {HttpClient,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CustomHttpResponse} from '../../modelo/admin/custom-http-response';
import {ProConvocatoria} from '../../modelo/admin/pro-convocatoria';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProConvocatoriaService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getCodigoUnicoCreacion() {
    return this.http.get<string>(`${this.host}/proConvocatoria/codigoUnicoCreacion`, {responseType: 'text' as 'json'});
  }

  crear(formData: ProConvocatoria): Observable<ProConvocatoria> {
    return this.http.post<ProConvocatoria>(`${this.host}/proConvocatoria/crear`, formData);
  }

  getConvocatoriaActiva(): Observable<ProConvocatoria> { // TODO replace with right api
    return this.http.get(`${this.host}/proConvocatoria/listar`).pipe(
      map((convocatorias: ProConvocatoria[]) => {
        return convocatorias.find(convocatoria => convocatoria.estado === 'ACTIVO');
      })
    );
  }

  actualizar(proConvocatoria: ProConvocatoria) {
    return this.http.put(`${this.host}/proConvocatoria/${ proConvocatoria.codigo }`, proConvocatoria);
  }

  listar(): Observable<ProConvocatoria[]>{
    return this.http.get<ProConvocatoria[]>(`${this.host}/proConvocatoria/listar`);
  }

  listarActiva(): Observable<ProConvocatoria[]>{
    return this.http.get<ProConvocatoria[]>(`${this.host}/proConvocatoria/listarActiva`);
  }

  getConvocatoriaPeriodo(periodo: number): Observable<ProConvocatoria>{
    return this.http.get<ProConvocatoria>(`${this.host}/proConvocatoria/${periodo}/periodo`);
  }

  updateEstadoConvocatoria(convocatoria: number, estado: String): Observable<ProConvocatoria>{
    return this.http.post<ProConvocatoria>(`${this.host}/proConvocatoria/${convocatoria}/actualizaEstado`,estado);
  }

  getEstadoActual(): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${ this.host }/proConvocatoria/validaEstado`);
  }

}
