import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Delegado } from "./delegado.service";
import { Instructor } from "../../modelo/flujos/instructor";

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
}
