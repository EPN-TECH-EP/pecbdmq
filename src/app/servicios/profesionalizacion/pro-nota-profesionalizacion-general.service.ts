import {ProfesionalizacionService} from "./profesionalizacion.service";
import {
  ProNotaProfesionalizacionGeneralCreateUpdateDto,
  ProNotaProfesionalizacionGeneralDto
} from "../../modelo/flujos/profesionalizacion/pro-nota-profesionalizacion-general.models";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../../modelo/admin/custom-http-response";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ProNotaProfesionalizacionGeneralService extends ProfesionalizacionService<ProNotaProfesionalizacionGeneralDto, ProNotaProfesionalizacionGeneralDto> {
  constructor(http: HttpClient) {
    super(http);
    this.path = '/proNotaProfesionalizacionGeneral';
  }

  public crearGeneralConDocumentos(formData: FormData): Observable<ProNotaProfesionalizacionGeneralCreateUpdateDto> {
    return this.http.post<ProNotaProfesionalizacionGeneralCreateUpdateDto>(
      `${this.host}${this.path}/crearcondocumentos`,
      formData
    );
  }

  public getByMateriaParalelo(id: number): Observable<ProNotaProfesionalizacionGeneralDto> {
    return this.http.get<ProNotaProfesionalizacionGeneralDto>(`${this.host}${this.path}/${id}/paralelo`);
  }
}
