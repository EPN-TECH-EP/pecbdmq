import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Delegado } from "./delegado.service";
import { Instructor, InstructorRequest } from "../../modelo/flujos/instructor";
import { CustomHttpResponse } from "../../modelo/admin/custom-http-response";

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<Instructor[]>(`${ this.host }/instructor/listar`);
  }

  getInstructorById(codUsuario: number) {
    return this.http.post<Instructor>(`${ this.host }/instructor/ByUser?codUsuario=${ codUsuario }`, {});
  }

  crear(instructor: InstructorRequest) {
    return this.http.post<InstructorRequest>(`${ this.host }/instructor/crear`, instructor);
  }

  eliminar(codInstructor: number) {
    return this.http.delete<CustomHttpResponse>(`${ this.host }/instructor/${ codInstructor }`);
  }

  actualizar(codInstructor: number, instructorRequest: Instructor) {
    return this.http.put<InstructorRequest>(`${ this.host }/instructor/${ codInstructor }`, instructorRequest);
  }
}
