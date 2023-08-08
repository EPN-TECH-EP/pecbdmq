import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { EspInstructorRequest, EspInstructorResponse, Instructor } from "../../modelo/flujos/instructor";

@Injectable({
  providedIn: 'root'
})
export class EspInstructorService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<EspInstructorResponse[]>(`${ this.host }/cursoInstructor/listar`);
  }

  listarPorCurso(codCurso: number) {
    return this.http.get<EspInstructorResponse[]>(`${ this.host }/cursoInstructor/listarInstructoresCurso/${ codCurso }`);
  }

  getInstructorById(codUsuario: number) {
    return this.http.post<Instructor>(`${ this.host }/cursoInstructor/ByUser?codUsuario=${ codUsuario }`, {});
  }

  crear(instructor: EspInstructorRequest) {
    return this.http.post<EspInstructorRequest>(`${ this.host }/cursoInstructor/crear`, instructor);
  }

  actualizar(instructor: EspInstructorResponse) {
    return this.http.put<EspInstructorRequest>(`${ this.host }/cursoInstructor/crear`, instructor);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.host}/cursoInstructor/${id}`);
  }

}
