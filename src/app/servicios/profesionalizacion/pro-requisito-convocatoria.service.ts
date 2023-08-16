import {Injectable} from '@angular/core';
import {HttpClient,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CustomHttpResponse} from '../../modelo/admin/custom-http-response';
import {ProRequisitoConvocatoria} from '../../modelo/admin/pro-requisito-convocatoria';
import {map} from 'rxjs/operators';
import {ProRequisitoConvocatoriaDto} from "../../modelo/flujos/profesionalizacion/pro-requisito-convocatoria.models";

@Injectable({
  providedIn: 'root',
})
export class ProRequisitoConvocatoriaService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listarByConvocatoria(idConvocatoria: number): Observable<ProRequisitoConvocatoria[]> { // TODO implement from right backend api
    return this.http.get<ProRequisitoConvocatoria[]>(`${this.host}/proConvocatoriaRequisito/listar`).pipe(
      map((reqConvocatoria: ProRequisitoConvocatoria[]) => {
        return reqConvocatoria.filter(reqConvItem => reqConvItem.codigoConvocatoria === idConvocatoria);
      })
    );
  }

  getByCodConvocatoria(idConvocatoria: number): Observable<ProRequisitoConvocatoriaDto[]> { // TODO implement from right backend api
    return this.http.get<ProRequisitoConvocatoriaDto[]>(`${this.host}/proConvocatoriaRequisito/datos/${idConvocatoria}`);
  }

  crear(proConvocatoria: ProRequisitoConvocatoria): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(`${this.host}/proConvocatoriaRequisito/crear`, proConvocatoria);
  }

  eliminar(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.host}/proConvocatoriaRequisito/${id}`);
  }

}
