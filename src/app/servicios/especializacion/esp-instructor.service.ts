import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { EspInstructorDto, Instructor } from "../../modelo/flujos/instructor";

@Injectable({
  providedIn: 'root'
})
export class EspInstructorService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<Instructor[]>(`${ this.host }/cursoInstructor/listar`);
  }

  getInstructorById(codUsuario: number) {
    return this.http.post<Instructor>(`${ this.host }/cursoInstructor/ByUser?codUsuario=${ codUsuario }`, {});
  }

  crear(instructor: EspInstructorDto) {
    return this.http.post<EspInstructorDto>(`${ this.host }/cursoInstructor/crear`, instructor);
  }

}
