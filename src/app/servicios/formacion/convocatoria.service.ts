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

  constructor(private http: HttpClient) {
  }

  crear(formData: FormData): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(`${this.host}/convocatoriafor/crear`, formData);
  }

  listar(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(`${this.host}/convocatoria/listar`);
  }

  getConvocatoriaActiva() {
    return this.http.get(`${this.host}/convocatoria/activa`);
  }

  actualizar(formData: FormData) {
    return this.http.post(`${this.host}/convocatoriafor/actualizar`, formData);
  }

}
