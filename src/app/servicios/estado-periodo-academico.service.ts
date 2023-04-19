import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpResponse, HttpErrorResponse,HttpEvent,} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadoPeriodoAcademicoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}
}
