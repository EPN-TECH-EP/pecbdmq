import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";


export interface Funcionario {
  codFuncionario: number;
  operativo: boolean;
  fechaIngreso: Date;
  agrupacion: string;
  type: string;
  pin: string;
  nombres: string;
  apellidos: string;
  email: string
}

export interface DocumentoFuncionario {
  codDocumentoFuncionario: number;
  codFuncionario: number;
  codDocumento: number;
  esReconocimiento: boolean;
  esSancion: boolean;
  observacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<Funcionario[]>(`${this.host}/funcionario/listar`);
  }

  listarDocumentosReconocimiento(codFuncionario) {
    return this.http.get<DocumentoFuncionario[]>(`${this.host}/funcionarioDocumento/listarReconocimientosByFuncionario/${codFuncionario}`);
  }

  guardarDocumentoReconocimiento(data: FormData) {
    return this.http.post(`${this.host}/funcionarioDocumento/crearFully`, data);
  }

  eliminarDocumentoReconocimiento(codDocumentoFuncionario) {
    return this.http.delete(`${this.host}/funcionarioDocumento/${codDocumentoFuncionario}`);
  }

  enviarNotificacionMejoresProspectos(cantidad: number) {
    return this.http.post(`${this.host}/funcionario/enviarNotificacionProspecto?limiteProspectos=${cantidad}`, {});

  }
}
