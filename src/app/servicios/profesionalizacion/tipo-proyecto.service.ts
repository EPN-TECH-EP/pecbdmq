import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Materia} from "../../modelo/admin/materias";
import {TipoProyecto} from "../../modelo/admin/tipo-proyecto";

@Injectable({
  providedIn: 'root',
})
export class TipoProyectoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar(): Observable<TipoProyecto[]> {
    return this.http.get<TipoProyecto[]>(`${this.host}/proTipoProyecto/listar`);
  }

  crear(tipoProyecto: TipoProyecto): Observable<HttpResponse<TipoProyecto>> {
    return this.http.post<TipoProyecto>(`${this.host}/proTipoProyecto/crear`, tipoProyecto, {observe: 'response'});
  }

  eliminar(codigo: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/proTipoProyecto/${codigo}`);
  }

  actualizar(tipoProyecto: TipoProyecto, codigo: any): Observable<HttpResponse<TipoProyecto>> {
    return this.http.put<TipoProyecto>(`${this.host}/proTipoProyecto/${codigo}`, tipoProyecto, {observe: 'response'});
  }


}
