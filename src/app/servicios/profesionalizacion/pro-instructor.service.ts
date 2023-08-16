import {Injectable} from "@angular/core";
import {ProfesionalizacionService} from "./profesionalizacion.service";
import {Instructor, InstructorRequest} from "../../modelo/flujos/instructor";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class  ProInstructorService extends ProfesionalizacionService<Instructor, InstructorRequest>{


  constructor(http: HttpClient) {
    super(http);
    this.path = '/proInstructor';
  }

  getInstructorById(codUsuario: number) {
    return this.http.post<Instructor>(`${ this.host }/instructor/ByUser?codUsuario=${ codUsuario }`, {});
  }
}
