import { Provincia } from '../modelo/admin/provincia';
import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse, HttpErrorResponse,HttpEvent,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/admin/custom-http-response';
@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  private host = environment.apiUrl;
  constructor(private http: HttpClient) {}
  public getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.host}/provincia/listar`);
  }
}
