import {Injectable} from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CustomHttpResponse} from '../../modelo/admin/custom-http-response';

@Injectable({
  providedIn: 'root',
})
export class ConvocatoriaService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getCodigoUnicoCreacion() {
    return this.http.get<string>(`${this.host}/convocatoria/codigoUnicoCreacion`, {responseType: 'text' as 'json'});
  }

  crear(formData: FormData): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(`${this.host}/convocatoriafor/crear`, formData);
  }

  getConvocatoriaActiva() {
    return this.http.get(`${this.host}/convocatoria/activa`);
  }

  actualizar(formData: FormData) {
    return this.http.post(`${this.host}/convocatoriafor/actualizar`, formData);
  }

}
