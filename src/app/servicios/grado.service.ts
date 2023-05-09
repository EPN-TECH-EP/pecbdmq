import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Grado} from "../modelo/admin/institucionales/grado";
import {Rango} from "../modelo/admin/institucionales/rango";

@Injectable({
  providedIn: 'root'
})
export class GradoService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getGrados() {
    return this.http.get<Grado[]>(`${this.host}/grado/listar`);
  }

  getRangosPorGrado(idGrado: number) {
    const params = {codGrado: idGrado?.toString()};
    return this.http.post<Rango[]>(
      `${this.host}/grado/listarRangos?`,
      {},
      {params}
    );
  }
}
