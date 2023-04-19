import { Semestre } from 'src/app/modelo//semestre';
import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse, HttpErrorResponse,HttpEvent,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/custom-http-response';
import { Periodo } from '../modelo/periodo_academico';


@Injectable({providedIn: 'root',})

export class PeriodoAcademicoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getPeriodo(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${this.host}/periodoacademico/listar`);
  }
  public getEstadoPeriodoAcademico(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${this.host}/periodoacademico/validaestado`);
  }

  public registroPeriodoAcademico(periodo: Periodo): Observable<HttpResponse<Periodo>> {
    return this.http.post<Periodo>(`${this.host}/periodoacademico/crear`, periodo, { observe: 'response' });
  }

    public eliminarPeriodoAcademico(codigo: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/periodoacademico/${codigo}`);
    }
   public actualizarPeriodoAcademico(periodo: Periodo, codigo:any): Observable<HttpResponse<Periodo>> {
    return this.http.put<Periodo>(`${this.host}/periodoacademico/${codigo}`, periodo, { observe: 'response' });
  }

  // public obtener1PeriodoAcademico(codigo: number): Observable<string> {
  //   return this.http.get<string>(`${this.host}/periodoacademico/${codigo}`);
  //   }

  }
