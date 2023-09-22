import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { DatoPersonal } from "../../../modelo/admin/dato-personal";


export interface  DatosSincronizados {
  datoPersonal: DatoPersonal;
  deApiFuncionario: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LlamamientoDosService {
  private host = environment.apiUrl

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  listarFuncionarios(){
    return this.http.get<DatosSincronizados[]>(`${this.host}/datopersonal/listarSincronizados`);
  }

}
